const { __ } = wp.i18n;
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Select from '../../../../../../components/Select';
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import Button from '../../../../../../components/Button';
import icons from '../../../../../../utils/Icons';
import { FieldHelpText, FieldTitle } from '../common_compo/generalCommon';
import ButtonGroup from '../../../../../../components/button_group';
import TimeSettings from './TimeSettings';
import DateMinMaxSettings from './dates/DateMinMaxSettings';
import DateDisableSpecSettings from './dates/DateDisableSpecSettings';

// Constants for better maintainability
const MAX_DROPDOWN_HEIGHT = '20vh';
const DATE_GRID_COLUMNS = 'repeat(7, minmax(46px, 1fr))';

const DAYS_OF_WEEK = [
	{ value: '0', label: 'Sunday' },
	{ value: '1', label: 'Monday' },
	{ value: '2', label: 'Tuesday' },
	{ value: '3', label: 'Wednesday' },
	{ value: '4', label: 'Thursday' },
	{ value: '5', label: 'Friday' },
	{ value: '6', label: 'Saturday' },
];

const MONTH_DATES = Array.from( { length: 31 }, ( _, i ) => String( i + 1 ) );

const PRICE_TYPES = [
	{ val: 'fixed', label: 'Fixed' },
	{ val: 'percentage', label: 'Percentage' },
	{ val: 'no_cost', label: 'No Cost' },
];

const DATE_FORMAT_OPTIONS = [
	{
		value: 'MMM DD, YYYY',
		label: 'MMM DD, YYYY ( July 30, 2025 )',
	},
	{
		value: 'DD/MM/YYYY',
		label: 'DD/MM/YYYY ( 30/07/2025 )',
	},
	{
		value: 'MM/DD/YYYY',
		label: 'MM/DD/YYYY ( 07/30/2025 )',
	},
	{
		value: 'YYYY-MM-DD',
		label: 'YYYY-MM-DD ( 2025-07-30 )',
	},
];

const BLOCK_TYPE_OPTIONS = [
	{ label: 'Date', value: 'date' },
	{ label: 'Date & Time', value: 'datetime' },
	{ label: 'Time', value: 'time' },
];

