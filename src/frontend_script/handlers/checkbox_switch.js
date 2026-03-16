import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockCheckboxSwitch = () => {
	$( `
	.prad-parent.prad-block-checkbox input[type="checkbox"],
	.prad-parent.prad-block-switch input[type="checkbox"],
	.prad-parent.prad-block-checkbox.prad-switcher-count .switcher-count[type="number"],
  .prad-parent.prad-block-switch.prad-switcher-count .switcher-count[type="number"]
  ` ).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		const _val = [];
		const _vDatas = [];

		const selectedValues = $parent
			.find( 'input[type="checkbox"]:checked' )
			.map( function () {
				const $checkbox = $( this );
				const isCountable = $checkbox.attr( 'data-count' ) === 'yes';

				const index = $checkbox.attr( 'data-index' );
				const label = $checkbox.attr( 'data-label' );
				const pType = $checkbox.attr( 'data-ptype' );
				const value = $checkbox.val();

				if ( isCountable ) {
					const counterValue =
						$parent
							.find(
								`input.switcher-count[data-counter="${ $checkbox.attr(
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
					pType: $checkbox.attr( 'data-ptype' ),
					cost: isNaN( Number( $checkbox.val() ) )
						? 0
						: Number( $checkbox.val() ),
				} );
			} )
			.get();

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: $parent.attr( 'data-btype' ),
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
