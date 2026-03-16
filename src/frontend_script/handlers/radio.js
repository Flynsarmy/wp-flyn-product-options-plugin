/**
 * Radio button field handler for WowActions
 * Manages radio button interactions, pricing, and state updates
 *
 * @file Radio button field type handler
 * @author Product Addons Team
 * @since 1.0.0
 */

import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;

/**
 * Initialize radio button field handlers
 * Sets up event listeners for radio buttons and counter inputs
 *
 * @function initBlockRadio
 * @since 1.0.0
 */
export const initBlockRadio = () => {
	initBlockReset();
	$(
		`.prad-parent.prad-block-radio input[type="radio"], .prad-block-radio.prad-switcher-count .switcher-count[type="number"]`
	).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		const _val = [];
		const _vDatas = [];

		const selectedValues = $parent
			.find( 'input[type="radio"]:checked' )
			.map( function () {
				const $thisRadio = $( this );
				const isCounted = $thisRadio.attr( 'data-count' ) === 'yes';
				const index = $thisRadio.attr( 'data-index' );
				const label = $thisRadio.attr( 'data-label' );
				const pType = $thisRadio.attr( 'data-ptype' );
				const value = $thisRadio.val();

				if ( isCounted ) {
					const counterValue =
						$parent
							.find(
								`input.switcher-count[data-counter="${ $thisRadio.attr(
									'data-counter'
								) }"]`
							)
							.val() || 1;
					_vDatas.push( index );
					_val.push( { label, count: counterValue } );

					const price = fieldPrice.calculatePriceTypeBaseCost( {
						pType,
						value: counterValue,
						cost: value,
					} );
					return price;
				}
				_vDatas.push( index );
				_val.push( label );

				return fieldPrice.calculatePriceTypeBaseCost( {
					pType,
					cost: value,
				} );
			} )
			.get();

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: 'radio',
			optionid: $parent
				.closest( '.prad-blocks-container' )
				.attr( 'data-optionid' ),
			sectionid: $parent.attr( 'data-sectionid' ),
			value: _val,
			_vDatas,
			cost: selectedValues,
		};

		fieldPrice.updateOptionPriceObj( $parent.attr( 'data-bid' ), _data );
	} );
};

/**
 * Initialize radio button reset functionality
 * Allows clicking an active radio button to deselect it
 *
 * @function initBlockReset
 * @private
 * @since 1.0.0
 */
const initBlockReset = () => {
	$( document ).on(
		'click',
		`.prad-parent.prad-block-img-swatches .prad-swatch-container.prad-active input[type="radio"],
	   .prad-parent.prad-block-color-switcher .prad-swatch-container.prad-active input[type="radio"],
	   .prad-block-products.prad-type_swatches-input .prad-swatch-container.prad-active input[type="radio"],
	   .prad-parent.prad-block-button .prad-button-container.prad-active input[type="radio"]`,
		function () {
			$( this ).prop( 'checked', false ).trigger( 'change' );
		}
	);
};