const DateTimeSettingsExtended = ( props ) => {
	const { settings, toolbarSetData, type } = props;

	// Memoize arrays to prevent unnecessary re-renders
	const disableDays = useMemo(
		() => settings.disableDays || [],
		[ settings.disableDays ]
	);
	const disableDates = useMemo(
		() => settings.disableDates || [],
		[ settings.disableDates ]
	);

	// Memoize expensive calculations
	const hasDateSettings = useMemo(
		() => settings.blockType !== 'time',
		[ settings.blockType ]
	);
	const hasTimeSettings = useMemo(
		() => settings.blockType !== 'date',
		[ settings.blockType ]
	);

	const setOption = useCallback(
		( i, optionType, val ) => {
			const _options = [ ...( settings._options ?? [] ) ];
			_options.splice(
				i,
				1,
				Object.assign( {}, _options.length > i ? _options[ i ] : {}, {
					[ optionType ]: val,
				} )
			);
			toolbarSetData( '_options', _options );
		},
		[ settings._options, toolbarSetData ]
	);

	const [ isOpenDates, setIsOpenDates ] = useState( false );
	const [ isOpenDays, setIsOpenDays ] = useState( false );
	const openDaysRef = useRef();
	const openDateRef = useRef();

	const handleDateSelection = useCallback(
		( date ) => {
			const newDef = [ ...disableDates ];
			const index = newDef.indexOf( date );
			if ( index === -1 ) {
				newDef.push( date );
			} else {
				newDef.splice( index, 1 );
			}
			toolbarSetData( 'disableDates', newDef );
		},
		[ disableDates, toolbarSetData ]
	);

	const handleDaYSelection = useCallback(
		( day ) => {
			const newDef = [ ...disableDays ];
			const index = newDef.indexOf( day );
			if ( index === -1 ) {
				newDef.push( day );
			} else {
				newDef.splice( index, 1 );
			}
			toolbarSetData( 'disableDays', newDef );
		},
		[ disableDays, toolbarSetData ]
	);

	const priceTypes = PRICE_TYPES;

	useEffect( () => {
		const abortControl = new AbortController();
		function handleClickOutside( event ) {
			if (
				openDaysRef.current &&
				! openDaysRef.current.contains( event.target )
			) {
				setIsOpenDays( false );
			}
			if (
				openDateRef.current &&
				! openDateRef.current.contains( event.target )
			) {
				setIsOpenDates( false );
			}
		}
		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		return () => abortControl.abort();
	}, [] );

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20 prad-settings-datetime-extended">
			<div className="prad-d-flex prad-gap-40">
				<FieldToggle
					fieldKey={ 'hide' }
					checked={ settings.hide }
					label={ __( 'Hide Title', 'product-addons' ) }
					handleChange={ ( value ) =>
						toolbarSetData( 'hide', value )
					}
				/>
				<FieldToggle
					fieldKey={ 'required' }
					checked={ settings.required }
					label={ 'Required' }
					handleChange={ ( value ) =>
						toolbarSetData( 'required', value )
					}
				/>
			</div>
			<div className="prad-d-flex prad-gap-12">
				<FieldTitle
					classes="prad-w-full"
					onChange={ ( _val ) => toolbarSetData( 'label', _val ) }
					value={ settings.label }
				/>
				<FieldHelpText
					value={ settings.description }
					classes="prad-w-full"
					onChange={ ( _val ) =>
						toolbarSetData( 'description', _val )
					}
				/>
			</div>
			<FieldOptions
				options={ settings._options }
				priceTypes={ priceTypes }
				hasMultiple={ false }
				setOption={ setOption }
				type={ type }
			/>
			<ButtonGroup
				title={ __( 'Type' ) }
				value={ settings.blockType || 'datetime' }
				options={ BLOCK_TYPE_OPTIONS }
				onChange={ ( value ) => toolbarSetData( 'blockType', value ) }
			/>
			{ hasDateSettings && (
				<div className="prad-d-flex prad-flex-column prad-gap-20 prad-border-default prad-br-md prad-p-12">
					<div>
						<div className="prad-field-title">
							{ __( 'Date Format', 'product-addons' ) }
						</div>
						<Select
							options={ DATE_FORMAT_OPTIONS }
							onChange={ ( val ) => {
								toolbarSetData( 'dateFormat', val.value );
							} }
							width="100%"
							selectedOption={ settings.dateFormat }
							borderRadius="md"
							className="prad-toolbar-selection"
						/>
					</div>
					<DateMinMaxSettings { ...props } />
					<div className="prad-w-full prad-mb-16">
						<FieldToggle
							fieldKey={ 'disableToday' }
							checked={ settings.disableToday }
							label={ __( 'Disable Today', 'product-addons' ) }
							handleChange={ ( value ) =>
								toolbarSetData( 'disableToday', value )
							}
						/>
					</div>
					<DateDisableSpecSettings { ...props } />

					<div className="prad-d-flex prad-gap-12">
						<div className="prad-w-full">
							<div className="prad-field-title">
								{ __( 'Disable Weekdays', 'product-addons' ) }
							</div>
							<div className="prad-relative" ref={ openDaysRef }>
								<div
									className={ `prad-multi-selection-wrapper prad-${
										isOpenDays ? 'active' : 'inactive'
									}` }
									onClick={ () =>
										setIsOpenDays( ! isOpenDays )
									}
									role="button"
									tabIndex="0"
									aria-expanded={ isOpenDays }
									aria-label={ __(
										'Select days to disable',
										'product-addons'
									) }
									onKeyDown={ ( e ) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											e.preventDefault();
											setIsOpenDays( ! isOpenDays );
										}
										if ( e.key === 'Escape' ) {
											setIsOpenDays( false );
										}
									} }
								>
									<div className="prad-w-full prad-multi-selection-container">
										{ disableDays.map( ( day, index ) => (
											<div
												key={ `${ day }_${ index }` }
												className="prad-multi-selection-item"
											>
												{
													DAYS_OF_WEEK[
														Number( day )
													].label
												}
												<Button
													onlyIcon={ true }
													iconName="cross"
													padding="4px 0 0"
													className="prad-hover-color-negative"
													color="active"
													onClick={ ( e ) => {
														e.stopPropagation();
														handleDaYSelection(
															DAYS_OF_WEEK[
																Number( day )
															].value
														);
													} }
												/>
											</div>
										) ) }
									</div>
									<div className="prad-lh-0 prad-multi-selection-icon">
										{ icons.angleDown }
									</div>
								</div>
								{ isOpenDays && (
									<div
										className="prad-multi-selection-options prad-select-dropdown prad-upper-4 prad-overflow-y-auto prad-overflow-x-hidden prad-scrollbar"
										style={ {
											maxHeight: MAX_DROPDOWN_HEIGHT,
										} }
									>
										{ DAYS_OF_WEEK.map( ( day, index ) => (
											<div
												key={ `option_${ day.value }_${ index }` }
												className="prad-multi-selection-option prad-cursor-pointer"
											>
												<label
													htmlFor={ `all_types_${ day.value }_${ index }` }
												>
													<input
														className="prad-input-hidden prad-multi-selection-checkbox"
														type="checkbox"
														id={ `all_types_${ day.value }_${ index }` }
														checked={ disableDays.some(
															( item ) =>
																item ===
																day.value
														) }
														onChange={ () => {
															handleDaYSelection(
																day.value
															);
														} }
													/>
													<div className="prad-font-12 prad-ellipsis prad-multi-selection-name prad-select-option prad-cursor-pointer">
														{ day.label }
													</div>
												</label>
											</div>
										) ) }
									</div>
								) }
							</div>
						</div>
						<div className="prad-w-full">
							<div className="prad-field-title">
								{ __(
									'Disable Monthly Days',
									'product-addons'
								) }
							</div>
							<div className="prad-relative" ref={ openDateRef }>
								<div
									className={ `prad-multi-selection-wrapper prad-${
										isOpenDates ? 'active' : 'inactive'
									}` }
									onClick={ () =>
										setIsOpenDates( ! isOpenDates )
									}
									role="button"
									tabIndex="0"
									aria-expanded={ isOpenDates }
									aria-label={ __(
										'Select dates to disable',
										'product-addons'
									) }
									onKeyDown={ ( e ) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											e.preventDefault();
											setIsOpenDates( ! isOpenDates );
										}
										if ( e.key === 'Escape' ) {
											setIsOpenDates( false );
										}
									} }
								>
									<div className="prad-w-full prad-multi-selection-container">
										{ disableDates.map( ( date, index ) => (
											<div
												key={ `${ date }_${ index }` }
												className="prad-multi-selection-item"
											>
												{ date }
												<Button
													onlyIcon={ true }
													iconName="cross"
													padding="4px 0 0"
													className="prad-hover-color-negative"
													color="active"
													onClick={ ( e ) => {
														e.stopPropagation();
														handleDateSelection(
															date
														);
													} }
												/>
											</div>
										) ) }
									</div>
									<div className="prad-lh-0 prad-multi-selection-icon">
										{ icons.angleDown }
									</div>
								</div>
								{ isOpenDates && (
									<div
										className="prad-multi-selection-options prad-select-dropdown prad-upper-4 prad-overflow-y-auto prad-overflow-x-hidden prad-scrollbar prad-d-grid prad-w-auto prad-p-4"
										style={ {
											maxHeight: MAX_DROPDOWN_HEIGHT,
											gridTemplateColumns:
												DATE_GRID_COLUMNS,
										} }
									>
										{ MONTH_DATES.map( ( date, index ) => (
											<div
												key={ `option_${ date }_${ index }` }
												className="prad-multi-selection-option prad-cursor-pointer"
												onClick={ () => {
													handleDateSelection( date );
												} }
											>
												<div
													className={ `prad-font-12 prad-multi-selection-name prad-select-option prad-cursor-pointer ${
														disableDates.some(
															( item ) =>
																item === date
														)
															? 'prad-selected'
															: ''
													}` }
												>
													{ date }
												</div>
											</div>
										) ) }
									</div>
								) }
							</div>
						</div>
					</div>
				</div>
			) }
			{ hasTimeSettings && <TimeSettings { ...props } /> }
		</div>
	);
};

export default DateTimeSettingsExtended;
