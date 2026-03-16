import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockImgColorSwitch = () => {
	initRadioType();
	initCheckboxType();
};

const initRadioType = () => {
	$( `
	.prad-parent.prad-block-img-swatches input[type="radio"],
	.prad-parent.prad-block-color-switcher input[type="radio"],
	.prad-block-color-switcher.prad-switcher-count.prad-switcher-count-radio .switcher-count[type="number"],
	.prad-block-img-swatches.prad-switcher-count.prad-switcher-count-radio .switcher-count[type="number"]
  ` ).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );

		$parent.find( '.prad-swatch-container' ).removeClass( 'prad-active' );

		if ( $this.is( ':checked' ) ) {
			$this.closest( '.prad-swatch-container' ).addClass( 'prad-active' );
		}

		setTimeout( () => {
			handleProductGalleryImage( $this );
		}, 0 );

		const _val = [];
		const _vDatas = [];
		const selectedValues = $parent
			.find( 'input[type="radio"]:checked' )
			.map( function () {
				const $input = $( this );

				const isCounted = $input.attr( 'data-count' ) === 'yes';
				const index = $input.attr( 'data-index' );
				const label = $input.attr( 'data-label' );
				const pType = $input.attr( 'data-ptype' );
				const value = $input.val();

				if ( isCounted ) {
					const counterValue =
						$parent
							.find(
								`input.switcher-count[data-counter="${ $input.attr(
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
					pType: $input.attr( 'data-ptype' ),
					cost: isNaN( Number( $input.val() ) )
						? 0
						: Number( $input.val() ),
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

const initCheckboxType = () => {
	$( `
	.prad-parent.prad-block-img-swatches input[type="checkbox"],
	.prad-parent.prad-block-color-switcher input[type="checkbox"],
	.prad-block-color-switcher.prad-switcher-count.prad-switcher-count-checkbox .switcher-count[type="number"],
	.prad-block-img-swatches.prad-switcher-count.prad-switcher-count-checkbox .switcher-count[type="number"]
  ` ).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );

		$parent.find( '.prad-swatch-container' ).removeClass( 'prad-active' );

		$parent.find( '.prad-swatch-container' ).each( function () {
			if ( $( this ).find( 'input[type="checkbox"]' ).is( ':checked' ) ) {
				$( this ).addClass( 'prad-active' );
			}
		} );

		setTimeout( () => {
			handleProductGalleryImage( $this );
		}, 0 );

		const _val = [];
		const _vDatas = [];
		const selectedValues = $parent
			.find( 'input[type="checkbox"]:checked' )
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

function handleProductGalleryImage( element ) {
	const $this = $( element );
	const gallerySrc = JSON.parse(
		$this
			.closest( '.prad-swatch-item-wrapper' )
			.attr( 'data-product-image' ) || '""'
	);

	const galleryProp = JSON.parse(
		$this
			.closest( '.prad-swatch-item-wrapper' )
			.attr( 'data-product-image-prop' ) || '{}'
	);

	if ( gallerySrc ) {
		if ( $this.is( ':checked' ) ) {
			$( '.woocommerce-product-gallery img' ).each( function () {
				const imgSrc = $( this ).attr( 'src' );
				if (
					gallerySrc === imgSrc ||
					[
						galleryProp.full_src,
						galleryProp.gallery_thumbnail_src,
						galleryProp.src,
						galleryProp.thumb_src,
						galleryProp.url,
					].includes( imgSrc )
				) {
					$( this ).trigger( 'click' );
				}
			} );
		}
	}
}
