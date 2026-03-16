import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockSelect = () => {
	handleSelectComponent();
	$( `.prad-block-select .prad-select-box` ).on( 'change', function () {
		const $select = $( this ).closest( '.prad-custom-select' );
		const data = $select.find(
			`.prad-select-option[data-index=${ $select.attr(
				'data-selected'
			) }]`
		);

		const $parent = $select.closest( '.prad-parent' );
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

	$( '.prad-parent.prad-block-data select' ).on( 'change', function () {
		const $select = $( this );
		const $parent = $select.closest( '.prad-parent' );
		const bid = $parent.attr( 'data-bid' );

		const _vDatas = [];
		const _price = [];
		const _val = $select
			.find( 'option:selected' )
			.map( function () {
				const $opt = $( this );
				_vDatas.push( $opt.attr( 'data-index' ) );
				_price.push(
					fieldPrice.calculatePriceTypeBaseCost( {
						pType: $opt.attr( 'data-ptype' ),
						cost: $opt.attr( 'value' ),
					} )
				);
				return $opt.attr( 'data-label' );
			} )
			.get();

		const _data = {
			label: $parent.attr( 'data-label' ),
			type: 'select',
			optionid: $parent
				.closest( '.prad-blocks-container' )
				.attr( 'data-optionid' ),
			sectionid: $parent.attr( 'data-sectionid' ),
			value: _val,
			_vDatas,
			cost: _price,
		};

		fieldPrice.updateOptionPriceObj( bid, _data );
	} );
};

const handleSelectComponent = () => {
	$( document ).ready( function () {
		$( '.prad-custom-select .prad-select-box' ).click( function ( e ) {
			e.stopPropagation();
			e.preventDefault();
			const $that = $( this );

			const $clickedParent = $that.closest( '.prad-custom-select' );
			$( '.prad-custom-select' )
				.not( $clickedParent )
				.each( function () {
					$( this ).find( '.prad-select-options' ).hide();
					$( this )
						.find( '.prad-select-box' )
						.removeClass( 'prad-select-open' );
				} );
			$clickedParent.find( '.prad-select-options' ).toggle();
			$that.toggleClass( 'prad-select-open' );
		} );

		$( '.prad-custom-select .prad-select-option' ).click( function ( e ) {
			e.preventDefault();
			const $parent = $( this ).closest( '.prad-custom-select' );

			$parent.find( '.prad-select-option' ).removeClass( 'prad-active' );
			$( this ).addClass( 'prad-active' );

			$parent.attr( 'data-selected', $( this ).attr( 'data-index' ) );

			const selectedText = $( this ).html();
			$parent
				.find( '.prad-select-box-item' )
				.html( selectedText )
				.trigger( 'change' );
			$parent.find( '.prad-select-options' ).hide();
			$parent
				.find( '.prad-select-box' )
				.removeClass( 'prad-select-open' );
		} );

		$( document ).on( 'click', ( e ) => {
			const $container = $( '.prad-custom-select' );
			if (
				! $container.is( e.target ) &&
				$container.has( e.target ).length === 0
			) {
				$( '.prad-custom-select .prad-select-options' ).hide();
				$( '.prad-custom-select .prad-select-box' ).removeClass(
					'prad-select-open'
				);
			}
		} );
	} );
};
