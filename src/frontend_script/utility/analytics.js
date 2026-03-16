const $ = jQuery;

/**
 * Initialize analytics tracking system
 * Sets up click and scroll event listeners for tracking user interactions
 *
 * @function initAnalytics
 */
const initAnalytics = () => {
	$( document ).ready( function () {
		$( '.prad-blocks-container' ).on( 'click', function () {
			const optionId = $( this ).data( 'optionid' );
			const productId = $( this ).data( 'productid' );
			checkAndSetCookie( 'click', optionId, productId );
		} );
	} );

	/**
	 * Check which elements are visible in viewport and track them
	 *
	 * @function checkVisibleElements
	 * @private
	 */
	function checkVisibleElements() {
		$( '.prad-blocks-container' ).each( function () {
			if ( isElementPartiallyInViewport( this ) ) {
				const optionId = $( this ).data( 'optionid' );
				const productId = $( this ).data( 'productid' );
				checkAndSetCookie( 'view', optionId, productId );
			}
		} );
	}

	$( document ).ready( function () {
		checkVisibleElements();
	} );

	$( window ).on( 'scroll resize', function () {
		clearTimeout( window.visibilityCheckTimeout );
		window.visibilityCheckTimeout = setTimeout( checkVisibleElements, 100 );
	} );
};

/**
 * Check if an element is partially visible in the viewport
 *
 * @function isElementPartiallyInViewport
 * @param {Element} el - The DOM element to check
 * @return {boolean} True if element is partially visible
 */
function isElementPartiallyInViewport( el ) {
	const rect = el.getBoundingClientRect();
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;

	// Check if the element is partially visible
	const verticallyVisible = rect.top < windowHeight && rect.bottom > 0;
	const horizontallyVisible = rect.left < windowWidth && rect.right > 0;

	return verticallyVisible && horizontallyVisible;
}

/**
 * Check and set tracking cookie if not already set
 *
 * @function checkAndSetCookie
 * @param {string} type      - The tracking type ('click' or 'view')
 * @param {string} optionId  - The option identifier
 * @param {string} productId - The product identifier
 */
function checkAndSetCookie( type, optionId, productId ) {
	const cookieName =
		( type === 'click' ? 'prad_cookie_cl_' : 'prad_cookie_sc_' ) +
		optionId +
		'_' +
		productId;
	const cookie = getCookie( cookieName );
	if ( ! cookie ) {
		setCookie( cookieName, 'prad_cookie', type === 'click' ? 16 : 18 ); // Store for x hours
		handleAnalyticsData( type, optionId );
	}
}

/**
 * Send analytics data to the server
 *
 * @function handleAnalyticsData
 * @param {string} type     - The analytics event type
 * @param {string} optionId - The option identifier
 */
function handleAnalyticsData( type, optionId ) {
	wp.apiFetch( {
		path: '/prad/set_analytics',
		method: 'POST',
		data: {
			type: type === 'view' ? 'impression_count' : 'click_count',
			optionId,
		},
	} )
		.then( () => {
			// eslint-disable-next-line no-console
		} )
		.catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( 'Error:', error );
		} );
}

/**
 * Set a cookie with expiration time
 *
 * @function setCookie
 * @param {string} cookieName  - The cookie name
 * @param {string} cookieValue - The cookie value
 * @param {number} expires     - Expiration time in hours
 */
function setCookie( cookieName, cookieValue, expires ) {
	const date = new Date();
	date.setTime( date.getTime() + expires * 60 * 60 * 1000 );
	const expiresAt = 'expires=' + date.toUTCString();
	document.cookie = cookieName + '=' + cookieValue + ';' + expiresAt + ';';
}

/**
 * Get cookie value by name
 *
 * @function getCookie
 * @param {string} cookieName - The cookie name to retrieve
 * @return {string} The cookie value or empty string if not found
 */
function getCookie( cookieName ) {
	const cName = cookieName + '=';
	const cArray = document.cookie.split( ';' );
	for ( let i = 0; i < cArray.length; i++ ) {
		let item = cArray[ i ];
		while ( item.charAt( 0 ) === ' ' ) {
			item = item.substring( 1 );
		}
		if ( item.indexOf( cName ) === 0 ) {
			return item.substring( cName.length, item.length );
		}
	}
	return '';
}

export { initAnalytics };
