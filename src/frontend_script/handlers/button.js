import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockButton = () => {
	$(
		`.prad-parent.prad-block-button input[type="radio"], .prad-parent.prad-block-button input[type="checkbox"]`
	).on( 'change', function () {
		const $input = $( this );
		const inputType = $input.attr( 'type' );
		const $parent = $input.closest( '.prad-parent' );
		const $buttonContainer = $parent.find( '.prad-button-container' );

		$buttonContainer.removeClass( 'prad-active' );

		const _vDatas = [];
		const _val = [];
		const selectedValues = $parent
			.find( `input[type="${ inputType }"]:checked` )
			.map( function () {
				const $this = $( this );
				$this
					.closest( '.prad-button-container' )
					.addClass( 'prad-active' );
				_vDatas.push( $this.attr( 'data-index' ) );
				_val.push( $this.attr( 'data-label' ) );
				return fieldPrice.calculatePriceTypeBaseCost( {
					pType: $this.attr( 'data-ptype' ),
					cost: $this.val(),
				} );
			} )
			.get();

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: 'button',
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
