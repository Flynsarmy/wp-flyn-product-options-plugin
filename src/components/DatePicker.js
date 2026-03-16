import { useEffect, useRef } from 'react';
const DatePicker = ( props ) => {
	const {
		placeholder,
		dateFormat,
		onChange,
		defVal,
		maxDate,
		minDate,
		disableDays,
		disableDates,
		disableSpecificDates,
		disableToday,
		padding,
		width,
		minWidth,
		maxWidth,
		style,
		resetValueOnChange,
	} = props;
	const dateInputRef = useRef();

	useEffect( () => {
		if ( dateInputRef.current ) {
			if ( padding ) {
				dateInputRef.current.style.setProperty(
					'padding',
					padding,
					'important'
				);
			}
			if ( width ) {
				dateInputRef.current.style.setProperty(
					'width',
					width,
					'important'
				);
			}
			if ( minWidth ) {
				dateInputRef.current.style.setProperty(
					'min-width',
					minWidth,
					'important'
				);
			}
			if ( maxWidth ) {
				dateInputRef.current.style.setProperty(
					'max-width',
					maxWidth,
					'important'
				);
			}
		}
	}, [] );

	useEffect( () => {
		if ( dateInputRef.current ) {
			dateInputRef.current.setAttribute( 'data-initdate', 'no' );
		}
		const handleChange = ( e ) => {
			if ( onChange ) {
				onChange( e.target.value );
				if ( dateInputRef.current && resetValueOnChange ) {
					dateInputRef.current.value = '';
				}
			}
		};

		const input = dateInputRef.current;
		input.addEventListener( 'change', handleChange );

		return () => {
			input.removeEventListener( 'change', handleChange );
		};
	}, [
		placeholder,
		dateFormat,
		onChange,
		defVal,
		maxDate,
		minDate,
		disableDays,
		disableDates,
		disableSpecificDates,
		disableToday,
	] );

	return (
		<input
			type="text"
			readOnly
			ref={ dateInputRef }
			className="prad-date-input prad-custom-date-input prad-w-95 prad-input prad-bc-border-primary prad-cursor-pointer prad-input"
			placeholder={ placeholder || dateFormat || 'DD/MM/YYYY' }
			data-format={ dateFormat }
			data-defval={ defVal || '' }
			data-initdate={ 'no' }
			style={ { ...style } }
			data-max-date={ maxDate || '' }
			data-min-date={ minDate || '' }
			data-disabled-weekdays={ JSON.stringify( disableDays || [] ) }
			data-disabled-date={ JSON.stringify( disableDates || [] ) }
			data-disabled-specdates={ JSON.stringify(
				disableSpecificDates || []
			) }
			data-disable-today={ disableToday ?? false }
			{ ...( defVal ? { value: defVal } : {} ) }
		/>
	);
};

export default DatePicker;
