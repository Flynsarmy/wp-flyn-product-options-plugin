import { useLayoutEffect, useRef, useCallback } from 'react';
import ButtonGroup from '../../../../../../../components/button_group';
import DatePicker from '../../../../../../../components/DatePicker';
const { __ } = wp.i18n;

const DateMinMaxSettings = ( props ) => {
	const { settings, toolbarSetData } = props;
	const minRef = useRef();
	const maxRef = useRef();

	const updatePosition = useCallback( () => {
		if ( minRef?.current ) {
			const minRect = minRef.current.getBoundingClientRect();
			const top = minRect.bottom;
			const minDatePicker = minRef.current.querySelector(
				'.prad-custom-date-picker'
			);
			if ( minDatePicker ) {
				minDatePicker.style.setProperty(
					'position',
					'fixed',
					'important'
				);
				minDatePicker.style.setProperty(
					'top',
					`${ top }px`,
					'important'
				);
				minDatePicker.style.setProperty(
					'margin-top',
					'-50px',
					'important'
				);
			}
		}

		if ( maxRef?.current ) {
			const maxRect = maxRef.current.getBoundingClientRect();
			const top = maxRect.bottom;
			const maxDatePicker = maxRef.current.querySelector(
				'.prad-custom-date-picker'
			);
			if ( maxDatePicker ) {
				maxDatePicker.style.setProperty(
					'position',
					'fixed',
					'important'
				);
				maxDatePicker.style.setProperty(
					'top',
					`${ top }px`,
					'important'
				);
				maxDatePicker.style.setProperty(
					'margin-top',
					'-50px',
					'important'
				);
			}
		}
	}, [ minRef, maxRef ] );

	useLayoutEffect( () => {
		// Create MutationObserver to watch for dynamically added date picker elements
		const observerConfig = {
			childList: true,
			subtree: true,
		};

		const observers = [];

		if ( minRef?.current ) {
			const minObserver = new MutationObserver( updatePosition );
			minObserver.observe( minRef.current, observerConfig );
			observers.push( minObserver );
		}

		if ( maxRef?.current ) {
			const maxObserver = new MutationObserver( updatePosition );
			maxObserver.observe( maxRef.current, observerConfig );
			observers.push( maxObserver );
		}

		// Call updatePosition initially and on scroll/resize
		updatePosition();

		window.addEventListener( 'scroll', updatePosition, true );
		window.addEventListener( 'resize', updatePosition );

		return () => {
			window.removeEventListener( 'scroll', updatePosition, true );
			window.removeEventListener( 'resize', updatePosition );
			observers.forEach( ( observer ) => observer.disconnect() );
		};
	}, [ updatePosition, minRef, maxRef ] );

	return (
		<div className="prad-d-flex prad-gap-12">
			<div className="prad-w-full">
				<ButtonGroup
					title={ __( 'Min Date' ) }
					value={ settings.minDateType || 'none' }
					options={ [
						{ label: 'None', value: 'none' },
						{
							label: 'Current Day',
							value: 'past_dates',
						},
						{ label: 'Custom', value: 'custom' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'minDateType', value )
					}
				/>
				{ settings.minDateType === 'custom' && (
					<div
						className="prad-custom-datetime-picker-container prad-mt-8"
						ref={ minRef }
					>
						<div className="prad-date-picker-container prad-settings-custom-minmax-date">
							<DatePicker
								dateFormat={ settings.dateFormat }
								placeholder={
									settings.minDate || settings.dateFormat
								}
								onChange={ ( _val ) => {
									toolbarSetData( 'minDate', _val );
								} }
								maxDate={ settings.maxDate || '' }
								defVal={ settings.minDate || '' }
							/>
						</div>
					</div>
				) }
			</div>
			<div className="prad-w-full">
				<ButtonGroup
					title={ __( 'Max Date' ) }
					value={ settings.maxDateType || 'none' }
					options={ [
						{ label: 'None', value: 'none' },
						{
							label: 'Current Day',
							value: 'future_dates',
						},
						{ label: 'Custom', value: 'custom' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'maxDateType', value )
					}
				/>
				{ settings.maxDateType === 'custom' && (
					<div className="prad-custom-datetime-picker-container prad-mt-8">
						<div
							className="prad-date-picker-container prad-settings-custom-minmax-date"
							ref={ maxRef }
						>
							<DatePicker
								dateFormat={ settings.dateFormat }
								placeholder={
									settings.maxDate || settings.dateFormat
								}
								onChange={ ( _val ) => {
									toolbarSetData( 'maxDate', _val );
								} }
								minDate={ settings.minDate || '' }
								defVal={ settings.maxDate || '' }
							/>
						</div>
					</div>
				) }
			</div>
		</div>
	);
};

export default DateMinMaxSettings;
