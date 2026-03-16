import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockDateTime = () => {
	$(
		'.prad-parent.prad-block-date input[type="text"], .prad-parent.prad-block-time input[type="text"], .prad-parent.prad-block-datetime input[type="text"]'
	).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		const bType = $parent.attr( 'data-btype' );

		const dateVal = $parent
			.find( '.prad-date-picker-container input[type="text"]' )
			.val();
		const timeVal = $parent
			.find( '.prad-time-picker-container input[type="text"]' )
			.val();

		let _val = null;
		if ( bType === 'datetime' ) {
			_val = { date: dateVal || '', time: timeVal || '' };
		} else {
			_val = $parent.hasClass( 'prad-block-date' ) ? dateVal : timeVal;
		}

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: bType,
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
		fieldPrice.updateOptionPriceObj( $parent.attr( 'data-bid' ), _data );
	} );
};
