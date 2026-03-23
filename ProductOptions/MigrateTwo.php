<?php

namespace Flyn\ProductOptions;

use WP_Post;
use Exception;

/**
 * Migrates TM Extra Product Options global forms to Product Addons (prad_option).
 */
class MigrateTwo {
	/**
	 * Map of TM EPO element type => product-addons block type.
	 */
	private const TYPE_MAP = array(
		'selectbox'    => 'select',
		'radiobuttons' => 'radio',
		'checkboxes'   => 'checkbox',
		'textfield'    => 'textfield',
		'textarea'     => 'textarea',
		'header'       => 'content',
	);

	/**
	 * Run the migration.
	 *
	 * @param bool          $dry_run         If true, only report what would happen; do not write to DB.
	 * @param bool          $delete_existing If true, remove all existing prad_option posts before migrating.
	 * @param callable|null $logger          Optional callable for progress output.
	 *
	 * @return array{migrated: int, skipped: int, warnings: array, mappings: array}
	 */
	public function run( bool $dry_run = false, bool $delete_existing = false, ?callable $logger = null ): array {
		global $wpdb;

		$log = $logger ?? static function ( string $msg ) {
			echo $msg . "\n";
		};

		if ( $delete_existing && ! $dry_run ) {
			$existing_ids = $wpdb->get_col(
				"SELECT ID FROM {$wpdb->posts} WHERE post_type='prad_option'"
			);
			foreach ( $existing_ids as $eid ) {
				wp_delete_post( (int) $eid, true );
			}
			$wpdb->query(
				"DELETE FROM {$wpdb->postmeta} WHERE meta_key IN ('prad_product_assigned_meta_inc', 'prad_base_assigned_data')"
			);
			$log( 'Deleted ' . count( $existing_ids ) . ' existing prad_option posts and product meta.', 'log' );
		}

		$post_ids = $wpdb->get_col(
			"SELECT ID FROM {$wpdb->posts} WHERE post_type='tm_global_cp' AND post_status='publish'"
		);

		$log( 'Found ' . count( $post_ids ) . ' TM EPO global forms to migrate.', 'log' );

		$mappings = array();
		$warnings = array();
		$migrated = 0;
		$skipped  = 0;

		foreach ( $post_ids as $post_id ) {
			$post = get_post( (int) $post_id );
			if ( ! $post ) {
				$log( "  [SKIP] Post {$post_id} not found.", 'warning' );
				++$skipped;
				continue;
			}

			try {
				$post_warnings = array();
				$options_list  = $this->convert_epo_post_to_prad( $post, $post_warnings );

				if ( ! empty( $post_warnings ) ) {
					$warnings[ 'Post ' . $post_id ] = $post_warnings;
				}

				$log(
					"  [{$post_id}] \"{$post->post_title}\" -> " . count( $options_list['blocks'] ) . ' block(s)' . ( ! empty( $post_warnings ) ? ' (' . count( $post_warnings ) . ' warning(s))' : '' ),
					'log'
				);

				if ( ! $dry_run ) {
					$prad_post_id          = $this->create_prad_option_post( $options_list );
					$mappings[ $post_id ]  = $prad_post_id;
					++$migrated;
				} else {
					$mappings[ $post_id ] = 'DRY-' . $post_id;
					++$migrated;
				}
			} catch ( Exception $e ) {
				$log( "  [ERROR] Post {$post_id}: " . $e->getMessage(), 'error' );
				++$skipped;
			}
		}

		$assignments     = $this->migrate_product_assignments( $mappings, $dry_run, $log );
		$direct_migrate  = $this->migrate_direct_product_forms( $dry_run, $log );
		$migrated       += $direct_migrate['migrated'];
		$skipped        += $direct_migrate['skipped'];
		$assignments    += $direct_migrate['assignments'];
		$warnings        = array_merge( $warnings, $direct_migrate['warnings'] );

		$log( '', 'log' );
		$log( "Migration complete: {$migrated} migrated, {$skipped} skipped, {$assignments} product assignments made.", 'log' );

		if ( ! empty( $warnings ) ) {
			$log( '', 'log' );
			$log( 'Warnings:', 'log' );
			foreach ( $warnings as $source => $msgs ) {
				$log( "  {$source}:", 'warning' );
				foreach ( $msgs as $msg ) {
					$log( "    - {$msg}", 'warning' );
				}
			}
		}

		return array(
			'migrated' => $migrated,
			'skipped'  => $skipped,
			'warnings' => $warnings,
			'mappings' => $mappings,
		);
	}

