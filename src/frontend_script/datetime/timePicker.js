import {
	parseTimeStringFlexible,
	isTimeComboValid,
	generateHourOptions,
	generateMinuteOptions,
	generateAmPmOptions,
	formatTimeString,
	parseDefaultTime,
} from './timeUtils.js';

const $ = jQuery;

const createTimePickerHTML = ( timeData, format = '12_hours' ) => {
	const ampmPicker =
		format === '12_hours'
			? `
		<div class="prad-custom-dropdown" id="prad-custom-ampmPicker">
			<div class="prad-custom-selected">${ timeData.ampm || 'AM' }</div>
			<div class="prad-custom-selected-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" fill="none">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1 1 6 6 6-6"></path>
				</svg>
			</div>
			<div class="prad-custom-options prad-scrollbar"></div>
		</div>`
			: '';

	return `
	<div class="prad-custom-time-picker">
		<div class="prad-custom-dropdown" id="prad-custom-hourPicker">
			<div class="prad-custom-selected">${ timeData.hours }</div>
			<div class="prad-custom-options prad-scrollbar"></div>
			<div class="prad-custom-selected-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" fill="none">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1 1 6 6 6-6"></path>
				</svg>
			</div>
		</div>
		<div class="prad-custom-dropdown" id="prad-custom-minutePicker">
			<div class="prad-custom-selected">${ timeData.minutes }</div>
			<div class="prad-custom-selected-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" fill="none">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1 1 6 6 6-6"></path>
				</svg>
			</div>
			<div class="prad-custom-options prad-scrollbar"></div>
		</div>
		${ ampmPicker }
	</div>
`;
};

const populateDropdownOptions = ( $picker, format = '12_hours' ) => {
	// Populate hour options
	const $hourOptions = $picker.find(
		'#prad-custom-hourPicker .prad-custom-options'
	);
	$hourOptions.empty();
	generateHourOptions( format ).forEach( ( option ) => {
		$hourOptions.append(
			`<div class="prad-custom-option">${ option.display }</div>`
		);
	} );

	// Populate minute options
	const $minuteOptions = $picker.find(
		'#prad-custom-minutePicker .prad-custom-options'
	);
	$minuteOptions.empty();
	generateMinuteOptions().forEach( ( option ) => {
		$minuteOptions.append(
			`<div class="prad-custom-option">${ option.display }</div>`
		);
	} );

	// Populate AM/PM options (only for 12-hour format)
	if ( format === '12_hours' ) {
		const $ampmOptions = $picker.find(
			'#prad-custom-ampmPicker .prad-custom-options'
		);
		$ampmOptions.empty();
		generateAmPmOptions().forEach( ( option ) => {
			$ampmOptions.append(
				`<div class="prad-custom-option">${ option.display }</div>`
			);
		} );
	}
};

const updateTimeValue = ( $input, $picker, format = '12_hours' ) => {
	const hours = $picker
		.find( '#prad-custom-hourPicker .prad-custom-selected' )
		.text();
	const minutes = $picker
		.find( '#prad-custom-minutePicker .prad-custom-selected' )
		.text();

	let timeValue;
	if ( format === '24_hours' ) {
		timeValue = formatTimeString( hours, minutes, null, format );
	} else {
		const ampm = $picker
			.find( '#prad-custom-ampmPicker .prad-custom-selected' )
			.text();
		timeValue = formatTimeString( hours, minutes, ampm, format );
	}

	$input.val( timeValue ).trigger( 'change' );
	$input.get( 0 ).dispatchEvent( new Event( 'change' ) );
};

const selectFirstAvailableOptions = (
	$picker,
	$input,
	format = '12_hours'
) => {
	const isMinuteEmpty =
		$picker.find(
			'#prad-custom-minutePicker .prad-custom-option:is(.prad-selected)'
		).length === 0;
	const isAmPmEmpty =
		$picker.find(
			'#prad-custom-ampmPicker .prad-custom-option:is(.prad-selected)'
		).length === 0;

	if (
		$input.attr( 'data-min-time' ) ||
		$input.attr( 'data-max-time' ) ||
		isMinuteEmpty ||
		( format === '12_hours' && isAmPmEmpty )
	) {
		const $firstAvailableMinute = $picker
			.find(
				'#prad-custom-minutePicker .prad-custom-option:not(.prad-custom-disabled)'
			)
			.first();
		if ( $firstAvailableMinute.length ) {
			$firstAvailableMinute.trigger( 'click' );
		}

		if ( format === '12_hours' ) {
			const $firstAvailableAmPm = $picker
				.find(
					'#prad-custom-ampmPicker .prad-custom-option:not(.prad-custom-disabled)'
				)
				.first();
			if ( $firstAvailableAmPm.length ) {
				$firstAvailableAmPm.trigger( 'click' );
			}
		}
	}
};

