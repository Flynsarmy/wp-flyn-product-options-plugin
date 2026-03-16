import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockFontPicker = () => {
	$( `.prad-block-font_picker .prad-select-box` ).on( 'change', function () {
		const $select = $( this ).closest( '.prad-custom-select' );
		const data = $select.find(
			`.prad-select-option[data-index=${ $select.attr(
				'data-selected'
			) }]`
		);
		const $parent = $select.closest( '.prad-parent' );

		const fontFamily = data.attr( 'data-font-family' );
		const toApplyFields = JSON.parse(
			$parent.attr( 'data-apply-fonts' ) || '[]'
		);

		toApplyFields.forEach( ( _id ) => {
			const $parentField = $( `.prad-parent[data-bid="${ _id }"]` );
			const btype = $parentField.attr( 'data-btype' );

			// Strip any existing quotes and wrap the font-family value in double quotes (e.g. "asa")
			const sanitizedFont = ( fontFamily || '' ).replace(
				/^['"]+|['"]+$/g,
				''
			);
			const cssFont = `"${ sanitizedFont }"`;

			if ( btype === 'textfield' ) {
				$parentField
					.find( 'input[type="text"]' )
					.css( 'font-family', cssFont );
			} else if ( btype === 'textarea' ) {
				$parentField.find( 'textarea' ).css( 'font-family', cssFont );
			}
		} );

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: 'select',
			optionid: $parent
				.closest( '.prad-blocks-container' )
				.attr( 'data-optionid' ),
			sectionid: $parent.attr( 'data-sectionid' ),
			value: [ data.attr( 'data-label' ) ],
			_vDatas: [ data.attr( 'data-index' ) ],
			cost: [
				fieldPrice.calculatePriceTypeBaseCost( {
					pType: data.attr( 'data-ptype' ),
					cost: data.attr( 'data-value' ),
				} ),
			],
		};

		fieldPrice.updateOptionPriceObj( $parent.attr( 'data-bid' ), _data );
	} );
};