	/**
	 * Convert a single TM EPO post into the product-addons options array.
	 *
	 * @param WP_Post $post     The TM EPO post.
	 * @param array   $warnings Mutable list of warning strings for this post.
	 *
	 * @return array{title: string, blocks: array}
	 */
	public function convert_epo_post_to_prad( WP_Post $post, array &$warnings ): array {
		$tm_meta = get_post_meta( $post->ID, 'tm_meta', true );
		$tm_meta = maybe_unserialize( $tm_meta );

		if (
			empty( $tm_meta ) ||
			! is_array( $tm_meta ) ||
			! isset( $tm_meta['tmfbuilder'] ) ||
			! is_array( $tm_meta['tmfbuilder'] )
		) {
			throw new Exception( "No valid tm_meta.tmfbuilder found for post {$post->ID}." );
		}

		if ( function_exists( 'THEMECOMPLETE_EPO_HELPER' ) ) {
			$tm_meta = THEMECOMPLETE_EPO_HELPER()->recreate_element_ids( $tm_meta );
		}

		$tmf = $tm_meta['tmfbuilder'];

		$options_list = array(
			'title'  => $post->post_title,
			'blocks' => array(),
		);

		$element_types = $tmf['element_type'] ?? array();
		$count         = count( $element_types );

		$sections_counts  = $tmf['sections'] ?? array();
		$sections_names   = $tmf['sections_internal_name'] ?? array();
		$sections_uniqids = $tmf['sections_uniqid'] ?? array();
		$sections_clogic  = $tmf['sections_clogic'] ?? array();
		$sections_logic   = $tmf['sections_logic'] ?? array();
		$has_sections     = ! empty( $sections_counts ) && count( $sections_counts ) > 0;

		$uniqid_to_blockid = array();

		$all_element_blocks = array();
		$type_counters      = array();

		for ( $i = 0; $i < $count; $i++ ) {
			$type = $element_types[ $i ];

			if ( ! isset( self::TYPE_MAP[ $type ] ) ) {
				$warnings[] = "Element {$i}: Unknown type \"{$type}\". Skipping.";
				continue;
			}

			$type_counters[ $type ] = $type_counters[ $type ] ?? 0;
			$ti                     = $type_counters[ $type ];
			++$type_counters[ $type ];

			$prad_type = self::TYPE_MAP[ $type ];
			$blockid   = $post->ID . '_' . $i;

			$element_uniqid = $this->get_col_value( $tmf, "{$type}_uniqid", $ti, '' );
			if ( ! empty( $element_uniqid ) ) {
				$uniqid_to_blockid[ $element_uniqid ] = $blockid;
			}

			$uniqid_to_blockid[ '__idx_' . $i ] = $blockid;

			$label       = $this->get_col_value( $tmf, "{$type}_header_title", $ti, '' );
			$description = $this->get_col_value( $tmf, "{$type}_header_subtitle", $ti, '' );
			$required    = ! empty( $this->get_col_value( $tmf, "{$type}_required", $ti, '' ) );

			$block = array(
				'type'            => $prad_type,
				'blockid'         => $blockid,
				'label'           => (string) $label,
				'desc'            => '',
				'description'     => (string) $description,
				'hide'            => false,
				'required'        => $required,
				'imgStyle'        => 'normal',
				'class'           => '',
				'id'              => '',
				'_options'        => array(),
				'fieldConditions' => array(
					'condition' => array(
						'match'      => 'all',
						'visibility' => 'show',
					),
					'rules'     => array(),
				),
				'descpPosition'   => 'belowField',
			);

			if ( 'content' === $prad_type ) {
				$header_size = $this->get_col_value( $tmf, 'header_size', $ti, '3' );
				$tag_map     = array(
					'1' => 'h1',
					'2' => 'h2',
					'3' => 'h3',
					'4' => 'h4',
					'5' => 'h5',
					'6' => 'h6',
					'7' => 'p',
					'8' => 'div',
					'9' => 'span',
				);
				$tag         = $tag_map[ $header_size ] ?? 'h3';

				$header_title    = $this->get_col_value( $tmf, 'header_title', $ti, '' );
				$header_subtitle = $this->get_col_value( $tmf, 'header_subtitle', $ti, '' );

				$preview_parts = array();
				if ( ! empty( $header_title ) ) {
					$preview_parts[] = "<{$tag}>" . esc_html( $header_title ) . "</{$tag}>";
				}
				if ( ! empty( $header_subtitle ) ) {
					$preview_parts[] = $header_subtitle;
				}

				$block['previewContent'] = implode( "\n", $preview_parts );
				unset( $block['label'], $block['desc'], $block['description'], $block['required'], $block['_options'], $block['imgStyle'], $block['descpPosition'] );

				$all_element_blocks[ $i ] = $block;
				continue;
			}

			if ( in_array( $prad_type, array( 'textfield', 'textarea' ), true ) ) {
				$placeholder = $this->get_col_value( $tmf, "{$type}_placeholder", $ti, '' );
				if ( ! empty( $placeholder ) ) {
					$block['placeholder'] = $placeholder;
				}
				$all_element_blocks[ $i ] = $block;
				continue;
			}

			$block['_options'] = $this->build_options( $tmf, $type, $ti, $blockid, $warnings );

			if (
				empty( $label ) &&
				empty( $description ) &&
				empty( $block['_options'] )
			) {
				$warnings[] = "Element {$i} ({$type}): Empty label, description, and options. Skipping.";
				continue;
			}

			$all_element_blocks[ $i ] = $block;
		}

		if ( $has_sections && count( $sections_counts ) > 1 ) {
			$elem_offset = 0;
			foreach ( $sections_counts as $sec_idx => $sec_count ) {
				$section_blockid = $post->ID . '_sec_' . $sec_idx;
				$section_label   = $sections_names[ $sec_idx ] ?? '';
				$section_uniqid  = $sections_uniqids[ $sec_idx ] ?? '';

				if ( ! empty( $section_uniqid ) ) {
					$uniqid_to_blockid[ $section_uniqid ] = $section_blockid;
				}

				for ( $j = 0; $j < (int) $sec_count; $j++ ) {
					$elem_idx             = $elem_offset + $j;
					$elem_section_uniqid  = $this->get_col_value( $tmf, 'sections_uniqid', $elem_idx, '' );
					if ( ! empty( $elem_section_uniqid ) && isset( $all_element_blocks[ $elem_idx ] ) ) {
						if ( ! isset( $uniqid_to_blockid[ $elem_section_uniqid ] ) ||
							$uniqid_to_blockid[ $elem_section_uniqid ] === $section_blockid ) {
							$uniqid_to_blockid[ $elem_section_uniqid ] = $all_element_blocks[ $elem_idx ]['blockid'];
						}
					}
				}

				$inner_blocks = array();
				for ( $j = 0; $j < (int) $sec_count; $j++ ) {
					$elem_idx = $elem_offset + $j;
					if ( isset( $all_element_blocks[ $elem_idx ] ) ) {
						$inner_block              = $all_element_blocks[ $elem_idx ];
						$inner_block['sectionid'] = $section_blockid;
						$inner_blocks[]           = $inner_block;
					}
				}

				$section_block = array(
					'type'            => 'section',
					'blockid'         => $section_blockid,
					'label'           => (string) $section_label,
					'class'           => '',
					'id'              => '',
					'hide'            => false,
					'required'        => false,
					'showAccordion'   => false,
					'innerBlocks'     => $inner_blocks,
					'en_logic'        => false,
					'fieldConditions' => array(
						'condition' => array(
							'match'      => 'all',
							'visibility' => 'show',
						),
						'rules'     => array(),
					),
				);

				$options_list['blocks'][] = $section_block;
				$elem_offset             += (int) $sec_count;
			}
		} else {
			foreach ( $all_element_blocks as $block ) {
				$options_list['blocks'][] = $block;
			}

			for ( $i = 0; $i < $count; $i++ ) {
				$section_uniqid = $this->get_col_value( $tmf, 'sections_uniqid', $i, '' );
				if ( ! empty( $section_uniqid ) && isset( $all_element_blocks[ $i ] ) ) {
					$uniqid_to_blockid[ $section_uniqid ] = $all_element_blocks[ $i ]['blockid'];
				}
			}
		}

		$options_list['blocks'] = $this->apply_conditional_logic(
			$options_list['blocks'],
			$tmf,
			$element_types,
			$uniqid_to_blockid,
			$post->ID,
			$warnings
		);

		if ( $has_sections && count( $sections_counts ) > 1 ) {
			$options_list['blocks'] = $this->apply_section_conditional_logic(
				$options_list['blocks'],
				$sections_clogic,
				$sections_logic,
				$uniqid_to_blockid,
				$tmf,
				$post->ID,
				$warnings
			);
		}

		return $options_list;
	}

