import pradFrontendState from '../state';
import { fieldPrice } from '../utility/priceHandler';
import {
	handleFormulaBlockPricing,
	removeFormulaValues,
	updateFormulaDynamicValues,
} from './formula';

const $ = jQuery;
export const initBlockInputs = () => {
	$( `
		.prad-parent.prad-block-number input[type="number"],
		.prad-parent.prad-block-telephone input[type="tel"],
		.prad-parent.prad-block-url input[type="url"],
		.prad-parent.prad-block-email input[type="email"],
		.prad-parent.prad-block-textfield input[type="text"],
		.prad-parent.prad-block-textarea textarea
	  ` ).on( 'input', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		let _val = $this.val();
		let extraVal = '';

		if ( _val ) {
			if ( $this.attr( 'type' ) === 'tel' ) {
				extraVal = $parent.find( '.prad-dial-code-show' ).text();
			} else if (
				$this.attr( 'type' ) === 'text' ||
				$( this ).is( 'textarea' )
			) {
				const textTransform = $parent.attr( 'data-transform' );
				switch ( textTransform ) {
					case 'uppercase':
						_val = _val.toUpperCase();
						break;
					case 'lowercase':
						_val = _val.toLowerCase();
						break;
					case 'capitalize':
						_val = _val.replace( /\b\w/g, ( char ) =>
							char.toUpperCase()
						);
						break;
				}
			}

			const _data = {
				label: $parent.attr( 'data-label' ),
				type: $parent.attr( 'data-btype' ),
				optionid: $parent
					.closest( '.prad-blocks-container' )
					.attr( 'data-optionid' ),
				sectionid: $parent.attr( 'data-sectionid' ),
				value: extraVal + _val,
				cost: fieldPrice.calculatePriceTypeBaseCost( {
					pType: $parent.attr( 'data-ptype' ),
					value: extraVal + _val,
					cost: Number( $this.attr( 'data-val' ) ),
				} ),
			};
			fieldPrice.updateOptionPriceObj(
				$parent.attr( 'data-bid' ),
				_data
			);
		} else {
			pradFrontendState.deleteOptionPriceObj(
				$parent.attr( 'data-bid' )
			);
			fieldPrice.updateOptionPrice( $parent.attr( 'data-bid' ) );
		}
		if ( $this.attr( 'type' ) === 'number' ) {
			if ( _val ) {
				updateFormulaDynamicValues( $parent.attr( 'data-bid' ), _val );
			} else {
				removeFormulaValues( $parent.attr( 'data-bid' ) );
			}
			// Handle Formula block Calculation
			handleFormulaBlockPricing();
		}
	} );
};
