export const DEFAULT_DATE_CONFIG = {
	disabledWeekdays: [], // 0 = Sunday, 6 = Saturday
	disabledDates: [], // Array of day numbers to disable (1-31)
	disabledSpecDates: [], // Array of specific dates to disable
	format: 'YYYY-MM-DD',
	minDate: null,
	maxDate: null,
};

export const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

/**
 * Short month names for formatting
 */
export const SHORT_MONTH_NAMES = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export const startOfDay = ( date ) => {
	const newDate = new Date( date );
	newDate.setHours( 0, 0, 0, 0 );
	return newDate;
};

export const endOfDay = ( date ) => {
	const newDate = new Date( date );
	newDate.setHours( 23, 59, 59, 999 );
	return newDate;
};

export const isDateDisabled = ( date, settings ) => {
	// Disable today
	if ( settings.disableToday && isSameDay( date, new Date() ) ) {
		return true;
	}
	// Check weekday restrictions
	if ( settings.disabledWeekdays.includes( date.getDay() ) ) {
		return true;
	}

	// Check day restrictions
	if ( settings.disabledDates.includes( date.getDate() ) ) {
		return true;
	}

	// Check specific date restrictions
	if ( settings.disabledSpecDates && settings.disabledSpecDates.length > 0 ) {
		const isDisabled = settings.disabledSpecDates.some(
			( disabledDate ) => {
				const parsedDisabledDate = parseDateByFormat(
					disabledDate,
					settings.format
				);
				return (
					parsedDisabledDate && isSameDay( date, parsedDisabledDate )
				);
			}
		);
		if ( isDisabled ) {
			return true;
		}
	}

	// Check min date
	const endOfDayDate = endOfDay( date );
	if ( settings.minDate && endOfDayDate < settings.minDate ) {
		return true;
	}

	// Check max date
	const startOfDayDate = startOfDay( date );
	if ( settings.maxDate && startOfDayDate > settings.maxDate ) {
		return true;
	}

	return false;
};

export const formatDate = ( date, format ) => {
	const year = date.getFullYear();
	const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
	const day = date.getDate().toString().padStart( 2, '0' );
	const hour = date.getHours().toString().padStart( 2, '0' );
	const minute = date.getMinutes().toString().padStart( 2, '0' );

	let formattedDate = format;

	const replacements = {
		YYYY: year,
		YY: year.toString().slice( -2 ),
		MMM: '#######', // Placeholder for month name
		MM: month,
		M: parseInt( month, 10 ),
		DD: day,
		D: parseInt( day, 10 ),
		HH: hour,
		H: parseInt( hour, 10 ),
		mm: minute,
		m: parseInt( minute, 10 ),
	};

	Object.entries( replacements ).forEach( ( [ token, value ] ) => {
		formattedDate = formattedDate.replace( token, value );
	} );

	formattedDate = formattedDate.replace(
		'#######',
		SHORT_MONTH_NAMES[ parseInt( month, 10 ) - 1 ]
	);

	return formattedDate;
};

export const getDateConfig = ( $input ) => {
	let disabledWeekdays = [];
	let disabledDates = [];
	let disabledSpecDates = [];
	const disableToday = $input.attr( 'data-disable-today' ) === 'true';

	if ( $input.attr( 'data-disabled-weekdays' ) ) {
		try {
			disabledWeekdays = JSON.parse(
				$input.attr( 'data-disabled-weekdays' )
			);
		} catch {
			disabledWeekdays = $input.attr( 'data-disabled-weekdays' );
		}
	}

	if ( $input.attr( 'data-disabled-date' ) ) {
		try {
			disabledDates = JSON.parse( $input.attr( 'data-disabled-date' ) );
		} catch {
			disabledDates = $input.attr( 'data-disabled-date' );
		}
	}

	if ( $input.attr( 'data-disabled-specdates' ) ) {
		try {
			disabledSpecDates = JSON.parse(
				$input.attr( 'data-disabled-specdates' )
			);
		} catch {
			disabledSpecDates = $input.attr( 'data-disabled-specdates' );
		}
	}

	const dateFormat = $input.attr( 'data-format' ) || 'YYYY-MM-DD';

	// Helper function to parse dates with format normalization
	const parseDate = ( dateStr ) => {
		if ( ! dateStr || dateStr === 'none' ) {
			return null;
		}
		if ( dateStr === 'past_dates' || dateStr === 'future_dates' ) {
			return new Date();
		}
		return parseDateByFormat(
			normalizeDateToFormat( dateStr, dateFormat ),
			dateFormat
		);
	};

	const minDate = parseDate( $input.attr( 'data-min-date' ) );
	const maxDate = parseDate( $input.attr( 'data-max-date' ) );
	const normalizedDisabledSpecDates = disabledSpecDates.map(
		( dateStr ) => normalizeDateToFormat( dateStr, dateFormat ) || dateStr
	);

	return {
		format: dateFormat,
		minDate: minDate,
		maxDate: maxDate,
		disableToday: disableToday,
		disabledWeekdays: disabledWeekdays.map( Number ),
		disabledDates: disabledDates.map( Number ),
		disabledSpecDates: normalizedDisabledSpecDates,
		defValue: $input.attr( 'data-defval' )
			? parseDateByFormat( $input.attr( 'data-defval' ), dateFormat )
			: null,
	};
};

export const processDateSettings = ( settings ) => {
	const processed = { ...DEFAULT_DATE_CONFIG, ...settings };

	// Process min/max dates
	if ( processed.minDate ) {
		processed.minDate = startOfDay( processed.minDate );
	}
	if ( processed.maxDate ) {
		processed.maxDate = endOfDay( processed.maxDate );
	}

	return processed;
};

const parseDateByFormat = ( dateStr, format ) => {
	if ( ! dateStr ) {
		return null;
	}

	const trimmed = dateStr.trim();
	let date;

	try {
		switch ( format ) {
			case 'YYYY-MM-DD': {
				const [ y, m, d ] = trimmed.split( '-' ).map( Number );
				date = new Date( y, m - 1, d );
				break;
			}
			case 'DD/MM/YYYY': {
				const [ d, m, y ] = trimmed.split( '/' ).map( Number );
				date = new Date( y, m - 1, d );
				break;
			}
			case 'MM/DD/YYYY': {
				const [ m, d, y ] = trimmed.split( '/' ).map( Number );
				date = new Date( y, m - 1, d );
				break;
			}
			default:
				date = new Date( trimmed );
		}
		return isNaN( date.getTime() ) ? null : date;
	} catch {
		return null;
	}
};

const isSameDay = ( date1, date2 ) => {
	return startOfDay( date1 ).getTime() === startOfDay( date2 ).getTime();
};

// Smart date format converter - tries multiple formats if needed
export const normalizeDateToFormat = ( dateStr, targetFormat ) => {
	if (
		! dateStr ||
		[ 'past_dates', 'future_dates', 'none' ].includes( dateStr )
	) {
		return dateStr;
	}

	const formats = [
		'YYYY-MM-DD',
		'DD/MM/YYYY',
		'MM/DD/YYYY',
		'MMM DD, YYYY',
	];

	for ( const format of formats ) {
		try {
			const parsedDate = parseDateByFormat( dateStr, format );
			if ( parsedDate && ! isNaN( parsedDate.getTime() ) ) {
				return formatDate( parsedDate, targetFormat );
			}
		} catch {
			continue;
		}
	}

	return dateStr; // Return original if all formats fail
};
