export const detectTimeFormat = ( str ) => {
	if ( ! str ) {
		return null;
	}
	// Check for 12-hour format: contains AM/PM
	if ( /\s*(AM|PM)\s*$/i.test( str ) ) {
		return '12_hours';
	}
	// Check for 24-hour format: no AM/PM and matches HH:mm pattern
	if ( /^\d{1,2}:\d{2}$/.test( str ) ) {
		return '24_hours';
	}
	return null;
};

export const parseTimeString = ( str, format = '12_hours' ) => {
	if ( ! str ) {
		return null;
	}

	// Auto-detect format if not explicitly provided or if string doesn't match expected format
	const detectedFormat = detectTimeFormat( str );
	if ( detectedFormat && detectedFormat !== format ) {
		// Use detected format if it's different from expected
		format = detectedFormat;
	}

	let match;
	let hour, minute;

	if ( format === '24_hours' ) {
		// 24-hour format: HH:mm
		match = str.match( /^(\d{1,2}):(\d{2})$/ );
		if ( ! match ) {
			return null;
		}
		[ , hour, minute ] = match;
		hour = parseInt( hour );
		minute = parseInt( minute );
	} else {
		// 12-hour format: hh:mm AM/PM
		match = str.match( /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i );
		if ( ! match ) {
			return null;
		}
		const [ , hourStr, minuteStr, ampm ] = match;
		hour = parseInt( hourStr );
		minute = parseInt( minuteStr );
		if ( ampm.toUpperCase() === 'PM' && hour !== 12 ) {
			hour += 12;
		}
		if ( ampm.toUpperCase() === 'AM' && hour === 12 ) {
			hour = 0;
		}
	}

	return hour * 60 + minute;
};

export const isTimeValid = ( time, min, max ) => {
	if ( min === null || max === null ) {
		return true;
	}
	return min <= max ? time >= min && time <= max : time >= min || time <= max;
};

export const generateHourOptions = ( format = '12_hours' ) => {
	if ( format === '24_hours' ) {
		return Array.from( { length: 24 }, ( _, i ) => ( {
			value: i,
			display: i.toString().padStart( 2, '0' ),
		} ) );
	}
	return Array.from( { length: 12 }, ( _, i ) => {
		const value = i + 1;
		return {
			value,
			display: value.toString().padStart( 2, '0' ),
		};
	} );
};

export const generateMinuteOptions = () => {
	return Array.from( { length: 60 }, ( _, i ) => ( {
		value: i,
		display: i.toString().padStart( 2, '0' ),
	} ) );
};

export const generateAmPmOptions = () => {
	return [
		{ value: 'AM', display: 'AM' },
		{ value: 'PM', display: 'PM' },
	];
};

export const formatTimeString = (
	hours,
	minutes,
	ampm,
	format = '12_hours'
) => {
	if ( format === '24_hours' ) {
		return `${ hours }:${ minutes }`;
	}
	return `${ hours }:${ minutes } ${ ampm }`;
};

export const parseDefaultTime = ( defTime, format = '12_hours' ) => {
	if ( ! defTime ) {
		if ( format === '24_hours' ) {
			return {
				hours: 'HH',
				minutes: 'mm',
			};
		}
		return {
			hours: 'hh',
			minutes: 'mm',
			ampm: 'A',
		};
	}

	if ( format === '24_hours' ) {
		const [ _hours, _minutes ] = defTime.split( ':' );
		return {
			hours: _hours || 'HH',
			minutes: _minutes || 'mm',
		};
	}
	const [ _time, _ampm ] = defTime.split( ' ' );
	const [ _hours, _minutes ] = _time ? _time.split( ':' ) : [ '', '' ];
	return {
		hours: _hours || 'hh',
		minutes: _minutes || 'mm',
		ampm: _ampm || 'A',
	};
};

export const parseTimeStringFlexible = ( str ) => {
	// This function tries to parse time in any format (12-hour or 24-hour)
	if ( ! str ) {
		return null;
	}

	// Try 12-hour format first
	let result = parseTimeString( str, '12_hours' );
	if ( result !== null ) {
		return result;
	}

	// Try 24-hour format
	result = parseTimeString( str, '24_hours' );
	if ( result !== null ) {
		return result;
	}

	return null;
};

export const isTimeComboValid = (
	hour,
	minute,
	ampm,
	min,
	max,
	format = '12_hours'
) => {
	const h = parseInt( hour, 10 );
	const m = parseInt( minute, 10 );

	let time;
	if ( format === '24_hours' ) {
		time = h * 60 + m;
	} else {
		time =
			( ampm === 'PM' && h !== 12
				? h + 12
				: ampm === 'AM' && h === 12
				? 0
				: h ) *
				60 +
			m;
	}

	return isTimeValid( time, min, max );
};
