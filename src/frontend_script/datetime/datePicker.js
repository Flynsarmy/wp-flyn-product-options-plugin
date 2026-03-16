import {
	formatDate,
	isDateDisabled,
	startOfDay,
	endOfDay,
	processDateSettings,
	MONTH_NAMES,
} from './dateUtils.js';

const $ = jQuery;

const createDatePickerHTML = () => `
	<div class="prad-custom-calendar-header">
		<div class="prad-custom-prev-month">
			<svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" fill="none" viewBox="0 0 9 14">
				<path stroke="#0B0E04" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.5 13-6-6 6-6"/>
			</svg>
		</div>
		<select class="prad-select prad-custom-month-dropdown prad-scrollbar"></select>
		<select class="prad-select prad-custom-year-dropdown prad-scrollbar"></select>
		<div class="prad-custom-next-month">
			<svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" fill="none" viewBox="0 0 9 14">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1.5 13 6-6-6-6"/>
			</svg>
		</div>
	</div>
	<div class="prad-custom-calendar-body">
		<div class="prad-custom-date-container prad-custom-weekdays">
			<span>Sun</span>
			<span>Mon</span>
			<span>Tue</span>
			<span>Wed</span>
			<span>Thu</span>
			<span>Fri</span>
			<span>Sat</span>
		</div>
		<div class="prad-custom-date-container prad-custom-days"></div>
	</div>
`;

const renderYearDropdown = ( $picker, currentDate ) => {
	const $yearSelect = $picker.find( '.prad-custom-year-dropdown' );
	const currentYear = currentDate.getFullYear();

	$yearSelect.empty();
	for ( let i = currentYear - 10; i <= currentYear + 10; i++ ) {
		const isSelected = currentYear === i ? 'selected' : '';
		$yearSelect.append(
			`<option value="${ i }" ${ isSelected }>${ i }</option>`
		);
	}
};

const renderMonthDropdown = ( $picker, currentDate ) => {
	const $monthSelect = $picker.find( '.prad-custom-month-dropdown' );
	const currentMonth = currentDate.getMonth();

	$monthSelect.empty();
	MONTH_NAMES.forEach( ( month, index ) => {
		const selected = currentMonth === index ? 'selected' : '';
		$monthSelect.append(
			`<option value="${ index }" ${ selected }>${ month }</option>`
		);
	} );
};

const handleDayClick = ( date, $input, $picker, settings, state ) => {
	state.selectedDate = new Date( date );

	// Validate against min/max
	if (
		( settings.minDate && state.selectedDate < settings.minDate ) ||
		( settings.maxDate && state.selectedDate > settings.maxDate )
	) {
		return;
	}

	// Update input value and trigger events
	const formattedDate = formatDate( state.selectedDate, settings.format );
	$input.val( formattedDate ).trigger( 'change' );
	$input.get( 0 ).dispatchEvent( new Event( 'change' ) );

	$picker.hide();
};

const renderDays = (
	$picker,
	currentDate,
	selectedDate,
	settings,
	$input,
	state
) => {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const $days = $picker.find( '.prad-custom-days' ).empty();

	const firstDay = new Date( year, month, 1 ).getDay();
	const daysInMonth = new Date( year, month + 1, 0 ).getDate();

	// Add empty cells for days before first day of month
	for ( let i = 0; i < firstDay; i++ ) {
		$days.append( '<div></div>' );
	}

	// Add days
	for ( let day = 1; day <= daysInMonth; day++ ) {
		const date = new Date( year, month, day );
		const isDisabled = isDateDisabled( date, settings );
		const isSelected =
			selectedDate.getFullYear() === date.getFullYear() &&
			selectedDate.getDate() === date.getDate() &&
			selectedDate.getMonth() === date.getMonth();

		const $dayElement = $( '<div>', {
			class: `prad-custom-day${ isDisabled ? ' prad-disabled' : '' }${
				isSelected ? ' prad-selected' : ''
			}`,
			text: day,
		} );

		if ( ! isDisabled ) {
			$dayElement.on( 'click', () => {
				handleDayClick( date, $input, $picker, settings, state );
				$days.find( '.prad-custom-day' ).removeClass( 'prad-selected' );
				$dayElement.addClass( 'prad-selected' );
			} );
		}

		$days.append( $dayElement );
	}
};

