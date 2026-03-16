/**
 * Convert price to currency converted value
 * Currently returns the same price - placeholder for future currency conversion
 *
 * @function getCurrencyConvertedPrice
 * @param {number} _price - The price to convert
 * @return {number} The converted price
 */
const getCurrencyConvertedPrice = ( _price ) => {
	return _price;
};

/**
 * Validate if a string is valid JSON
 *
 * @function isValidJSON
 * @param {string} str - The string to validate
 * @return {boolean} True if valid JSON, false otherwise
 */
const isValidJSON = ( str ) => {
	try {
		JSON.parse( str );
		return true;
	} catch ( e ) {
		return false;
	}
};

/**
 * Build formatted price HTML with currency symbol and proper formatting
 *
 * @function buildPriceHtml
 * @param {number} amount - The price amount to format
 * @return {string} Formatted HTML price string
 */
const buildPriceHtml = ( amount = 0 ) => {
	const currencyHtml = `<span class="woocommerce-Price-currencySymbol">${ prad_option_front.currencySymbol }</span>`;
	let [ integer, decimal ] = amount
		.toFixed( prad_option_front.num_decimals )
		.split( '.' );
	integer = integer.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		prad_option_front.thousand_sep
	);

	let formattedPrice = decimal
		? integer + prad_option_front.decimal_sep + decimal
		: integer;

	if ( prad_option_front.currency_pos === 'left' ) {
		formattedPrice = currencyHtml + formattedPrice;
	} else if ( prad_option_front.currency_pos === 'right' ) {
		formattedPrice = formattedPrice + currencyHtml;
	} else if ( prad_option_front.currency_pos === 'left_space' ) {
		formattedPrice = currencyHtml + '&nbsp;' + formattedPrice;
	} else if ( prad_option_front.currency_pos === 'right_space' ) {
		formattedPrice = formattedPrice + '&nbsp;' + currencyHtml;
	}

	return `<span class="woocommerce-Price-amount amount">${ formattedPrice }</span>`;
};

/**
 * Format file size in human readable format
 *
 * @function formatFileSize
 * @param {number} size - Size in bytes
 * @return {string} Formatted file size (e.g., "1.5 MB")
 */
const formatFileSize = ( size ) => {
	if ( size < 1024 ) {
		return `${ size } B`;
	} else if ( size < 1024 * 1024 ) {
		return `${ ( size / 1024 ).toFixed( 2 ) } KB`;
	}
	return `${ ( size / ( 1024 * 1024 ) ).toFixed( 2 ) } MB`;
};

/**
 * Debounce function to limit the rate of function execution
 *
 * @function debounce
 * @param {Function} func - The function to debounce
 * @param {number}   wait - The number of milliseconds to delay
 * @return {Function} The debounced function
 */
const debounce = ( func, wait ) => {
	let timeout;
	return function executedFunction( ...args ) {
		const later = () => {
			clearTimeout( timeout );
			func( ...args );
		};
		clearTimeout( timeout );
		timeout = setTimeout( later, wait );
	};
};

export {
	getCurrencyConvertedPrice,
	isValidJSON,
	buildPriceHtml,
	formatFileSize,
	debounce,
};
