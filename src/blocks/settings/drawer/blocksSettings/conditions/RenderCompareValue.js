const { __ } = wp.i18n;
import { useState } from 'react';
import Select from '../../../../../components/Select';
import Button from '../../../../../components/Button';
import TimePicker from '../../../../../components/TimePicker';
import icons from '../../../../../utils/Icons';
import DatePicker from '../../../../../components/DatePicker';

const isSelectAble = ( type ) => {
	return [
		'radio',
		'checkbox',
		'select',
		'color_switch',
		'img_switch',
		'button',
	].includes( type );
};

const RenderCompareValue = ( props ) => {
	const { propsData, handleConditionOptions } = props;
	const { k, val, selectedBlock } = propsData;

	const [ isOpenDateArray, setIsOpenDateArray ] = useState( false );
	const [ isOpenColorArray, setIsOpenColorArray ] = useState( false );
	const [ currenSelect, setCurrentSelect ] = useState( '' );

	const [ newSelectedColor, setNewSelectedColor ] = useState( '#86a62c' );

	const selectAble = isSelectAble( selectedBlock.type );

	const renderComparisonValue = () => {
		const isNum = [ 'range', 'number' ].includes( selectedBlock.type );
		const isSwitch = selectedBlock.type === 'switch';
		const value = val.value;

		const handleAnyChanges = ( field, _val, multiple = false ) => {
			if ( multiple ) {
				const newVal = [ ...value, _val ];
				handleConditionOptions( 'rules', 'value', newVal, k );
			} else {
				handleConditionOptions( 'rules', 'value', _val, k );
			}
		};

		const renderSelect = ( _options, selectValue, _multiple = false ) => {
			const optionsArray = _options
				? [
						{
							value: 'Select Option',
							label: 'Select Option',
						},
				  ].concat(
						_options.map( ( option ) => ( {
							value: option.value,
							label: option.value,
						} ) )
				  )
				: [];
			const optionsValuesArray = _options.map(
				( option ) => option.value
			);

			const handleSelection = ( fileType ) => {
				const newDef = [ ...selectValue ];
				const index = newDef.indexOf( fileType );
				if ( index === -1 ) {
					newDef.push( fileType );
				} else {
					newDef.splice( index, 1 );
				}
				handleAnyChanges( 'multiselect', newDef );
			};

			return _multiple ? (
				<div className="prad-relative prad-w-full">
					<div
						className={ `prad-multi-selection-wrapper prad-plr-12 prad-${
							currenSelect === k ? 'active' : 'inactive'
						}` }
						onClick={ () =>
							setCurrentSelect( currenSelect === k ? '' : k )
						}
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								setCurrentSelect( currenSelect === k ? '' : k );
							}
						} }
					>
						<div className="prad-w-full prad-multi-selection-container">
							<div>{ selectValue.length } items</div>
						</div>
						<div className="prad-lh-0 prad-multi-selection-icon">
							{ icons.angleDown }
						</div>
					</div>
					{ currenSelect === k && (
						<div
							className="prad-multi-selection-options prad-select-dropdown prad-upper-4 prad-overflow-y-auto prad-overflow-x-hidden prad-scrollbar"
							style={ { maxHeight: '20vh' } }
						>
							{ optionsValuesArray.map( ( fileType, index ) => (
								<div
									key={ `option_${ fileType }_${ index }` }
									className="prad-multi-selection-option prad-cursor-pointer"
								>
									<label
										htmlFor={ `all_types_${ fileType }_${ index }` }
									>
										<input
											className="prad-input-hidden prad-multi-selection-checkbox"
											type="checkbox"
											id={ `all_types_${ fileType }_${ index }` }
											checked={
												selectValue.indexOf(
													fileType
												) > -1
											}
											onChange={ () => {
												handleSelection( fileType );
											} }
										/>
										<div className="prad-font-12 prad-ellipsis prad-multi-selection-name prad-select-option prad-cursor-pointer">
											{ fileType }
										</div>
									</label>
								</div>
							) ) }
						</div>
					) }
				</div>
			) : (
				<Select
					options={ optionsArray }
					onChange={ ( option ) => {
						handleAnyChanges( 'select', option.value );
					} }
					width="100%"
					selectedOption={ selectValue ? selectValue : '' }
					dropdownMaxHeight="20vh"
					dropdownClass="prad-overflow-y-auto prad-scrollbar"
					valueClass="prad-ellipsis"
				/>
			);
		};

		const renderDateTime = ( type = '' ) => {
			if ( type === '_date_in' || type === '_date_not_in' ) {
				// const selectedDate = JSON.stringify( value );
				const selectedDate = value || [];

				return (
					<div className="prad-relative prad-w-full">
						<div
							className={ `prad-multi-selection-wrapper prad-plr-12 prad-${
								isOpenDateArray ? 'active' : 'inactive'
							}` }
							onClick={ () =>
								setIsOpenDateArray( ! isOpenDateArray )
							}
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									setIsOpenDateArray( ! isOpenDateArray );
								}
							} }
						>
							<div className="prad-multi-selection-container">
								{ selectedDate.length }{ ' ' }
								{ __( 'dates selected', 'product-addons' ) }
							</div>
							<div className="prad-lh-0 prad-multi-selection-icon">
								{ icons.angleDown }
							</div>
						</div>
						{ isOpenDateArray && (
							<div className="prad-card prad-bg-base1 prad-absolute prad-upper-2 prad-w-full prad-z-9 prad-br-smd prad-p-12">
								<div
									className={ `prad-custom-datetime-picker-container` }
								>
									<div className="prad-date-picker-container">
										<DatePicker
											dateFormat={
												selectedBlock.dateFormat
											}
											placeholder={ __(
												'Pick a Date',
												'product-addons'
											) }
											defVal={ '' }
											onChange={ ( _val ) =>
												handleAnyChanges( 'date', [
													...( value || [] ),
													_val,
												] )
											}
											resetValueOnChange={ true }
										/>
									</div>
								</div>
								<div
									className="prad-mt-12 prad-d-flex prad-gap-8 prad-flex-column prad-overflow-y-auto prad-scrollbar"
									style={ { maxHeight: '8vh' } }
								>
									{ selectedDate.map( ( date, i ) => (
										<div
											key={ `${ date }_${ i }` }
											className="prad-selected-item prad-d-flex prad-item-center prad-gap-8"
										>
											{ date }
											<div
												onClick={ ( e ) => {
													e.stopPropagation();
													handleAnyChanges(
														'date',
														value.filter(
															( item ) =>
																item !== date
														)
													);
												} }
												role="button"
												tabIndex="-1"
												onKeyDown={ ( e ) => {
													if ( e.key === 'Enter' ) {
														e.stopPropagation();
														handleAnyChanges(
															'date',
															value.filter(
																( item ) =>
																	item !==
																	date
															)
														);
													}
												} }
												className="prad-lh-0 prad-btn-close prad-p-0 prad-selected-item-remover"
											>
												{ icons.cross }
											</div>
										</div>
									) ) }
								</div>
							</div>
						) }
					</div>
				);
			} else if ( type === '_date_between' ) {
				return (
					<div className="prad-d-flex prad-item-center prad-gap-4">
						<div
							className={ `prad-custom-datetime-picker-container` }
						>
							<div className="prad-date-picker-container">
								<DatePicker
									dateFormat={ selectedBlock.dateFormat }
									placeholder={
										value?._from || selectedBlock.dateFormat
									}
									defVal={ value?._from || '' }
									onChange={ ( _val ) =>
										handleAnyChanges( 'date', {
											...( value || {} ),
											_from: _val,
										} )
									}
									padding="4px"
									width="102px"
									style={ { textAlign: 'center' } }
								/>
							</div>
						</div>
						<div className="prad-lh-0">{ icons.arrowRight }</div>
						<div
							className={ `prad-custom-datetime-picker-container` }
						>
							<div className="prad-date-picker-container">
								<DatePicker
									minDate={ value?._from || '' }
									dateFormat={ selectedBlock.dateFormat }
									placeholder={
										value?._to || selectedBlock.dateFormat
									}
									defVal={ value?._to || '' }
									onChange={ ( _val ) =>
										handleAnyChanges( 'date', {
											...( value || {} ),
											_to: _val,
										} )
									}
									padding="4px"
									width="102px"
									style={ { textAlign: 'center' } }
								/>
							</div>
						</div>
					</div>
				);
			}
			return (
				<div className={ `prad-custom-datetime-picker-container` }>
					<div className="prad-date-picker-container">
						<DatePicker
							dateFormat={ selectedBlock.dateFormat }
							placeholder={ value || selectedBlock.dateFormat }
							defVal={ value }
							onChange={ ( _val ) =>
								handleAnyChanges( 'date', _val )
							}
						/>
					</div>
				</div>
			);
		};

		const renderTimePicker = () => {
			return (
				<div className="prad-settings-time prad-setting-logic prad-br-md prad-bc-border-primary prad-bg-base1 prad-color-active prad-font-14 prad-font-regular prad-lh-medium prad-d-flex prad-item-center prad-gap-8 prad-time-picker-container prad-custom-datetime-picker-container">
					<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
						{ icons.clock_20 }
					</div>
					<TimePicker
						onChange={ ( _val ) => {
							handleAnyChanges( 'time', _val );
						} }
						defVal={ value || '' }
						placeholder={ 'hh:mm A' }
					/>
				</div>
			);
		};
		const renderTextField = ( _multiple = false ) => {
			return _multiple ? (
				<div>
					<div className="prad-multiple-val-container">
						value: { ( value || [] )?.join( ' + ' ) }
					</div>
					<input
						type="text"
						className="prad-input prad-bc-border-primary prad-w-full"
						placeholder="Insert Value"
						onBlur={ ( e ) => {
							handleAnyChanges( 'text', e.target.value, true );
							e.target.value = '';
						} }
					/>
				</div>
			) : (
				<input
					type="text"
					className="prad-input prad-bc-border-primary prad-w-full"
					placeholder="Insert Value"
					value={ value }
					onChange={ ( e ) =>
						handleAnyChanges( 'text', e.target.value )
					}
				/>
			);
		};
		const renderNumber = ( _multiple = false ) => {
			return _multiple ? (
				<div>
					<div className="prad-multiple-val-container">
						value: { ( value || [] )?.join( ' + ' ) }
					</div>
					<input
						type="number"
						className="prad-input prad-bc-border-primary prad-w-full"
						placeholder="Insert Value"
						onBlur={ ( e ) => {
							handleAnyChanges( 'number', e.target.value, true );
							e.target.value = '';
						} }
					/>
				</div>
			) : (
				<input
					type="number"
					className="prad-input prad-bc-border-primary prad-w-full"
					placeholder="Insert Value"
					value={ value }
					onChange={ ( e ) =>
						handleAnyChanges( 'number', e.target.value )
					}
				/>
			);
		};

		if ( val?.compare === '_is' || val?.compare === '_not_is' ) {
			if ( isSwitch ) {
				return renderSelect(
					[ { value: 'true' }, { value: 'false' } ],
					value,
					false
				);
			} else if ( selectAble ) {
				return renderSelect( selectedBlock._options, value, false );
			} else if ( isNum ) {
				return renderNumber( false );
			} else if ( selectedBlock.type === 'color_picker' ) {
				return (
					<div className="prad-d-flex prad-item-center prad-gap-8 prad-w-fit prad-border-default prad-br-smd prad-p-4">
						<input
							type="color"
							value={ value || '#ffffff' }
							onChange={ ( e ) => {
								handleAnyChanges(
									'color_picker',
									e.target.value
								);
							} }
							className="prad-input"
						/>
						<input
							type="text"
							className="prad-w-70 prad-bc-border-primary prad-input prad-min-height-26 prad-max-height-26"
							value={ value || '#ffffff' }
							onChange={ ( e ) => {
								handleAnyChanges(
									'color_picker',
									e.target.value
								);
							} }
						/>
					</div>
				);
			}
			return renderTextField();
		} else if ( val.compare === '_in' || val.compare === '_not_in' ) {
			if ( isSwitch ) {
				return renderSelect(
					[ { value: 'true' }, { value: 'false' } ],
					value,
					true
				);
			} else if ( selectAble ) {
				return renderSelect( selectedBlock._options, value, true );
			} else if ( isNum ) {
				return renderNumber( true );
			} else if ( selectedBlock.type === 'color_picker' ) {
				const selectedColor = value || [];
				return (
					<div className="prad-relative prad-w-full">
						<div
							className={ `prad-multi-selection-wrapper prad-plr-12 prad-${
								isOpenColorArray ? 'active' : 'inactive'
							}` }
							onClick={ () =>
								setIsOpenColorArray( ! isOpenColorArray )
							}
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									setIsOpenColorArray( ! isOpenColorArray );
								}
							} }
						>
							<div className="prad-multi-selection-container">
								{ selectedColor.length }{ ' ' }
								{ __( 'Color selected', 'product-addons' ) }
							</div>
							<div className="prad-lh-0 prad-multi-selection-icon">
								{ icons.angleDown }
							</div>
						</div>
						{ isOpenColorArray && (
							<div className="prad-block-color-picker prad-card prad-bg-base1 prad-absolute prad-upper-2 prad-w-full prad-z-9 prad-br-smd prad-p-12">
								<div className="prad-d-flex prad-item-center prad-gap-8 prad-w-fit">
									<input
										type="color"
										value={ newSelectedColor || '#86a62c' }
										onChange={ ( e ) => {
											setNewSelectedColor(
												e.target.value
											);
										} }
										className="prad-input"
									/>
									<input
										type="text"
										className="prad-w-full prad-input"
										style={ { minHeight: '26px' } }
										value={ newSelectedColor || '#86a62c' }
										onChange={ ( e ) =>
											setNewSelectedColor(
												e.target.value
											)
										}
									/>
									<Button
										onlyIcon={ true }
										iconName="plus"
										color="text-dark"
										padding="4px"
										borderBtn={ true }
										onClick={ () =>
											handleAnyChanges( 'color_picker', [
												...( value || [] ),
												newSelectedColor,
											] )
										}
									/>
								</div>
								<div
									className="prad-mt-12 prad-d-flex prad-gap-8 prad-flex-column prad-overflow-y-auto prad-scrollbar"
									style={ { maxHeight: '8vh' } }
								>
									{ selectedColor.map( ( color, i ) => (
										<div
											key={ `${ color }_${ i }` }
											className="prad-selected-item prad-d-flex prad-item-center prad-gap-8"
										>
											<div className="prad-d-flex prad-item-center prad-gap-4">
												<div
													style={ {
														width: '12px',
														height: '12px',
														borderRadius: '50%',
														border: '1px solid var(--prad-color-border-primary)',
														background: color,
													} }
												></div>
												{ color }
											</div>
											<div
												onClick={ ( e ) => {
													e.stopPropagation();
													handleAnyChanges(
														'color_picker',
														value.filter(
															( item ) =>
																item !== color
														)
													);
												} }
												role="button"
												tabIndex="-1"
												onKeyDown={ ( e ) => {
													if ( e.key === 'Enter' ) {
														e.stopPropagation();
														handleAnyChanges(
															'color_picker',
															value.filter(
																( item ) =>
																	item !==
																	color
															)
														);
													}
												} }
												className="prad-lh-0 prad-btn-close prad-p-0 prad-selected-item-remover"
											>
												{ icons.cross }
											</div>
										</div>
									) ) }
								</div>
							</div>
						) }
					</div>
				);
			}
			return renderTextField( true );
		} else if ( val.compare === '_empty' || val.compare === '_not_empty' ) {
			return '';
		} else if (
			val.compare === '_contains' ||
			val.compare === '_not_contains'
		) {
			return renderTextField( false );
		} else if (
			[ '_less', '_less_equal', '_greater', '_greater_equal' ].includes(
				val.compare
			)
		) {
			return renderNumber( false );
		} else if (
			val.compare === '_date_is' ||
			val.compare === '_date_not_is' ||
			val.compare === '_date_in' ||
			val.compare === '_date_not_in' ||
			val.compare === '_date_between' ||
			val.compare === '_date_less' ||
			val.compare === '_date_greater'
		) {
			return renderDateTime( val.compare );
		} else if (
			val.compare === '_time_before' ||
			val.compare === '_time_after'
		) {
			return renderTimePicker( val.compare );
		}
	};

	return (
		<div
			className={ 'prad-w-full prad-opacity-thick' }
			style={ { minHeight: '40px', maxWidth: '200px' } }
		>
			{ renderComparisonValue() }
		</div>
	);
};

export default RenderCompareValue;