const updateDropdownStates = ( $input, $picker, format = '12_hours' ) => {
	// Use flexible parsing for min/max times as they might be in different formats
	const min = parseTimeStringFlexible(
		$input.attr( 'data-min-time' )?.trim()
	);
	const max = parseTimeStringFlexible(
		$input.attr( 'data-max-time' )?.trim()
	);

	// Update AM/PM options (only for 12-hour format)
	if ( format === '12_hours' ) {
		[ 'AM', 'PM' ].forEach( ( ampm ) => {
			let valid = false;
			for ( let h = 1; h <= 12 && ! valid; h++ ) {
				for ( let m = 0; m < 60 && ! valid; m++ ) {
					if ( isTimeComboValid( h, m, ampm, min, max, format ) ) {
						valid = true;
						break;
					}
				}
			}
			$picker
				.find( '#prad-custom-ampmPicker .prad-custom-option' )
				.filter( function () {
					return $( this ).text() === ampm;
				} )
				.toggleClass( 'prad-custom-disabled', ! valid );
		} );
	}

	// Update hour options
	const currentAmpm =
		format === '12_hours'
			? $picker
					.find( '#prad-custom-ampmPicker .prad-custom-selected' )
					.text()
			: null;

	const hourRange =
		format === '24_hours' ? { start: 0, end: 23 } : { start: 1, end: 12 };
	for ( let h = hourRange.start; h <= hourRange.end; h++ ) {
		let valid = false;
		for ( let m = 0; m < 60 && ! valid; m++ ) {
			if (
				isTimeComboValid(
					h.toString(),
					m.toString(),
					currentAmpm,
					min,
					max,
					format
				)
			) {
				valid = true;
			}
		}
		const displayHour = format === '24_hours' ? h : h === 0 ? 12 : h;
		const paddedHour = displayHour.toString().padStart( 2, '0' );
		$picker
			.find( '#prad-custom-hourPicker .prad-custom-option' )
			.filter( function () {
				return $( this ).text() === paddedHour;
			} )
			.toggleClass( 'prad-custom-disabled', ! valid );
	}

	// Update minute options
	const currentHour = $picker
		.find( '#prad-custom-hourPicker .prad-custom-selected' )
		.text();
	for ( let m = 0; m < 60; m++ ) {
		const valid = isTimeComboValid(
			currentHour,
			m.toString(),
			currentAmpm,
			min,
			max,
			format
		);
		const paddedMinute = m.toString().padStart( 2, '0' );
		$picker
			.find( '#prad-custom-minutePicker .prad-custom-option' )
			.filter( function () {
				return $( this ).text() === paddedMinute;
			} )
			.toggleClass( 'prad-custom-disabled', ! valid );
	}
};

const initDropdown = ( $dropdown, $input, $picker ) => {
	$dropdown.on( 'click', () => {
		$dropdown.toggleClass( 'prad-custom-active' );
		$( '.prad-custom-dropdown' )
			.not( $dropdown )
			.removeClass( 'prad-custom-active' )
			.find( '.prad-custom-options' )
			.hide();
		$dropdown.find( '.prad-custom-options' ).toggle();
	} );

	$dropdown.on(
		'click',
		'.prad-custom-option:not(.prad-custom-disabled)',
		( e ) => {
			$dropdown
				.find( '.prad-custom-option' )
				.removeClass( 'prad-selected' );
			$( e.target ).addClass( 'prad-selected' );
			$( '.prad-custom-dropdown' ).removeClass( 'prad-custom-active' );

			e.stopPropagation();
			const text = $( e.target ).text();
			$dropdown
				.find( '.prad-custom-selected' )
				.text( text )
				.trigger( 'change' );
			$dropdown.find( '.prad-custom-options' ).hide();
			const format = $input.attr( 'data-time-format' ) || '12_hours';
			updateDropdownStates( $input, $picker, format );

			// Special handling for hour picker
			if ( $dropdown.attr( 'id' ) === 'prad-custom-hourPicker' ) {
				selectFirstAvailableOptions( $picker, $input, format );
			}
		}
	);
};

const handleInputClick = ( $picker ) => {
	if ( $picker.is( ':visible' ) ) {
		$picker.hide();
		$picker.find( '.prad-custom-options' ).hide();
	} else {
		$( '.prad-custom-time-field-picker .prad-custom-options' ).hide();
		$( '.prad-custom-time-field-picker' ).hide();
		$( '.prad-custom-dropdown' ).removeClass( 'prad-custom-active' );
		$picker.show();
	}
};

const bindTimePickerEvents = ( $input, $picker ) => {
	// Input click handler
	$input
		.add( $input.siblings( '.prad-input-time-icon' ) )
		.on( 'click', () => handleInputClick( $picker ) );

	// Initialize dropdowns
	$picker.find( '.prad-custom-dropdown' ).each( ( _, dropdown ) => {
		initDropdown( $( dropdown ), $input, $picker );
	} );

	// Value change handler
	$picker.find( '.prad-custom-selected' ).on( 'change', () => {
		const format = $input.attr( 'data-time-format' ) || '12_hours';
		updateTimeValue( $input, $picker, format );
	} );

	// Close on outside click
	$( document ).on( 'click', ( e ) => {
		const $container = $input.closest(
			'.prad-custom-datetime-picker-container'
		);
		if (
			! $container.is( e.target ) &&
			$container.has( e.target ).length === 0
		) {
			$picker.hide();
			$picker.find( '.prad-custom-options' ).hide();
		}
	} );
};

export const createTimePicker = ( element ) => {
	const $input = $( element );
	const format = $input.attr( 'data-time-format' ) || '12_hours';
	const defTime = $input.attr( 'data-deftime' ) || '';
	const timeData = parseDefaultTime( defTime, format );

	// Create picker element
	const $picker = $( '<div>', {
		class: 'prad-custom-time-field-picker',
	} ).html( createTimePickerHTML( timeData, format ) );

	$input.after( $picker );
	$input.attr( 'readonly', true );

	// Populate dropdown options
	populateDropdownOptions( $picker, format );

	// Bind events
	bindTimePickerEvents( $input, $picker );

	// Initial state update
	updateDropdownStates( $input, $picker, format );

	// Return picker instance
	return {
		$input,
		$picker,
		destroy() {
			$picker.remove();
			$input.off( 'click' );
		},
		show() {
			$picker.show();
		},
		hide() {
			$picker.hide();
			$picker.find( '.prad-custom-options' ).hide();
		},
		updateConstraints() {
			updateDropdownStates( $input, $picker, format );
		},
	};
};
