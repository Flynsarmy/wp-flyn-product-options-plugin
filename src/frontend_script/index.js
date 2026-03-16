import { initWowActions } from './init';
const $ = jQuery;

document.addEventListener( 'DOMContentLoaded', () => {
	setTimeout( () => {
		initLoaders();
		initWowActions();
	}, 10 );
} );

const initLoaders = () => {
	const $wrapper = $( '.prad-addons-wrapper' );

	if ( $wrapper.length ) {
		// Immediate .prad-loader inside wrapper
		const $loader = $wrapper.children( '.prad-loader' );

		setTimeout( () => {
			$wrapper.removeClass( 'prad-loading' );

			setTimeout( () => {
				$loader.fadeOut( 20, function () {
					$( this ).remove();
				} );
			}, 20 ); // small delay for smooth transition
		}, 120 );
	}
};
