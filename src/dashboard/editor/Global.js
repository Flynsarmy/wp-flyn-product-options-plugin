import { useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { generateGlobalCss } from '../../blocks/helper/cssGenerator';
import Button from '../../components/Button';
import CardFieldSettings from '../../components/CardFieldSettings';
import CardTypography from '../../components/CardTypography';
import ColorPicker from '../../components/ColorPicker';
import ColorPickerTab from '../../components/ColorPickerTab';
import TabContainer from '../../components/TabContainer';
import { useAddons } from '../../context/AddonsContext';
import { useEditor } from '../../context/EditorContext';
import { iniGlobalStyle } from '../../utils/common_data/commonData';
import Icons from '../../utils/Icons';

export default function Global() {
	const { globalStyles, setGlobalStyles } = useEditor();
	const { updateDrawer, setHasUnsavedChanges } = useAddons();
	const { common: textStyle, field_comp: fieldStyle } = { ...globalStyles };
	const [ activeTab, setActiveTab ] = useState( 'text_style' );
	const [ openIndex, setOpenIndex ] = useState( 'heading_1' );
	const [ openOption, setOpenOption ] = useState( 'heading_1' );
	const [ openTypography, setOpenTypography ] = useState( {} );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ dropdownPosition, setDropdownPosition ] = useState( {
		width: 288,
		top: 0,
		left: 0,
		isAbove: false,
		isRight: false,
	} );

	const triggerRefs = useRef( [] );
	const dropdownRef = useRef( null );

	useLayoutEffect( () => {
		if ( isOpen && triggerRefs.current[ openIndex ] ) {
			const triggerRect =
				triggerRefs.current[ openIndex ]?.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;

			const dropdownHeight =
				dropdownRef.current?.getBoundingClientRect().height || 0;
			const dropdownWidth =
				dropdownRef.current?.getBoundingClientRect().width || 0;

			const isAbove =
				triggerRect?.top - dropdownHeight - 10 > 0
					? triggerRect.bottom + dropdownHeight + 10 > viewportHeight
					: false;
			const isRight =
				triggerRect.left - dropdownWidth - 10 > 0
					? triggerRect.left + dropdownWidth + 10 > viewportWidth
					: false;

			setDropdownPosition( {
				width: 288,
				top: isAbove
					? triggerRect?.top + window.scrollY - dropdownHeight - 1
					: triggerRect.bottom + window.scrollY + 1,
				left: isRight
					? triggerRect.right + window.scrollX - dropdownWidth
					: triggerRect.left + window.scrollX,
				isAbove,
				isRight,
			} );
		}
	}, [ isOpen, openIndex ] );

	const handleToggle = ( option, index ) => {
		setOpenIndex( index );
		setOpenOption( option );
		handleTypographyClick( option );
	};

	useLayoutEffect( () => {
		const abortControl = new AbortController();
		const handleClickOutside = ( event ) => {
			const isClickInsideTrigger = triggerRefs.current[
				openIndex
			]?.contains( event.target );
			const isClickInsideDropdown = dropdownRef.current?.contains(
				event.target
			);

			// Close the dropdown only if the click is outside both the trigger and the dropdown
			if ( ! isClickInsideTrigger && ! isClickInsideDropdown ) {
				setIsOpen( false );
				setOpenTypography( ( prevState ) => ( {
					...prevState,
					[ openOption ]: false,
				} ) );
			}
		};
		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		return () => abortControl.abort();
	}, [ openIndex, openOption ] );

	const getLabel = ( key ) => {
		const optionLabel = {
			heading: 'Heading',
			title: 'Title',
			description: 'Field Description',
			content: 'Field Content',
			placeHolder: 'Placeholder',
			price: 'Price',
			sectionTitle: 'Section Title',
			section: 'Section',
			input_field: 'Input Field',
			range: 'Range Slider',
			checkbox: 'Checkbox',
			radio: 'Radio',
			button: 'Button',
			switch: 'Switch',
			swatches: 'Image Swatches',
			color_swatches: 'Color Swatches',
			others: 'Others Color',
		};
		return optionLabel[ key ];
	};

	const getOptionLabel = ( key ) => {
		const optionLabel = {
			border_color: 'Border',
			bg_color: 'Background',
			active_color: 'Active Track',
			inactive_color: 'Inactive Track',
			icon_color: 'Icon',
			dot_color: 'Active',
			thumb_color: 'Thumb',
			active_border_color: 'Active Border',
			separator_color: 'Separator',
			req_color: 'Required (*)',
			error_color: 'Negative / Error',
			color: 'Font',
		};
		return optionLabel[ key ];
	};

	const handleTypographyClick = ( option ) => {
		setOpenTypography( ( prevState ) => {
			const newState = { ...prevState };

			// If the clicked typography is already open, close it
			if ( newState[ option ] ) {
				newState[ option ] = false;
				setIsOpen( false ); // Ensure dropdown is closed
			} else {
				// Close all other dropdowns
				Object.keys( newState ).forEach( ( key ) => {
					newState[ key ] = false;
				} );
				newState[ option ] = true; // Open the clicked one
				setIsOpen( true );
			}

			return newState;
		} );
	};

	/**
	 *
	 * @param {string} type    ex: common / field_comp
	 * @param {string} typeKey ex: heading, title / section
	 * @param {string} key     ex: typo/color
	 * @param {Object} value   ex: typo object / hexa code
	 */
	const updateGlobalStyle = ( type, typeKey, key, value ) => {
		let newObj = {};
		setHasUnsavedChanges( true );
		setGlobalStyles( ( prevStyle ) => {
			if ( key === 'open' ) {
				newObj = {
					...prevStyle,
					[ type ]: {
						...prevStyle[ type ],
						[ typeKey ]: {
							...( iniGlobalStyle[ type ]?.[ typeKey ] || {} ),
							open: false,
						},
					},
				};
			} else {
				newObj = {
					...prevStyle,
					[ type ]: {
						...prevStyle[ type ],
						[ typeKey ]: {
							...( prevStyle[ type ]?.[ typeKey ] || {} ),
							[ key ]: value,
							...( key !== 'open' && { open: true } ),
						},
					},
				};
			}
			generateGlobalCss( newObj );
			return newObj;
		} );
	};

	const renderTextOption = ( options, key ) => {
		return (
			<div className="prad-settings-container">
				{ Object.keys( options ).map( ( option, index ) => {
					switch ( option ) {
						case 'open':
							return (
								options[ option ] && (
									<div
										key={ option }
										className="prad-settings-reset prad-lh-0"
										onClick={ () =>
											updateGlobalStyle(
												'common',
												key,
												option,
												false
											)
										}
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												updateGlobalStyle(
													'common',
													key,
													option,
													false
												);
											}
										} }
									>
										{ Icons.reset }
									</div>
								)
							);
						case 'typo':
							return (
								<div
									key={ `${ option }_${ key }_${ index }` }
									ref={ ( el ) =>
										( triggerRefs.current[
											`${ key }_${ index }`
										] = el )
									}
									className={ `prad-settings-item prad-settings-icon prad-relative prad-lh-0 ${
										options.open && 'prad-first-child'
									}` }
									onClick={ () =>
										handleToggle(
											`${ option }_${ key }_${ index }`,
											`${ key }_${ index }`
										)
									}
									role="button"
									tabIndex="-1"
									onKeyDown={ ( e ) => {
										if ( e.key === 'Enter' ) {
											handleToggle(
												`${ option }_${ key }_${ index }`,
												`${ key }_${ index }`
											);
										}
									} }
								>
									{ Icons.text }
									{ openTypography[
										`${ option }_${ key }_${ index }`
									] &&
										isOpen && (
											<div
												className="prad-absolute prad-z-9 prad-right prad-bellow prad-cursor-default"
												style={ { width: '288px' } }
												onClick={ ( e ) =>
													e.stopPropagation()
												}
												role="button"
												tabIndex="-1"
												onKeyDown={ ( e ) => {
													if ( e.key === 'Enter' ) {
														e.stopPropagation();
													}
												} }
											>
												<CardTypography
													options={
														options[ option ]
													}
													onChange={ (
														fieldKey,
														value
													) =>
														updateGlobalStyle(
															'common',
															key,
															fieldKey,
															value
														)
													}
												/>
											</div>
										) }
								</div>
							);
						case 'color':
							return (
								<ColorPicker
									key={ option }
									className="prad-settings-item prad-settings-color"
									initialColor={ options[ option ] }
									onChange={ ( color ) =>
										updateGlobalStyle(
											'common',
											key,
											option,
											color
										)
									}
								/>
							);

						default:
							return null;
					}
				} ) }
			</div>
		);
	};
	const renderFieldOption = ( options, key ) => {
		return (
			<div className="prad-settings-container">
				{ Object.keys( options ).map( ( option, index ) => {
					switch ( option ) {
						case 'open':
							return (
								options.open && (
									<div
										key={ option }
										className="prad-settings-reset prad-lh-0"
										onClick={ () =>
											updateGlobalStyle(
												'field_comp',
												key,
												option,
												false
											)
										}
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												updateGlobalStyle(
													'field_comp',
													key,
													option,
													false
												);
											}
										} }
									>
										{ Icons.reset }
									</div>
								)
							);
						case 'border_color':
						case 'bg_color':
						case 'active_color':
						case 'inactive_color':
						case 'icon_color':
						case 'dot_color':
						case 'thumb_color':
						case 'active_border_color':
						case 'separator_color':
						case 'req_color':
						case 'error_color':
						case 'color':
							return (
								<div
									key={ option }
									className={ `prad-settings-item prad-settings-color ${
										options.open && 'prad-first-child'
									}` }
								>
									<div>{ getOptionLabel( option ) }</div>
									{ typeof options[ option ] !== 'object' ? (
										<ColorPicker
											key={ `${ option }_${ index }` }
											initialColor={ options[ option ] }
											onChange={ ( color ) =>
												updateGlobalStyle(
													'field_comp',
													key,
													option,
													color
												)
											}
										/>
									) : (
										<ColorPickerTab
											normalColor={
												options[ option ][
													Object.keys(
														options[ option ]
													)[ 0 ]
												]
											}
											hoverColor={
												options[ option ][
													Object.keys(
														options[ option ]
													)[ 1 ]
												]
											}
											normalText={
												Object.keys(
													options[ option ]
												)[ 0 ]
											}
											hoverText={
												Object.keys(
													options[ option ]
												)[ 1 ]
											}
											onChange={ ( color ) =>
												updateGlobalStyle(
													'field_comp',
													key,
													option,
													color
												)
											}
										/>
									) }
								</div>
							);
						case 'settings':
							return (
								<div
									key={ `${ option }_${ key }_${ index }` }
									ref={ ( el ) =>
										( triggerRefs.current[
											`${ key }_${ index }`
										] = el )
									}
									className={ `prad-settings-item prad-settings-icon prad-relative prad-lh-0` }
									onClick={ () =>
										handleToggle(
											`${ option }_${ key }_${ index }`,
											`${ key }_${ index }`
										)
									}
									role="button"
									tabIndex="-1"
									onKeyDown={ ( e ) => {
										if ( e.key === 'Enter' ) {
											handleToggle(
												`${ option }_${ key }_${ index }`,
												`${ key }_${ index }`
											);
										}
									} }
								>
									{ Icons.controller }
									{ openTypography[
										`${ option }_${ key }_${ index }`
									] &&
										isOpen &&
										ReactDOM.createPortal(
											<div
												ref={ dropdownRef }
												onClick={ ( e ) =>
													e.stopPropagation()
												}
												role="button"
												tabIndex="-1"
												onKeyDown={ ( e ) => {
													if ( e.key === 'Enter' ) {
														e.stopPropagation();
													}
												} }
												style={ {
													zIndex: isOpen
														? 999999
														: -999999,
													opacity: isOpen ? 1 : 0,
													top: isOpen
														? `${ dropdownPosition.top }px`
														: 0,
													left: isOpen
														? `${ dropdownPosition.left }px`
														: 0,
													width: `200px`,
													transition: '0',
													position: 'absolute',
												} }
											>
												<CardFieldSettings
													options={
														options[ option ]
													}
													onChange={ (
														fieldKey,
														value
													) =>
														updateGlobalStyle(
															'field_comp',
															key,
															fieldKey,
															value
														)
													}
												/>
											</div>,
											document.body
										) }
								</div>
							);
						case 'typo':
							return (
								<div
									key={ `${ option }_${ key }_${ index }` }
									ref={ ( el ) =>
										( triggerRefs.current[
											`${ key }_${ index }`
										] = el )
									}
									className={ `prad-settings-item prad-settings-icon prad-relative prad-lh-0` }
									onClick={ () =>
										handleToggle(
											`${ option }_${ key }_${ index }`,
											`${ key }_${ index }`
										)
									}
									role="button"
									tabIndex="-1"
									onKeyDown={ ( e ) => {
										if ( e.key === 'Enter' ) {
											handleToggle(
												`${ option }_${ key }_${ index }`,
												`${ key }_${ index }`
											);
										}
									} }
								>
									{ Icons.text }
									{ openTypography[
										`${ option }_${ key }_${ index }`
									] &&
										isOpen &&
										ReactDOM.createPortal(
											<div
												ref={ dropdownRef }
												onClick={ ( e ) =>
													e.stopPropagation()
												}
												role="button"
												tabIndex="-1"
												onKeyDown={ ( e ) => {
													if ( e.key === 'Enter' ) {
														e.stopPropagation();
													}
												} }
												style={ {
													zIndex: isOpen
														? 999999
														: -999999,
													opacity: isOpen ? 1 : 0,
													top: isOpen
														? `${ dropdownPosition.top }px`
														: 0,
													left: isOpen
														? `${ dropdownPosition.left }px`
														: 0,
													width: `${ dropdownPosition.width }px`,
													transition: '0',
													position: 'absolute',
												} }
											>
												<CardTypography
													options={
														options[ option ]
													}
													onChange={ (
														fieldKey,
														value
													) =>
														updateGlobalStyle(
															'field_comp',
															key,
															fieldKey,
															value
														)
													}
												/>
											</div>,
											document.body
										) }
								</div>
							);

						default:
							return null;
					}
				} ) }
			</div>
		);
	};

	return (
		<div className="prad-w-full">
			<div className="prad-d-flex prad-item-center prad-justify-between prad-text-color prad-mb-24">
				<div className="prad-font-16 prad-font-semi">
					Global Style settings
				</div>
				<Button
					onlyIcon={ true }
					iconName="cross_24"
					borderBtn={ true }
					color="dark"
					padding="3.2px"
					className="prad-btn-close"
					onClick={ () =>
						updateDrawer( ( prevDrawer ) => ( {
							...prevDrawer,
							open: ! prevDrawer.open,
							compo: 'global',
						} ) )
					}
				/>
			</div>
			<div className="">
				<TabContainer
					tabItems={ [
						{
							key: 'text_style',
							label: 'Common Text Style',
						},
						{
							key: 'field_style',
							label: 'Field Component Style',
						},
					] }
					initialTabItem={ activeTab }
					type="tertiary"
					containerClass="prad-global-settings-container prad-scrollbar"
					onTabSelect={ ( tab ) => {
						setActiveTab( tab.key );
					} }
				>
					{ ( selected ) => (
						<>
							{ selected.key === 'text_style' &&
								Object.keys( textStyle ).map( ( key ) => (
									<div
										key={ key }
										className={ `prad-settings-wrapper prad-settings-active-tab-${ activeTab }` }
									>
										<div className="prad-font-semi">
											{ getLabel( key ) }
										</div>
										{ renderTextOption(
											textStyle[ key ],
											key
										) }
									</div>
								) ) }
							{ selected.key === 'field_style' &&
								Object.keys( fieldStyle ).map( ( key ) => (
									<div
										key={ key }
										className={ `prad-settings-wrapper prad-settings-active-tab-${ activeTab }` }
									>
										<div className="prad-font-semi">
											{ getLabel( key ) }
										</div>
										{ renderFieldOption(
											fieldStyle[ key ],
											key
										) }
									</div>
								) ) }
						</>
					) }
				</TabContainer>
			</div>
		</div>
	);
}
