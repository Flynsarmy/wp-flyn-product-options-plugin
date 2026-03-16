import { useEffect, useRef } from 'react';
const TimePicker = ( props ) => {
	const { placeholder, onChange, defVal, maxTime, minTime, style } = props;
	const timeInputRef = useRef();

	useEffect( () => {
		const abortControl = new AbortController();
		if ( timeInputRef.current ) {
			timeInputRef.current.setAttribute( 'data-inittime', 'no' );
		}
		const handleChange = ( e ) => {
			if ( onChange ) {
				onChange( e.target.value );
			}
		};

		const input = timeInputRef.current;
		input.addEventListener( 'change', handleChange, {
			signal: abortControl.signal,
		} );

		return () => {
			abortControl.abort();
		};
	}, [ placeholder, onChange, minTime, maxTime ] );

	return (
		<input
			type="text"
			readOnly
			ref={ timeInputRef }
			className="prad-time-input prad-custom-time-input prad-w-95 prad-cursor-pointer prad-input"
			placeholder={ placeholder || 'HH:MM AM' }
			data-inittime={ 'no' }
			data-deftime={ defVal || '' }
			style={ { ...style } }
			data-min-time={ minTime || '' }
			data-max-time={ maxTime || '' }
			{ ...( defVal ? { value: defVal } : {} ) }
		/>
	);
};

export default TimePicker;
