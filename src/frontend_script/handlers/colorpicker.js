import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockColorPicker = () => {
	$( `
		.prad-parent.prad-block-color-picker input[type="text"]
	  ` ).on( 'change', function () {
		const _val = $( this ).val();
		const $parent = $( this ).closest( '.prad-parent' );
		const $this = $parent.find( 'input[type="color"' );

		if ( _val ) {
			const _data = {
				label: $parent.attr( 'data-label' ),
				type: 'color_picker',
				optionid: $parent
					.closest( '.prad-blocks-container' )
					.attr( 'data-optionid' ),
				sectionid: $parent.attr( 'data-sectionid' ),
				value: _val,
				cost: fieldPrice.calculatePriceTypeBaseCost( {
					pType: $parent.attr( 'data-ptype' ),
					value: _val,
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
	} );

	$( `.prad-parent.prad-block-color-picker input[type="color"],
		.prad-parent.prad-block-color-picker input[type="text"]
	  ` ).on( 'input', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		const _val = $this.val();

		if ( $this.attr( 'type' ) === 'color' ) {
			$parent
				.find( '.prad-input-color-text' )
				.val( _val )
				.trigger( 'change' );
		} else {
			$parent
				.find( 'input[type="color"]' )
				.val( _val )
				.trigger( 'change' );
		}
	} );
	$( `
		.prad-parent.prad-block-color-picker .prad-color-picker-resetter
	  ` ).on( 'click', function () {
		const $parent = $( this ).closest( '.prad-parent' );
		$parent.find( '.prad-input-color-text' ).val( '' ).trigger( 'change' );
		$parent.find( 'input[type="color"' ).val( '' ).trigger( 'change' );
	} );
};