	/**
	 * Build options array for select/radio/checkbox blocks.
	 *
	 * @param array  $tmf      The tmfbuilder columnar array.
	 * @param string $type     TM EPO element type.
	 * @param int    $i        Per-type index.
	 * @param string $blockid  The block id prefix.
	 * @param array  $warnings Mutable warnings list.
	 *
	 * @return array
	 */
	private function build_options( array $tmf, string $type, int $i, string $blockid, array &$warnings ): array {
		$options = array();

		$titles      = $this->get_col_json_array( $tmf, "multiple_{$type}_options_title", $i );
		$values      = $this->get_col_json_array( $tmf, "multiple_{$type}_options_value", $i );
		$prices      = $this->get_col_json_array( $tmf, "multiple_{$type}_options_price", $i );
		$sale_prices = $this->get_col_json_array( $tmf, "multiple_{$type}_options_sale_price", $i );
		$images      = $this->get_col_json_array( $tmf, "multiple_{$type}_options_image", $i );
		$images_p    = $this->get_col_json_array( $tmf, "multiple_{$type}_options_imagep", $i );
		$descs       = $this->get_col_json_array( $tmf, "multiple_{$type}_options_description", $i );
		$enabled     = $this->get_col_json_array( $tmf, "multiple_{$type}_options_enabled", $i );

		if ( empty( $titles ) ) {
			return array();
		}

		foreach ( $titles as $k => $title ) {
			if ( isset( $enabled[ $k ] ) && '0' === $enabled[ $k ] ) {
				continue;
			}

			$raw_price      = $prices[ $k ] ?? '';
			$raw_sale_price = $sale_prices[ $k ] ?? '';

			$img = '';
			if ( ! empty( $images[ $k ] ) ) {
				$img = $images[ $k ];
			} elseif ( ! empty( $images_p[ $k ] ) ) {
				$img = $images_p[ $k ];
			}

			$option = array(
				'value'   => (string) ( $values[ $k ] ?? $title ),
				'label'   => (string) $title,
				'type'    => 'fixed',
				'regular' => is_numeric( $raw_price ) ? (float) $raw_price : 0,
				'sale'    => is_numeric( $raw_sale_price ) ? (string) $raw_sale_price : '',
				'uid'     => $blockid . '_o' . $k,
				'img'     => (string) $img,
			);

			if ( ! empty( $descs[ $k ] ) ) {
				$option['description'] = (string) $descs[ $k ];
			}

			$options[] = $option;
		}

		return $options;
	}

