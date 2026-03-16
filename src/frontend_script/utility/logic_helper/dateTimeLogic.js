import {
	normalizeDateToFormat,
	startOfDay,
	endOfDay,
} from '../../datetime/dateUtils';
import { parseTimeStringFlexible } from '../../datetime/timeUtils';

/**
 * Handles date and time condition logic for field validation
 *
 * @param {string}             compare     The comparison operator
 * @param {string|Date|Object} targetValue The target value to compare against. The value of the other field.
 * @param {string|Object}      value       The value to compare. The current field's condition value.
 * @param {string}             targetBtype The target field type (date, time, datetime)
 * @return {boolean}                       Returns true if the condition matches, false otherwise
 */
export function handleDateTimeConditions( compare, targetValue, value ) {
	// Input validation
	if ( ! compare || targetValue === undefined || targetValue === null ) {
		return false;
	}

	const extractedTargetValue = extractDateTimeValue( targetValue, compare );

	// Return false for empty values in most cases
	if ( ! extractedTargetValue && ! value ) {
		return false;
	}

	let _matching = false;

	try {
		switch ( compare ) {
			case '_date_is':
			case '_date_not_is':
				_matching = compareDateEquality( extractedTargetValue, value );
				_matching = compare === '_date_is' ? _matching : ! _matching;
				break;

			case '_date_in':
			case '_date_not_in':
				_matching = compareDateInclusion( extractedTargetValue, value );
				_matching = compare === '_date_in' ? _matching : ! _matching;
				break;

			case '_date_between':
				_matching = compareDateBetween( extractedTargetValue, value );
				break;

			case '_date_less':
				_matching = compareDateLess( extractedTargetValue, value );
				break;

			case '_date_greater':
				_matching = compareDateGreater( extractedTargetValue, value );
				break;

			case '_time_before':
				_matching = compareTimeBefore( extractedTargetValue, value );
				break;

			case '_time_after':
				_matching = compareTimeAfter( extractedTargetValue, value );
				break;

			default:
				_matching = false;
		}
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error in handleDateTimeConditions:', error );
		_matching = false;
	}

	return _matching;
}

/**
 * Extract date/time values from various input formats
 *
 * @param {*}      input   Input value to extract from
 * @param {string} context Context for extraction (field type or comparison type)
 * @return {string|undefined} Extracted value or undefined
 */
function extractDateTimeValue( input, context ) {
	if ( ! input ) {
		return undefined;
	}

	if ( typeof input === 'string' ) {
		return input;
	}

	if ( typeof input === 'object' ) {
		const isTimeContext =
			context === '_time_after' || context === '_time_before';
		return isTimeContext ? input.time : input.date;
	}

	return undefined;
}

/**
 * Compare date equality with normalization
 *
 * @param {string} targetValue  Target value (single date from field)
 * @param {string} compareValue Value to compare
 * @return {boolean} True if dates are equal
 */
function compareDateEquality( targetValue, compareValue ) {
	if ( ! targetValue || ! compareValue ) {
		return false;
	}

	const normalizedTarget = normalizeDateToFormat( targetValue, 'YYYY-MM-DD' );
	const normalizedCompare = normalizeDateToFormat(
		compareValue,
		'YYYY-MM-DD'
	);
	return normalizedTarget === normalizedCompare;
}

/**
 * Compare date inclusion in array
 *
 * @param {string}       targetValue  Target value (single date from field)
 * @param {string|Array} compareValue Value to compare (array of dates to check against)
 * @return {boolean} True if target is included in compareValue array
 */
function compareDateInclusion( targetValue, compareValue ) {
	if ( ! targetValue || ! compareValue ) {
		return false;
	}

	// If compareValue is an array (expected for _date_in), check if targetValue is in it
	if ( Array.isArray( compareValue ) ) {
		return compareValue.some( ( cVal ) => {
			const normalizedTarget = normalizeDateToFormat(
				targetValue,
				'YYYY-MM-DD'
			);
			const normalizedCompare = normalizeDateToFormat(
				cVal,
				'YYYY-MM-DD'
			);
			return normalizedTarget === normalizedCompare;
		} );
	}

	// If compareValue is not an array, fall back to string inclusion
	return String( compareValue ).includes( String( targetValue ) );
}

/**
 * Compare if date is between range
 *
 * @param {string} targetValue Target date value
 * @param {Object} rangeValue  Object with _from and _to properties
 * @return {boolean} True if date is in range
 */
function compareDateBetween( targetValue, rangeValue ) {
	if (
		! targetValue ||
		! rangeValue ||
		! rangeValue._from ||
		! rangeValue._to
	) {
		return false;
	}

	try {
		const targetDate = new Date( targetValue );
		const fromDate = startOfDay( new Date( rangeValue._from ) );
		const toDate = endOfDay( new Date( rangeValue._to ) );

		if (
			isNaN( targetDate.getTime() ) ||
			isNaN( fromDate.getTime() ) ||
			isNaN( toDate.getTime() )
		) {
			return false;
		}

		return targetDate >= fromDate && targetDate <= toDate;
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error in compareDateBetween:', error );
		return false;
	}
}

/**
 * Compare if date is less than value
 *
 * @param {*} targetValue  Target date value
 * @param {*} compareValue Value to compare against
 * @return {boolean} True if target is less
 */
function compareDateLess( targetValue, compareValue ) {
	if ( ! targetValue || ! compareValue ) {
		return false;
	}

	try {
		const targetDate = new Date( targetValue );
		const compareDate = new Date( compareValue._to || compareValue );

		if ( isNaN( targetDate.getTime() ) || isNaN( compareDate.getTime() ) ) {
			return false;
		}

		return targetDate < compareDate;
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error in compareDateLess:', error );
		return false;
	}
}

/**
 * Compare if date is greater than value
 *
 * @param {*} targetValue  Target date value
 * @param {*} compareValue Value to compare against
 * @return {boolean} True if target is greater
 */
function compareDateGreater( targetValue, compareValue ) {
	if ( ! targetValue || ! compareValue ) {
		return false;
	}

	try {
		const targetDate = new Date( targetValue );
		const compareDate = new Date( compareValue._from || compareValue );

		if ( isNaN( targetDate.getTime() ) || isNaN( compareDate.getTime() ) ) {
			return false;
		}

		return targetDate > compareDate;
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error in compareDateGreater:', error );
		return false;
	}
}

/**
 * Compare if time is before another time
 *
 * @param {*} targetValue  Target time value
 * @param {*} compareValue Time to compare against
 * @return {boolean} True if target is before
 */
function compareTimeBefore( targetValue, compareValue ) {
	if ( ! targetValue || ! compareValue ) {
		return false;
	}

	try {
		const parsedTarget = parseTimeStringFlexible( targetValue );
		const parsedCompare = parseTimeStringFlexible( compareValue );

		if ( parsedTarget === null || parsedCompare === null ) {
			return false;
		}

		return parsedTarget < parsedCompare;
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error in compareTimeBefore:', error );
		return false;
	}
}

/**
 * Compare if time is after another time
 *
 * @param {*} targetValue  Target time value
 * @param {*} compareValue Time to compare against
 * @return {boolean} True if target is after
 */
function compareTimeAfter( targetValue, compareValue ) {
	if ( ! targetValue || ! compareValue ) {
		return false;
	}

	try {
		const parsedTarget = parseTimeStringFlexible( targetValue );
		const parsedCompare = parseTimeStringFlexible( compareValue );

		if ( parsedTarget === null || parsedCompare === null ) {
			return false;
		}

		return parsedTarget > parsedCompare;
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.warn( 'Error in compareTimeAfter:', error );
		return false;
	}
}
