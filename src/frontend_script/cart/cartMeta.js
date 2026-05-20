document.addEventListener( 'DOMContentLoaded', function () {
	const $ = jQuery;
	$( '.prad-collapsed-hidden' ).removeClass( 'prad-collapsed-hidden' );
	$( '.prad-show-more-btn' ).remove();

	$( 'dl.variation, ul.wc-block-components-product-details, ul.wc-item-meta' )
		.css( {
			'max-height': 'none',
			transition: '',
			opacity: 1,
		} )
		.removeClass( 'prad-processed' );
} );