	/**
	 * Apply element conditional logic.
	 */
	private function apply_conditional_logic( array $blocks, array $tmf, array $element_types, array $uniqid_to_blockid, int $post_id, array &$warnings ): array {
		$block_map = array();
		$this->build_block_map_recursive( $blocks, $block_map );

		$count = count( $element_types );

		$sections_counts     = $tmf['sections'] ?? array();
		$elem_offset         = 0;
		$section_offset_map  = array();
		foreach ( $sections_counts as $sec_count ) {
			$sec_uniqid = '';
			if ( isset( $tmf['sections_uniqid'][ $elem_offset ] ) ) {
				$sec_uniqid = $tmf['sections_uniqid'][ $elem_offset ];
			}
			if ( ! empty( $sec_uniqid ) ) {
				$section_offset_map[ $sec_uniqid ] = $elem_offset;
			}
			$elem_offset += (int) $sec_count;
		}

		$type_counters = array();

		for ( $i = 0; $i < $count; $i++ ) {
			$type    = $element_types[ $i ];
			$blockid = $post_id . '_' . $i;

			$type_counters[ $type ] = $type_counters[ $type ] ?? 0;
			$ti                     = $type_counters[ $type ];
			++$type_counters[ $type ];

			if ( ! isset( $block_map[ $blockid ] ) ) {
				continue;
			}

			$logic_enabled = $this->get_col_value( $tmf, "{$type}_logic", $ti, '' );
			if ( '1' !== $logic_enabled ) {
				continue;
			}

			$logicrules_raw = $this->get_col_value( $tmf, "{$type}_logicrules", $ti, '' );

			if ( empty( $logicrules_raw ) || 'false' === $logicrules_raw ) {
				$logicrules_raw = $this->get_col_value( $tmf, "{$type}_clogic", $ti, '' );
			}

			if ( empty( $logicrules_raw ) || 'false' === $logicrules_raw ) {
				continue;
			}

			$logic = json_decode( $logicrules_raw, true );

			if ( ! is_array( $logic ) || empty( $logic['rules'] ) ) {
				continue;
			}

			$prad_rules = array();
			$match      = isset( $logic['what'] ) && 'all' === $logic['what'] ? 'all' : 'any';
			$visibility = isset( $logic['toggle'] ) && 'hide' === $logic['toggle'] ? 'hide' : 'show';

			$raw_rules = $logic['rules'];
			if ( ! empty( $raw_rules ) && is_array( $raw_rules[0] ) && isset( $raw_rules[0][0] ) && is_array( $raw_rules[0][0] ) ) {
				$raw_rules = array_merge( ...$raw_rules );
			}

			foreach ( $raw_rules as $rule ) {
				if ( empty( $rule ) || ! is_array( $rule ) || ! isset( $rule['section'] ) ) {
					continue;
				}

				$ref_uniqid   = $rule['section'];
				$rule_element = $rule['element'] ?? null;
				$operator     = $rule['operator'] ?? 'is';
				$value        = isset( $rule['value'] ) ? urldecode( $rule['value'] ) : '';

				if ( empty( $ref_uniqid ) ) {
					continue;
				}

				$ref_blockid = null;

				if ( isset( $section_offset_map[ $ref_uniqid ] ) && is_numeric( $rule_element ) ) {
					$global_idx  = $section_offset_map[ $ref_uniqid ] + (int) $rule_element;
					$ref_blockid = $post_id . '_' . $global_idx;
				} elseif ( isset( $uniqid_to_blockid[ $ref_uniqid ] ) ) {
					$ref_blockid = $uniqid_to_blockid[ $ref_uniqid ];
				}

				if ( null === $ref_blockid ) {
					$warnings[] = "Element {$i} ({$type}) conditional: Cannot map sections_uniqid \"{$ref_uniqid}\" to a block. Skipping rule.";
					continue;
				}

				if ( ! isset( $block_map[ $ref_blockid ] ) ) {
					$warnings[] = "Element {$i} ({$type}) conditional: Referenced block \"{$ref_blockid}\" not found. Skipping rule.";
					continue;
				}

				$ref_block = $block_map[ $ref_blockid ];
				$compare   = $this->map_operator( $operator );

				$prad_rule = array(
					'field'   => $ref_block['blockid'],
					'compare' => $compare,
				);

				if ( ! empty( $value ) && in_array( $compare, array( '_is', '_not_is' ), true ) ) {
					$option_value = $this->get_option_value_by_match( $ref_block, $value );
					if ( null === $option_value ) {
						$warnings[] = "Element {$i} ({$type}) conditional: Cannot find option for value \"{$value}\" in block \"{$ref_blockid}\". Skipping rule.";
						continue;
					}
					$prad_rule['value'] = $option_value;
				} elseif ( ! empty( $value ) ) {
					$prad_rule['value'] = $value;
				}

				$prad_rules[] = $prad_rule;
			}

			if ( ! empty( $prad_rules ) ) {
				$block_map[ $blockid ]['en_logic']        = true;
				$block_map[ $blockid ]['fieldConditions'] = array(
					'condition' => array(
						'match'      => $match,
						'visibility' => $visibility,
					),
					'rules'     => $prad_rules,
				);
			}
		}

		return array_values( $blocks );
	}

