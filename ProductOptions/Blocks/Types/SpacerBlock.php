<?php
/**
 * Spacer Block Implementation
 *
 * @package PRAD
 * @since 1.0.0
 */

namespace Flyn\ProductOptions\Blocks\Types;

use Flyn\ProductOptions\Blocks\Abstracts\AbstractBlock;

defined( 'ABSPATH' ) || exit;

/**
 * Spacer Block Class
 */
class SpacerBlock extends AbstractBlock {

	/**
	 * Get block type
	 *
	 * @return string
	 */
	public function get_type(): string {
		return 'spacer';
	}

	/**
	 * Render the spacer block
	 *
	 * @return string
	 */
	public function render(): string {
		$attributes = $this->get_common_attributes();

		$html  = sprintf( '<div %s>', $this->build_attributes( $attributes ) );
		$html .= $this->render_spacer();
		$html .= '</div>';

		return $html;
	}

	/**
	 * Render spacer element
	 *
	 * @return string
	 */
	private function render_spacer(): string {
		$height = $this->get_property(
			'height',
			array(
				'val'  => '20',
				'unit' => 'px',
			)
		);

		$style = sprintf(
			'background-color: transparent; height: %s%s; width: 100%%;',
			esc_attr( ! empty( $height['val'] ) ? $height['val'] : 0 ),
			esc_attr( ! empty( $height['unit'] ) ? $height['unit'] : 'px' ),
		);

		return sprintf(
			'<div style="%s"></div>',
			$style
		);
	}
}
