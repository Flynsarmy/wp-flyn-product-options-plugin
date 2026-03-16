import pradFrontendState from '../state';
import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockProducts = () => {
	$( document ).on(
		'click',
		'.prad-product-link[data-phref]',
		function ( e ) {
			const phref = $( this ).attr( 'data-phref' );
			if ( phref ) {
				e.stopPropagation();
				e.preventDefault();
				window.open( phref, '_blank' );
			}
		}
	);
	$( document ).ready( function () {
		$(
			'.prad-block-products .prad-product-block-variation-select .prad-product-variation-select-comp'
		).each( function () {
			const $option = $( this ).find( '.prad-select-option:eq(0)' );

			const $parent = $( this );
			$parent.attr( 'data-selected', 0 );
			// Manage active class
			$parent.find( '.prad-select-option' ).removeClass( 'prad-active' );
			$option.addClass( 'prad-active' );
			const selectedText = $option.html();
			$parent
				.find( '.prad-select-box-item' )
				.html( selectedText )
				.trigger( 'change' );
		} );
	} );
	$( `
		.prad-block-products.prad-type_swatches-input input[type="checkbox"],
		.prad-block-products.prad-type_swatches-input input[type="radio"],
		.prad-block-products.prad-type-radio-input input[type="radio"],
		.prad-block-products.prad-type-checkbox-input input[type="checkbox"],
		.prad-block-products.prad-type_swatches-input.prad-switcher-count .switcher-count[type="number"],
		.prad-block-products.prad-type-radio-input.prad-switcher-count .switcher-count[type="number"],
		.prad-block-products.prad-type-checkbox-input.prad-switcher-count .switcher-count[type="number"],
		.prad-block-products .prad-product-block-variation-select .prad-product-variation-select-comp .prad-select-box-item
	  ` ).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		const inputType = $parent.attr( 'data-input-type' );

		const variationSelectTriggered = $( this ).is(
			'.prad-select-box-item'
		);

		if ( variationSelectTriggered ) {
			const $closestItem = $( this ).closest(
				'.prad-products-item-wrapper'
			);
			const productId = $closestItem
				.find( '.prad-select-option.prad-active' )
				.attr( 'data-variation-id' );
			const priceHtml = $closestItem
				.find( '.prad-select-option.prad-active' )
				.attr( 'data-pricehtml' );
			const productPrice = $closestItem
				.find( '.prad-select-option.prad-active' )
				.attr( 'value' );

			$closestItem
				.find( `input[type="${ inputType }"]` )
				.val( productPrice );
			$closestItem
				.find( `input[type="${ inputType }"]` )
				.attr( 'data-product-id', productId );
			$closestItem.find( `.pricex` ).html( priceHtml );
		}

		if ( $parent.hasClass( 'prad-type_swatches-input' ) ) {
			$parent
				.find( '.prad-swatch-container' )
				.removeClass( 'prad-active' );

			$parent.find( '.prad-swatch-container' ).each( function () {
				if (
					$( this )
						.find( `input[type="${ inputType }"]` )
						.is( ':checked' )
				) {
					$( this ).addClass( 'prad-active' );
				}
			} );
		}

		const _val = [];
		const _vDatas = [];
		const _addAbleProducts = [];
		const selectedValues = $parent
			.find( `input[type="${ inputType }"]:checked` )
			.map( function () {
				const $checkbox = $( this );
				const isCounted = $checkbox.attr( 'data-count' ) === 'yes';
				const index = $checkbox.attr( 'data-index' );
				const label = $checkbox.attr( 'data-label' );
				const pType = $checkbox.attr( 'data-ptype' );
				const value = $checkbox.val();

				if ( isCounted ) {
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
					_addAbleProducts.push( {
						id: $checkbox.attr( 'data-product-id' ),
						count: counterValue || 1,
					} );

					const price = fieldPrice.calculatePriceTypeBaseCost( {
						pType,
						value: counterValue,
						cost: value,
					} );

					return price;
				}

				_vDatas.push( index );
				_val.push( label );
				_addAbleProducts.push( {
					id: $checkbox.attr( 'data-product-id' ),
					count: 1,
				} );

				return fieldPrice.calculatePriceTypeBaseCost( {
					pType: $checkbox.attr( 'data-ptype' ),
					value: 1,
					cost: isNaN( Number( $checkbox.val() ) )
						? 0
						: Number( $checkbox.val() ),
				} );
			} )
			.get();

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: 'products',
			optionid: $parent
				.closest( '.prad-blocks-container' )
				.attr( 'data-optionid' ),
			sectionid: $parent.attr( 'data-sectionid' ),
			value: _val,
			_vDatas,
			cost: selectedValues,
		};

		pradFrontendState.updateAddAbleProduct(
			$parent.attr( 'data-bid' ),
			_addAbleProducts
		);

		fieldPrice.updateOptionPriceObj( $parent.attr( 'data-bid' ), _data );
	} );
};