	/**
	 * Recursively build a blockid => block reference map.
	 */
	private function build_block_map_recursive( array &$blocks, array &$block_map ): void {
		foreach ( $blocks as &$block ) {
			$block_map[ $block['blockid'] ] = &$block;
			if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$this->build_block_map_recursive( $block['innerBlocks'], $block_map );
			}
		}
		unset( $block );
	}

	/**
	 * Apply section conditional logic.
	 */
	private function apply_section_conditional_logic( array $blocks, array $sections_clogic, array $sections_logic, array $uniqid_to_blockid, array $tmf, int $post_id, array &$warnings ): array {
		$block_map = array();
		$this->build_block_map_recursive( $blocks, $block_map );

		$sections_counts    = $tmf['sections'] ?? array();
		$elem_offset        = 0;
		$section_offset_map = array();
		foreach ( $sections_counts as $s_count ) {
			$sec_uniqid = $tmf['sections_uniqid'][ $elem_offset ] ?? '';
			if ( ! empty( $sec_uniqid ) ) {
				$section_offset_map[ $sec_uniqid ] = $elem_offset;
			}
			$elem_offset += (int) $s_count;
		}

		foreach ( $sections_clogic as $sec_idx => $clogic_raw ) {
			$section_blockid = $post_id . '_sec_' . $sec_idx;

			if ( ! isset( $block_map[ $section_blockid ] ) ) {
				continue;
			}

			$sec_logic_enabled = $sections_logic[ $sec_idx ] ?? '';
			if ( '1' !== $sec_logic_enabled ) {
				continue;
			}

			if ( empty( $clogic_raw ) || 'false' === $clogic_raw ) {
				continue;
			}

			$logic = is_array( $clogic_raw ) ? $clogic_raw : json_decode( $clogic_raw, true );

			if ( ! is_array( $logic ) || empty( $logic['rules'] ) ) {
				continue;
			}

			$prad_rules = array();
			$match      = isset( $logic['what'] ) && 'all' === $logic['what'] ? 'all' : 'any';
			$visibility = isset( $logic['toggle'] ) && 'hide' === $logic['toggle'] ? 'hide' : 'show';

			$raw_rules = $logic['rules'];
			if ( ! empty( $raw_rules ) && is_array( $raw_rules[0] ) && isset( $raw_rules[0][0] ) && is_array( $raw_rules[0][0] ) ) {
				$raw_rules = array_merge( ...$raw_rules );
			}

			foreach ( $raw_rules as $rule ) {
				if ( empty( $rule ) || ! is_array( $rule ) || ! isset( $rule['section'] ) ) {
					continue;
				}

				$ref_uniqid   = $rule['section'];
				$rule_element = $rule['element'] ?? null;
				$operator     = $rule['operator'] ?? 'is';
				$value        = isset( $rule['value'] ) ? urldecode( $rule['value'] ) : '';

				if ( empty( $ref_uniqid ) ) {
					continue;
				}

				$ref_blockid = null;

				if ( isset( $section_offset_map[ $ref_uniqid ] ) && is_numeric( $rule_element ) ) {
					$global_idx  = $section_offset_map[ $ref_uniqid ] + (int) $rule_element;
					$ref_blockid = $post_id . '_' . $global_idx;
				} elseif ( isset( $uniqid_to_blockid[ $ref_uniqid ] ) ) {
					$ref_blockid = $uniqid_to_blockid[ $ref_uniqid ];
				}

				if ( null === $ref_blockid ) {
					$warnings[] = "Section {$sec_idx} conditional: Cannot map uniqid \"{$ref_uniqid}\" to a block. Skipping rule.";
					continue;
				}

				if ( ! isset( $block_map[ $ref_blockid ] ) ) {
					$warnings[] = "Section {$sec_idx} conditional: Referenced block \"{$ref_blockid}\" not found. Skipping rule.";
					continue;
				}

				$ref_block = $block_map[ $ref_blockid ];
				$compare   = $this->map_operator( $operator );

				$prad_rule = array(
					'field'   => $ref_block['blockid'],
					'compare' => $compare,
				);

				if ( ! empty( $value ) && in_array( $compare, array( '_is', '_not_is' ), true ) ) {
					$option_value = $this->get_option_value_by_match( $ref_block, $value );
					if ( null === $option_value ) {
						$warnings[] = "Section {$sec_idx} conditional: Cannot find option for value \"{$value}\" in block \"{$ref_blockid}\". Skipping rule.";
						continue;
					}
					$prad_rule['value'] = $option_value;
				} elseif ( ! empty( $value ) ) {
					$prad_rule['value'] = $value;
				}

				$prad_rules[] = $prad_rule;
			}

			if ( ! empty( $prad_rules ) ) {
				$block_map[ $section_blockid ]['en_logic']        = true;
				$block_map[ $section_blockid ]['fieldConditions'] = array(
					'condition' => array(
						'match'      => $match,
						'visibility' => $visibility,
					),
					'rules'     => $prad_rules,
				);
			}
		}

		return array_values( $blocks );
	}

	/**
	 * Map TM EPO conditional operator to product-addons compare string.
	 */
	private function map_operator( string $operator ): string {
		switch ( $operator ) {
			case 'is':
				return '_is';
			case 'isnot':
				return '_not_is';
			case 'isempty':
				return '_empty';
			case 'isnotempty':
				return '_not_empty';
			default:
				return '_is';
		}
	}

	/**
	 * Find an option value in a block by matching TM EPO value or label.
	 */
	private function get_option_value_by_match( array $block, string $value ): ?string {
		if ( empty( $block['_options'] ) || ! is_array( $block['_options'] ) ) {
			return null;
		}
		foreach ( $block['_options'] as $option ) {
			if ( $option['value'] === $value ) {
				return $option['value'];
			}
		}
		foreach ( $block['_options'] as $option ) {
			if ( ( $option['label'] ?? '' ) === $value ) {
				return $option['value'];
			}
		}
		return null;
	}

	/**
	 * Create a prad_option post with provided options list.
	 *
	 * @param array $options_list Migration output from convert_epo_post_to_prad().
	 *
	 * @return int
	 * @throws Exception On post creation failure.
	 */
	public function create_prad_option_post( array $options_list ): int {
		$post_id = wp_insert_post(
			array(
				'post_title'   => $options_list['title'],
				'post_content' => '',
				'post_status'  => 'publish',
				'post_type'    => 'prad_option',
			)
		);

		if ( is_wp_error( $post_id ) ) {
			throw new Exception( 'Failed to create prad_option post: ' . $post_id->get_error_message() );
		}

		update_post_meta( $post_id, 'prad_addons_blocks', $options_list['blocks'] );

		return (int) $post_id;
	}

	/**
	 * Assign migrated options to products previously linked with TM EPO forms.
	 *
	 * @param array    $mappings Mapping array [tm_post_id => prad_post_id].
	 * @param bool     $dry_run  Whether this is dry run.
	 * @param callable $log      Logger callable.
	 *
	 * @return int
	 */
	private function migrate_product_assignments( array $mappings, bool $dry_run, callable $log ): int {
		global $wpdb;

		$results = $wpdb->get_results(
			"SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key='tm_meta_cpf'"
		);

		$assignment_count = 0;

		foreach ( $results as $result ) {
			$data = maybe_unserialize( $result->meta_value );

			if ( empty( $data['global_forms'] ) || ! is_array( $data['global_forms'] ) ) {
				continue;
			}

			$product_id = (int) $result->post_id;

			foreach ( $data['global_forms'] as $tm_form_id ) {
				$tm_form_id = (int) $tm_form_id;

				if ( ! isset( $mappings[ $tm_form_id ] ) ) {
					continue;
				}

				$prad_option_id = $mappings[ $tm_form_id ];

				if ( $dry_run ) {
					$log( "  [DRY-RUN] Would assign product {$product_id} to prad_option {$prad_option_id}", 'log' );
					++$assignment_count;
					continue;
				}

				$this->assign_prad_option_to_product( $product_id, (int) $prad_option_id );

				++$assignment_count;
			}
		}

		return $assignment_count;
	}

	/**
	 * Convert TM EPO options attached directly to products into product-specific prad_option forms.
	 *
	 * @param bool     $dry_run Whether this is dry run.
	 * @param callable $log     Logger callable.
	 *
	 * @return array{migrated: int, skipped: int, assignments: int, warnings: array}
	 */
	private function migrate_direct_product_forms( bool $dry_run, callable $log ): array {
		global $wpdb;

		$product_ids = $wpdb->get_col(
			"SELECT DISTINCT p.ID
			 FROM {$wpdb->posts} p
			 INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID AND pm.meta_key = 'tm_meta'
			 WHERE p.post_type = 'product'"
		);

		$log( 'Found ' . count( $product_ids ) . ' products with TM EPO tm_meta to inspect for direct options.', 'log' );

		$migrated   = 0;
		$skipped    = 0;
		$assigned   = 0;
		$warnings   = array();

		foreach ( $product_ids as $product_id ) {
			$product_id = (int) $product_id;
			$product    = get_post( $product_id );

			if ( ! $product || 'product' !== $product->post_type ) {
				continue;
			}

			$tm_meta = maybe_unserialize( get_post_meta( $product_id, 'tm_meta', true ) );
			if ( ! is_array( $tm_meta ) || empty( $tm_meta['tmfbuilder'] ) || ! is_array( $tm_meta['tmfbuilder'] ) ) {
				continue;
			}

			$element_types = $tm_meta['tmfbuilder']['element_type'] ?? array();
			if ( empty( $element_types ) || ! is_array( $element_types ) ) {
				continue;
			}

			try {
				$product_warnings = array();
				$options_list     = $this->convert_epo_post_to_prad( $product, $product_warnings );

				if ( empty( $options_list['blocks'] ) ) {
					continue;
				}

				if ( ! empty( $product_warnings ) ) {
					$warnings[ 'Product ' . $product_id ] = $product_warnings;
				}

				$log(
					"  [PRODUCT {$product_id}] \"{$product->post_title}\" -> " . count( $options_list['blocks'] ) . ' block(s)' . ( ! empty( $product_warnings ) ? ' (' . count( $product_warnings ) . ' warning(s))' : '' ),
					'log'
				);

				if ( $dry_run ) {
					$log( "  [DRY-RUN] Would create product-specific prad_option for product {$product_id} and assign it after global forms.", 'log' );
					++$migrated;
					++$assigned;
					continue;
				}

				$prad_option_id = $this->create_prad_option_post( $options_list );
				$this->assign_prad_option_to_product( $product_id, $prad_option_id );

				$log( "  Assigned product {$product_id} to new prad_option {$prad_option_id} after migrated global assignments.", 'log' );

				++$migrated;
				++$assigned;
			} catch ( Exception $e ) {
				$log( "  [ERROR] Product {$product_id}: " . $e->getMessage(), 'error' );
				++$skipped;
			}
		}

		return array(
			'migrated'    => $migrated,
			'skipped'     => $skipped,
			'assignments' => $assigned,
			'warnings'    => $warnings,
		);
	}

	/**
	 * Assign a prad_option post to a product.
	 *
	 * This appends the option to the product include list so call order controls render order.
	 */
	private function assign_prad_option_to_product( int $product_id, int $prad_option_id ): void {
		$assigned_raw = get_post_meta( $prad_option_id, 'prad_base_assigned_data', true );
		if ( function_exists( 'product_addons' ) ) {
			$assigned = json_decode( product_addons()->safe_stripslashes( $assigned_raw ), true );
		} else {
			$assigned = json_decode( wp_unslash( $assigned_raw ), true );
		}

		if ( ! is_array( $assigned ) ) {
			$assigned = array(
				'aType'    => 'specific_product',
				'includes' => array(),
				'excludes' => array(),
			);
		}

		if ( ! in_array( $product_id, $assigned['includes'], true ) ) {
			$assigned['includes'][] = $product_id;
		}
		update_post_meta( $prad_option_id, 'prad_base_assigned_data', wp_json_encode( $assigned ) );

		$meta_inc_raw = get_post_meta( $product_id, 'prad_product_assigned_meta_inc', true );
		if ( function_exists( 'product_addons' ) ) {
			$meta_inc = json_decode( product_addons()->safe_stripslashes( $meta_inc_raw ), true );
		} else {
			$meta_inc = json_decode( wp_unslash( $meta_inc_raw ), true );
		}

		$meta_inc = is_array( $meta_inc ) ? $meta_inc : array();

		if ( ! in_array( $prad_option_id, $meta_inc, false ) ) {
			$meta_inc[] = $prad_option_id;
		}
		update_post_meta( $product_id, 'prad_product_assigned_meta_inc', wp_json_encode( $meta_inc ) );
	}

	/**
	 * Get a value from TM EPO columnar array.
	 *
	 * @param array  $tmf     The tmfbuilder array.
	 * @param string $key     Column key.
	 * @param int    $index   Column index.
	 * @param mixed  $default Default value.
	 *
	 * @return mixed
	 */
	private function get_col_value( array $tmf, string $key, int $index, $default = null ) {
		if ( ! isset( $tmf[ $key ] ) || ! is_array( $tmf[ $key ] ) || ! array_key_exists( $index, $tmf[ $key ] ) ) {
			return $default;
		}
		return $tmf[ $key ][ $index ];
	}

	/**
	 * Get JSON-encoded array from TM EPO columnar row.
	 */
	private function get_col_json_array( array $tmf, string $key, int $index ): array {
		$raw = $this->get_col_value( $tmf, $key, $index, null );

		if ( null === $raw || '' === $raw ) {
			return array();
		}

		if ( is_array( $raw ) ) {
			return $raw;
		}

		$decoded = json_decode( $raw, true );
		return is_array( $decoded ) ? $decoded : array();
	}
}
