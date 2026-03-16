const $ = jQuery;
export const initBlockSection = () => {
	$( document ).ready( function () {
		$( '.prad-section-body.prad-section-accordian' ).each( function () {
			const sectionBody = $( this );
			const sectionHeight = sectionBody
				.find( '> .prad-section-container' )
				.outerHeight();

			if ( sectionBody.hasClass( 'prad-active' ) ) {
				sectionBody.css( 'max-height', sectionHeight );
			} else {
				sectionBody.css( 'max-height', 0 );
			}
		} );
	} );
	$( document ).on(
		'click',
		'.prad-accordion-header.prad-cursor-pointer',
		function () {
			$( this )
				.closest( '.prad-section-block' )
				.removeClass( 'prad-section-init-close' );

			const targetIcon = $( this )
				.closest( '.prad-section-block' )
				.find( '.prad-accordion-icon' );
			const targetContent = $( this )
				.closest( '.prad-section-block' )
				.find( '> .prad-section-body' );

			if ( targetContent.hasClass( 'prad-inactive' ) ) {
				targetContent.addClass( 'prad-active' );
				targetIcon.addClass( 'prad-active' );
				targetContent.removeClass( 'prad-inactive' );
				const height = targetContent
					.find( '> .prad-section-container' )
					.outerHeight();
				targetContent.css( { 'max-height': height + 'px' } );
			} else {
				targetContent.addClass( 'prad-inactive' );
				targetIcon.removeClass( 'prad-active' );
				targetIcon.addClass( 'prad-inactive' );
				targetContent.removeClass( 'prad-active' );
				targetContent.css( { 'max-height': 0 } );
			}
		}
	);
};
