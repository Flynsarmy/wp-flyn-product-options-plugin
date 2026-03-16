<?php
/**
 * Block Factory
 *
 * @package PRAD
 * @since 1.0.0
 */

namespace Flyn\ProductOptions\Blocks\Factories;

use Flyn\ProductOptions\Blocks\Interfaces\BlockInterface;

defined( 'ABSPATH' ) || exit;

/**
 * Factory class for creating block instances
 */
class BlockFactory {

	/**
	 * Registered block types
	 *
	 * @var array
	 */
	private static array $block_types = array();


	/**
	 * Register a block type
	 *
	 * @param string $type Block type identifier
	 * @param string $class_name Full class name
	 * @throws \InvalidArgumentException If class doesn't implement BlockInterface
	 */
	public static function register_block( string $type, string $class_name ): void {
		if ( ! class_exists( $class_name ) ) {
			throw new \InvalidArgumentException(
				sprintf( 'Block class %s does not exist', $class_name )
			);
		}

		if ( ! is_subclass_of( $class_name, BlockInterface::class ) ) {
			throw new \InvalidArgumentException(
				sprintf( 'Block class %s must implement BlockInterface', $class_name )
			);
		}

		self::$block_types[ $type ] = $class_name;

		do_action( 'prad_block_registered', $type, $class_name );
	}

	/**
	 * Create a block instance
	 *
	 * @param string $type Block type
	 * @param array  $data Block configuration data
	 * @param int    $product_id Product ID
	 * @return BlockInterface|null
	 */
	public static function create_block( string $type, array $data, int $product_id ): ?BlockInterface {

		$class_name = self::get_block_class_name_by_type( $type );

		if ( ! $class_name || ! class_exists( $class_name ) ) {
			return null;
		}

		try {
			$block = new $class_name( $data, $product_id );

			// Apply filters to allow modification
			$block = apply_filters( 'prad_block_created', $block, $type, $data, $product_id );
			$block = apply_filters( "prad_block_created_{$type}", $block, $data, $product_id );

			return $block;

		} catch ( \Exception $e ) {
			error_log(
				sprintf(
					'PRAD Block Factory Error: Failed to create block type "%s". Error: %s',
					$type,
					$e->getMessage()
				)
			);

			do_action( 'prad_block_creation_failed', $type, $data, $e );

			return null;
		}
	}

	/**
	 * Get ClassName by block type
	 *
	 * @return string
	 */
	public static function get_block_class_name_by_type( $type ) {
		$blocks_array = array(
			'textfield'      => 'Flyn\ProductOptions\Blocks\Types\TextfieldBlock',
			'section'        => 'Flyn\ProductOptions\Blocks\Types\SectionBlock',
			'radio'          => 'Flyn\ProductOptions\Blocks\Types\RadioBlock',
			'checkbox'       => 'Flyn\ProductOptions\Blocks\Types\CheckboxBlock',
			'custom_formula' => 'Flyn\ProductOptions\Blocks\Types\CustomFormulaBlock',
			'switch'         => 'Flyn\ProductOptions\Blocks\Types\SwitchBlock',
			'select'         => 'Flyn\ProductOptions\Blocks\Types\SelectBlock',
			'products'       => 'Flyn\ProductOptions\Blocks\Types\ProductsBlock',
			'upload'         => 'Flyn\ProductOptions\Blocks\Types\UploadBlock',
			'button'         => 'Flyn\ProductOptions\Blocks\Types\ButtonBlock',
			'img_switch'     => 'Flyn\ProductOptions\Blocks\Types\ImageSwitchBlock',
			'color_switch'   => 'Flyn\ProductOptions\Blocks\Types\ColorSwitchBlock',
			'color_picker'   => 'Flyn\ProductOptions\Blocks\Types\ColorPickerBlock',
			'date'           => 'Flyn\ProductOptions\Blocks\Types\DateBlock',
			'time'           => 'Flyn\ProductOptions\Blocks\Types\TimeBlock',
			'datetime'       => 'Flyn\ProductOptions\Blocks\Types\DateTimeBlock',
			'range'          => 'Flyn\ProductOptions\Blocks\Types\RangeBlock',
			'url'            => 'Flyn\ProductOptions\Blocks\Types\UrlBlock',
			'email'          => 'Flyn\ProductOptions\Blocks\Types\EmailBlock',
			'number'         => 'Flyn\ProductOptions\Blocks\Types\NumberBlock',
			'telephone'      => 'Flyn\ProductOptions\Blocks\Types\TelephoneBlock',
			'textarea'       => 'Flyn\ProductOptions\Blocks\Types\TextareaBlock',
			'heading'        => 'Flyn\ProductOptions\Blocks\Types\HeadingBlock',
			'shortcode'      => 'Flyn\ProductOptions\Blocks\Types\ShortcodeBlock',
			'separator'      => 'Flyn\ProductOptions\Blocks\Types\SeparatorBlock',
			'spacer'         => 'Flyn\ProductOptions\Blocks\Types\SpacerBlock',
			'content'        => 'Flyn\ProductOptions\Blocks\Types\ContentBlock',
			'popup'          => 'Flyn\ProductOptions\Blocks\Types\PopupBlock',
			'font_picker'    => 'Flyn\ProductOptions\Blocks\Types\FontPickerBlock',
		);

		// $blocks_array['button']       = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\ButtonBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\ButtonBlock' : $blocks_array['button'];
		// $blocks_array['checkbox']     = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\CheckboxBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\CheckboxBlock' : $blocks_array['checkbox'];
		// $blocks_array['color_switch'] = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\ColorSwitchBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\ColorSwitchBlock' : $blocks_array['color_switch'];
		// $blocks_array['img_switch']   = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\ImageSwitchBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\ImageSwitchBlock' : $blocks_array['img_switch'];
		// $blocks_array['switch']       = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\SwitchBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\SwitchBlock' : $blocks_array['switch'];
		// $blocks_array['upload']       = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\UploadBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\UploadBlock' : $blocks_array['upload'];
		// $blocks_array['radio']        = class_exists( 'PRAD_PROBlock\Frontend\Blocks\Types\RadioBlock' ) ? 'PRAD_PROBlock\Frontend\Blocks\Types\RadioBlock' : $blocks_array['radio'];

		return $blocks_array[ $type ] ?? null;
	}
}
