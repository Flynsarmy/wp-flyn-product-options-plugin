import { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import DatePicker from '../../../../../../../components/DatePicker';
import Button from '../../../../../../../components/Button';
const { __ } = wp.i18n;

const DateDisableSpecSettings = ( props ) => {
	const { settings, toolbarSetData } = props;
	const minRef = useRef();

	const disableSpecificDates = useMemo(
		() => settings.disableSpecificDates || [],
		[ settings.disableSpecificDates ]
	);

	// Handler for removing specific dates
	const handleRemoveSpecificDate = useCallback(
		( dateToRemove ) => {
			const updatedDates = disableSpecificDates.filter(
				( date ) => date !== dateToRemove
			);
			toolbarSetData( 'disableSpecificDates', updatedDates );
		},
		[ disableSpecificDates, toolbarSetData ]
	);

	// Handler for adding specific dates
	const handleAddSpecificDate = useCallback(
		( toAdd ) => {
			if ( toAdd && ! disableSpecificDates.includes( toAdd ) ) {
				const updatedDates = [ ...disableSpecificDates, toAdd ];
				toolbarSetData( 'disableSpecificDates', updatedDates );
			}
			const dateInput = document.querySelector( 'input.prad-date-input' );
			if ( dateInput ) {
				dateInput.value = '';
			}
		},
		[ disableSpecificDates, toolbarSetData ]
	);

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
					'-88px',
					'important'
				);
			}
		}
	}, [ minRef ] );

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

		// Call updatePosition initially and on scroll/resize
		updatePosition();

		window.addEventListener( 'scroll', updatePosition, true );
		window.addEventListener( 'resize', updatePosition );

		return () => {
			window.removeEventListener( 'scroll', updatePosition, true );
			window.removeEventListener( 'resize', updatePosition );
			observers.forEach( ( observer ) => observer.disconnect() );
		};
	}, [ updatePosition, minRef ] );

	return (
		<div className="prad-d-flex prad-gap-12">
			<div>
				<div className="prad-d-flex prad-item-center prad-gap-12">
					<div className="prad-field-title">
						{ __( 'Disable Specific Dates', 'product-addons' ) }
					</div>
				</div>
				<div className="prad-d-flex prad-gap-12">
					{ disableSpecificDates.length > 0 && (
						<div className=" prad-pr-2 prad-date-multiselection prad-scrollbar prad-overflow-y-auto prad-overflow-x-hidden">
							{ disableSpecificDates.map( ( date, index ) => (
								<div
									key={ `specific_date_${ index }` }
									className="prad-multi-selection-item"
								>
									<span className="prad-font-12 prad-color-active">
										{ date }
									</span>
									<Button
										onlyIcon={ true }
										iconName="cross"
										padding="4px"
										className="prad-hover-color-negative prad-btn-sm"
										color="active"
										onClick={ () =>
											handleRemoveSpecificDate( date )
										}
										aria-label={ __(
											'Remove date',
											'product-addons'
										) }
									/>
								</div>
							) ) }
						</div>
					) }
					<div className="prad-add-specific-date prad-d-flex prad-gap-12">
						<div
							className="prad-custom-datetime-picker-container"
							ref={ minRef }
						>
							<div className="prad-date-picker-container prad-settings-disable-spec-date">
								<DatePicker
									dateFormat={ settings.dateFormat }
									placeholder={ `Add Date` }
									onChange={ ( _val ) => {
										handleAddSpecificDate( _val );
									} }
									disableDays={ settings.disableDays || '' }
									resetValueOnChange={ true }
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DateDisableSpecSettings;
