const { __ } = wp.i18n;
import { useState, useEffect, useRef } from 'react';
import Select from '../../../../../../components/Select';
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import Button from '../../../../../../components/Button';
import icons from '../../../../../../utils/Icons';
import TimePicker from '../../../../../../components/TimePicker';
import ButtonGroup from '../../../../../../components/button_group';

const allDays = [
	{ value: '0', label: 'Sunday' },
	{ value: '1', label: 'Monday' },
	{ value: '2', label: 'Tuesday' },
	{ value: '3', label: 'Wednesday' },
	{ value: '4', label: 'Thursday' },
	{ value: '5', label: 'Friday' },
	{ value: '6', label: 'Saturday' },
];
const allDates = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'29',
	'30',
	'31',
];

const DateTimeSettings = ( props ) => {
	const { settings, toolbarSetData, type } = props;

	const setOption = ( i, optionType, val ) => {
		const _options = [ ...( settings._options ?? [] ) ];
		_options.splice(
			i,
			1,
			Object.assign( {}, _options.length > 0 ? _options[ i ] : [], {
				[ optionType ]: val,
			} )
		);
		toolbarSetData( '_options', _options );
	};

	const [ isOpenDates, setIsOpenDates ] = useState( false );
	const [ isOpenDays, setIsOpenDays ] = useState( false );
	const openDaysRef = useRef();
	const openDateRef = useRef();

	const disableDays = settings.disableDays;
	const disableDates = settings.disableDates;

	const handleDateSelection = ( date ) => {
		const newDef = [ ...disableDates ];
		const index = newDef.indexOf( date );
		if ( index === -1 ) {
			newDef.push( date );
		} else {
			newDef.splice( index, 1 );
		}
		toolbarSetData( 'disableDates', newDef );
	};

	const handleDaYSelection = ( day ) => {
		const newDef = [ ...disableDays ];
		const index = newDef.indexOf( day );
		if ( index === -1 ) {
			newDef.push( day );
		} else {
			newDef.splice( index, 1 );
		}
		toolbarSetData( 'disableDays', newDef );
	};

	const priceTypes = [
		{ val: 'fixed', label: 'Fixed' },
		{ val: 'percentage', label: 'Percentage' },
		{ val: 'no_cost', label: 'No Cost' },
	];

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
		<>
			<div className="prad-d-flex prad-item-center prad-gap-40 prad-mb-24">
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
			<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-24">
				<div className="prad-w-full">
					<label
						htmlFor={ `${ settings.type }-label` }
						className="prad-field-title"
					>
						{ __( 'Title', 'product-addons' ) }
					</label>
					<input
						className="prad-input prad-bc-border-primary prad-w-full"
						type="text"
						id={ `${ settings.type }-label` }
						onChange={ ( v ) =>
							toolbarSetData( 'label', v.target.value )
						}
						value={ settings.label }
					/>
				</div>

				<div className="prad-w-full">
					<div className="prad-field-title">
						{ __( 'Price Position', 'product-addons' ) }
					</div>
					<Select
						options={ [
							{
								value: 'with_title',
								label: 'With Title',
							},
							{
								value: 'with_option',
								label: 'With Option',
							},
						] }
						onChange={ ( val ) => {
							toolbarSetData( 'pricePosition', val.value );
						} }
						width="100%"
						selectedOption={ settings.pricePosition }
						borderRadius="md"
						className="prad-toolbar-selection"
					/>
				</div>
			</div>
			<div className="prad-mb-24 prad-w-full">
				<ButtonGroup
					inlineView={ true }
					title={ __( 'Width' ) }
					value={ settings.blockWidth || '_100' }
					options={ [
						{ label: '33%', value: '_33' },
						{ label: '50%', value: '_50' },
						{ label: '66%', value: '_66' },
						{ label: '100%', value: '_100' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'blockWidth', value )
					}
				/>
			</div>
			<div className="prad-mb-24 prad-w-full">
				<ButtonGroup
					inlineView={ true }
					title={ __( 'Help Text Position' ) }
					value={ settings.descpPosition || 'belowTitle' }
					options={ [
						{ label: 'Below Title', value: 'belowTitle' },
						{ label: 'Tooltip', value: 'tooltip' },
						{ label: 'Below Field', value: 'belowField' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'descpPosition', value )
					}
				/>
				<div className="prad-field-title prad-mt-20">
					{ __( 'Help Text', 'product-addons' ) }
				</div>
				<input
					className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
					type="text"
					onChange={ ( e ) =>
						toolbarSetData( 'description', e.target.value )
					}
					placeholder={ __(
						'Enter description here..',
						'product-addons'
					) }
					value={ settings.description || '' }
				/>
			</div>

			{ type === 'time' && (
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-24">
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Time Range (Min)', 'product-addons' ) }
						</div>
						<div className="prad-settings-time prad-br-md prad-bc-border-primary prad-bg-base1 prad-color-active prad-font-14 prad-font-regular prad-lh-medium prad-d-flex prad-item-center prad-gap-8 prad-time-picker-container prad-custom-datetime-picker-container">
							<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
								{ icons.clock_20 }
							</div>
							<TimePicker
								onChange={ ( _val ) => {
									toolbarSetData( 'minTime', _val );
								} }
								defVal={ settings.minTime }
								placeholder={
									settings.minTime ||
									settings.timeFormat === '12_hours'
										? 'hh:mm AM/PM'
										: 'HH:mm'
								}
							/>
						</div>
					</div>
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Time Range (Max)', 'product-addons' ) }
						</div>
						<div className="prad-settings-time prad-br-md prad-border-primary prad-bg-base1 prad-color-active prad-font-14 prad-font-regular prad-lh-medium prad-d-flex prad-item-center prad-gap-8 prad-time-picker-container prad-custom-datetime-picker-container">
							<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
								{ icons.clock_20 }
							</div>
							<TimePicker
								onChange={ ( _val ) => {
									toolbarSetData( 'maxTime', _val );
								} }
								defVal={ settings.maxTime }
								placeholder={
									settings.maxTime ||
									settings.timeFormat === '12_hours'
										? 'hh:mm AM/PM'
										: 'HH:mm'
								}
							/>
						</div>
					</div>
				</div>
			) }

			<FieldOptions
				options={ settings._options }
				priceTypes={ priceTypes }
				hasMultiple={ false }
				setOption={ setOption }
				type={ type }
			/>
			{ type === 'date' && (
				<>
					<div className="prad-mt-24">
						<div className="prad-field-title">
							{ __( 'Date Format', 'product-addons' ) }
						</div>
						<Select
							options={ [
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
							] }
							onChange={ ( val ) => {
								toolbarSetData( 'dateFormat', val.value );
							} }
							width="100%"
							selectedOption={ settings.dateFormat }
							borderRadius="md"
							className="prad-toolbar-selection"
						/>
					</div>
					<div className="prad-mt-24">
						<div className="prad-field-title">
							{ __( 'Disable Days', 'product-addons' ) }
						</div>
						<div className="prad-relative" ref={ openDaysRef }>
							<div
								className={ `prad-multi-selection-wrapper prad-${
									isOpenDays ? 'active' : 'inactive'
								}` }
								onClick={ () => setIsOpenDays( ! isOpenDays ) }
								role="button"
								tabIndex="-1"
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										setIsOpenDays( ! isOpenDays );
									}
								} }
							>
								<div className="prad-w-full prad-multi-selection-container">
									{ disableDays.map( ( day, index ) => (
										<div
											key={ `${ day }_${ index }` }
											className="prad-multi-selection-item"
										>
											{ allDays[ Number( day ) ].label }
											<Button
												onlyIcon={ true }
												iconName="cross"
												padding="4px 0 0"
												className="prad-hover-color-negative"
												color="active"
												onClick={ ( e ) => {
													e.stopPropagation();
													handleDaYSelection(
														allDays[ Number( day ) ]
															.value
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
										maxHeight: '20vh',
									} }
								>
									{ allDays.map( ( day, index ) => (
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
															item === day.value
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
					<div className="prad-mt-24">
						<div className="prad-field-title">
							{ __( 'Disable Dates', 'product-addons' ) }
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
								tabIndex="-1"
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										setIsOpenDates( ! isOpenDates );
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
													handleDateSelection( date );
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
										maxHeight: '20vh',
										gridTemplateColumns:
											'repeat(7, minmax(46px, 1fr))',
									} }
								>
									{ allDates.map( ( date, index ) => (
										<div
											key={ `option_${ date }_${ index }` }
											className="prad-multi-selection-option prad-cursor-pointer"
										>
											<label
												htmlFor={ `all_types_${ date }_${ index }` }
											>
												<input
													className="prad-input-hidden prad-multi-selection-checkbox"
													type="checkbox"
													id={ `all_types_${ date }_${ index }` }
													checked={ disableDates.some(
														( item ) =>
															item === date
													) }
													onChange={ () => {
														handleDateSelection(
															date
														);
													} }
												/>
												<div className="prad-font-12 prad-ellipsis prad-multi-selection-name prad-select-option prad-cursor-pointer">
													{ date }
												</div>
											</label>
										</div>
									) ) }
								</div>
							) }
						</div>
					</div>
				</>
			) }
		</>
	);
};

export default DateTimeSettings;
