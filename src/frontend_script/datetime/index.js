/**
 * DateTime Picker Main Module
 * Provides date and time picker functionality for product addons
 * Uses functional approach with separate modules for better organization
 *
 * @file DateTime picker main entry point
 * @since 2.0.0
 */

import { getDateConfig } from './dateUtils.js';
import { createDatePicker } from './datePicker.js';
import { createTimePicker } from './timePicker.js';

const $ = jQuery;

/**
 * Initialize date picker for an element
 * @param {Element} element - Input element
 */
const initDatePickerElement = ( element ) => {
	const $input = $( element );

	// Clean up existing picker if it exists
	$input.siblings( '.prad-custom-date-picker' ).remove();
	$input.off( 'click.datepicker' );

	// Create new instance
	const options = getDateConfig( $input );
	createDatePicker( element, options );

	$input.attr( 'data-initdate', 'yes' );
};

/**
 * Initialize time picker for an element
 * @param {Element} element - Input element
 */
const initTimePickerElement = ( element ) => {
	const $input = $( element );

	// Clean up existing picker if it exists
	$input.siblings( '.prad-custom-time-field-picker' ).remove();
	$input.off( 'click.timepicker' );

	// Create new instance
	createTimePicker( element );

	$input.attr( 'data-inittime', 'yes' );
};

/**
 * Main initialization function
 */
const initDateTimePickers = () => {
	// Initialize date pickers
	$( '.prad-custom-date-input' ).each( ( index, element ) => {
		if ( $( element ).attr( 'data-initdate' ) != 'yes' ) {
			initDatePickerElement( element );
		}
	} );

	// Initialize time pickers
	$( '.prad-custom-time-input' ).each( ( index, element ) => {
		if ( $( element ).attr( 'data-inittime' ) != 'yes' ) {
			initTimePickerElement( element );
		}
	} );
};

/**
 * Individual initialization functions for external use
 * @param {Element} element - Input element to initialize
 */
const initDatePicker = ( element ) => initDatePickerElement( element );

/**
 * Individual time picker initialization for external use
 * @param {Element} element - Input element to initialize
 */
const initTimePicker = ( element ) => initTimePickerElement( element );

/**
 * Auto-initialize on DOM ready
 */
document.addEventListener( 'DOMContentLoaded', () => {
	initDateTimePickers();

	$( document ).on( 'prad_update_pricing', initDateTimePickers );

	$( document ).on( 'focus', '.prad-custom-date-input', function () {
		if ( $( this ).attr( 'data-initdate' ) != 'yes' ) {
			initDatePickerElement( this );
		}
	} );

	$( document ).on( 'focus', '.prad-custom-time-input', function () {
		if ( $( this ).attr( 'data-inittime' ) != 'yes' ) {
			initTimePickerElement( this );
		}
	} );
} );

export {
	initDateTimePickers,
	initDatePicker,
	initTimePicker,
	createDatePicker,
	createTimePicker,
};