const updateNavigation = ( $picker, currentDate, settings ) => {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const firstOfMonth = new Date( year, month, 1 );
	const lastOfMonth = new Date( year, month + 1, 0 );

	// Disable previous month if needed
	$picker
		.find( '.prad-custom-prev-month' )
		.prop(
			'disabled',
			settings.minDate && endOfDay( firstOfMonth ) < settings.minDate
		);

	// Disable next month if needed
	$picker
		.find( '.prad-custom-next-month' )
		.prop(
			'disabled',
			settings.maxDate && startOfDay( lastOfMonth ) > settings.maxDate
		);
};

const renderCalendar = ( $picker, state, settings, $input ) => {
	renderYearDropdown( $picker, state.currentDate );
	renderMonthDropdown( $picker, state.currentDate );
	renderDays(
		$picker,
		state.currentDate,
		state.selectedDate,
		settings,
		$input,
		state
	);
	updateNavigation( $picker, state.currentDate, settings );
};

const handleInputClick = ( $picker, state ) => {
	if ( $picker.is( ':visible' ) ) {
		$picker.hide();
	} else {
		$( '.prad-custom-date-picker' ).hide(); // Hide other pickers
		$picker.show();
		state.currentDate = new Date( state.selectedDate );
	}
};

const bindDatePickerEvents = ( $input, $picker, state, settings ) => {
	// Input click handler
	$input
		.add( $input.siblings( '.prad-input-date-icon' ) )
		.on( 'click', () => handleInputClick( $picker, state ) );

	// Navigation handlers
	$picker.find( '.prad-custom-prev-month' ).on( 'click', ( event ) => {
		event.preventDefault();
		state.currentDate.setMonth( state.currentDate.getMonth() - 1 );
		renderCalendar( $picker, state, settings, $input );
	} );

	$picker.find( '.prad-custom-next-month' ).on( 'click', ( event ) => {
		event.preventDefault();
		state.currentDate.setMonth( state.currentDate.getMonth() + 1 );
		renderCalendar( $picker, state, settings, $input );
	} );

	// Dropdown handlers
	$picker.find( '.prad-custom-month-dropdown' ).on( 'change', ( event ) => {
		const selectedMonth = parseInt( $( event.target ).val(), 10 );
		state.currentDate.setMonth( selectedMonth );
		renderCalendar( $picker, state, settings, $input );
	} );

	$picker.find( '.prad-custom-year-dropdown' ).on( 'change', ( event ) => {
		const selectedYear = parseInt( $( event.target ).val(), 10 );
		state.currentDate.setFullYear( selectedYear );
		renderCalendar( $picker, state, settings, $input );
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
		}
	} );
};

export const createDatePicker = ( element, options = {} ) => {
	const $input = $( element );
	const settings = processDateSettings( options );

	// Create picker state
	const state = {
		currentDate: new Date( settings.defValue || new Date() ),
		selectedDate: new Date( settings.defValue || new Date() ),
	};

	// Create picker element
	const $picker = $( '<div>', {
		class: 'prad-custom-date-picker',
	} ).html( createDatePickerHTML() );

	$input.after( $picker );
	$input.attr( 'readonly', true );

	// Bind events
	bindDatePickerEvents( $input, $picker, state, settings );

	// Initial render
	renderCalendar( $picker, state, settings, $input );

	// Return picker instance
	return {
		$input,
		$picker,
		state,
		settings,
		destroy() {
			$picker.remove();
			$input.off( 'click' );
		},
		show() {
			$picker.show();
		},
		hide() {
			$picker.hide();
		},
		refresh() {
			renderCalendar( $picker, state, settings, $input );
		},
	};
};
