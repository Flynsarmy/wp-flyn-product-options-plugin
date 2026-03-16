const $ = jQuery;

export const initBlockPopup = () => {
	if ( ! $( '.prad-block-popup-overlay' ).length ) {
		$( 'body' ).append( '<div class="prad-block-popup-overlay"></div>' );
	}

	$( document ).on( 'click', '.prad-block-popup-header', function ( event ) {
		event.stopPropagation();

		const $wrapper = $( this ).closest( '.prad-block-popup-wrapper' );
		const $popup = $wrapper.find( '.prad-block-popup-content-wrapper' );

		$popup.stop( true, true ).removeClass( 'closing' );

		$( '.prad-block-popup-content-wrapper' ).removeClass(
			'active closing'
		);
		$( '.prad-block-popup-overlay' ).addClass( 'active' );
		$popup.addClass( 'active' );
	} );

	$( document ).on( 'click', function ( event ) {
		const $popup = $( '.prad-block-popup-content-wrapper.active' );

		if (
			$popup.length &&
			! $( event.target ).closest(
				'.prad-block-popup-content-wrapper, .prad-block-popup-header'
			).length
		) {
			closePopup();
		}
	} );
	$( document ).on(
		'click',
		'.prad-block-popup-content-close',
		function ( event ) {
			closePopup();
		}
	);

	function closePopup() {
		const $popup = $( '.prad-block-popup-content-wrapper.active' );
		const $overlay = $( '.prad-block-popup-overlay' );

		if ( ! $popup.length ) {
			return;
		}

		// Add a "closing" class to allow fade-out transition
		$popup.addClass( 'closing' ).removeClass( 'active' );
		$overlay.removeClass( 'active' );

		// Wait for CSS transition to finish (300ms)
		setTimeout( () => {
			$popup.removeClass( 'closing' );
		}, 300 );
	}
};
