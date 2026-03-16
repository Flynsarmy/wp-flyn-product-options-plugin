import { useRef, useState } from 'react';
import Button from '../../../../../../components/Button';
import Portal from '../../../../../../components/portal/Portal';
import Select from '../../../../../../components/Select';
import { useAddons } from '../../../../../../context/AddonsContext';
import { useEditor } from '../../../../../../context/EditorContext';
import FontStyles from '../../../../../../dashboard/fonts/components/FontStyles';
import FieldToggle from '../../../../common/FieldToggle';
import { FieldHelpText, FieldTitle } from '../common_compo/generalCommon';
const { __ } = wp.i18n;

const FontPickerSettings = ( props ) => {
	const { type, settings, toolbarSetData } = props;
	const [ showPanel, setShowPanel ] = useState( false );
	const buttonRef = useRef();

	const { customFonts } = useEditor();
	const { fieldData } = useAddons();

	const options = settings._options || [];
	const toApplyFields = settings.toApplyFields || [];
	const defVal = settings?.defval || [];
	const elementRefs = useRef( [] );

	const setNew = () => {
		const newOptions = [
			...( settings._options ?? [] ),
			{
				fontFamily: '',
				type: 'fixed',
				regular: '12',
				sale: '',
			},
		];
		toolbarSetData( '_options', newOptions );
	};

	const setDelete = ( position ) => {
		const _options = [ ...( settings._options ?? [] ) ];
		_options.splice( position, 1 );
		toolbarSetData( '_options', _options );
	};

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

	const priceTypes = [
		{ value: 'fixed', label: 'Fixed' },
		{ value: 'percentage', label: 'Percentage' },
		{ value: 'no_cost', label: 'No Cost' },
	];

	const handleActiveStatus = ( i ) => {
		const newDef = defVal?.indexOf( i ) > -1 ? [] : [ i ];
		toolbarSetData( 'defval', newDef );
	};

	const addedFontFamily = options.map( ( opt ) => opt.fontFamily );

	const handleToApplyFields = ( fieldId ) => {
		const appliedFields = [ ...( toApplyFields ?? [] ) ];
		const existingIndex = appliedFields.indexOf( fieldId );

		if ( existingIndex > -1 ) {
			appliedFields.splice( existingIndex, 1 );
		} else {
			appliedFields.push( fieldId );
		}

		toolbarSetData( 'toApplyFields', appliedFields );
	};

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-flex-wrap prad-gap-40">
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
			<div className="prad-relative prad-pb-20 prad-border-default prad-br-smd">
				<div className="prad-editor-settings-table">
					<div
						className={ `prad-field-header prad-font-14 prad-font-semi prad-mb-20 prad-gap-12 prad-d-grid` }
						style={ {
							gridTemplateColumns:
								'minmax(140px,1fr) minmax(80px,.8fr) minmax(20px,.4fr) minmax(20px,.4fr) 42px 42px',
						} }
					>
						<div>{ __( 'Title', 'product-addons' ) }</div>
						<div>{ __( 'Price Type', 'product-addons' ) }</div>
						<div>{ __( 'Regular', 'product-addons' ) }</div>
						<div className="prad-relative">
							{ __( 'Sales', 'product-addons' ) }
						</div>

						<div>{ __( 'Active', 'product-addons' ) }</div>
					</div>
					<FontStyles fonts={ customFonts } />
					{ options.map( ( val, i ) => {
						const selectedFont =
							customFonts.find(
								( f ) => f.id === val.fontFamily
							) || {};
						return (
							<div
								className={ `prad-field-row prad-drag-wrapper-toolbar prad-gap-12 prad-plr-20 prad-d-grid prad-item-center` }
								key={ i }
								id={ i }
								style={ {
									gridTemplateColumns:
										'minmax(140px,1fr) minmax(80px,.8fr) minmax(20px,.4fr) minmax(20px,.4fr) 42px 42px',
								} }
							>
								<div>
									<Select
										options={ customFonts?.map(
											( item ) => ( {
												value: item.id,
												label: item.title,
												family: item.family,
												disabled:
													addedFontFamily?.includes(
														item.id
													),
											} )
										) }
										onChange={ ( v ) => {
											setOption(
												i,
												'fontFamily',
												v.value
											);
										} }
										minWidth="100%"
										selectedOption={ val.fontFamily }
										selectedFamily={ selectedFont.family }
										valueClass="prad-ellipsis"
									/>
								</div>

								<div className="prad-relative prad-d-flex prad-item-center ">
									<Select
										options={ priceTypes }
										onChange={ ( v ) => {
											setOption( i, 'type', v.value );
										} }
										minWidth="100%"
										selectedOption={ val.type }
										valueClass="prad-ellipsis"
									/>
								</div>
								<div>
									<input
										className={ `prad-input prad-bc-border-primary prad-w-full prad-${
											val.type === 'no_cost'
												? 'disable'
												: 'enable'
										}` }
										type={
											val.type === 'no_cost'
												? 'text'
												: 'number'
										}
										onChange={ ( v ) => {
											const _val = v.target.value;
											setOption(
												i,
												'regular',
												_val < 0
													? Math.abs( Number( _val ) )
													: _val
											);
										} }
										value={
											val.type === 'no_cost'
												? 'Free'
												: val.regular
										}
									/>
								</div>
								<div>
									<input
										className={ `prad-input prad-bc-border-primary prad-w-full prad-${
											val.type === 'no_cost'
												? 'disable'
												: 'enable'
										} prad-opacity-${
											val.type === 'no_cost'
												? 'half'
												: 'full'
										}` }
										type="number"
										onChange={ ( v ) => {
											const _val = v.target.value;
											setOption(
												i,
												'sale',
												_val < 0
													? Math.abs( Number( _val ) )
													: _val
											);
										} }
										value={ val.sale }
									/>
								</div>
								<div
									className={ `prad-radio-custom prad-${
										defVal?.indexOf( i ) > -1
											? 'active'
											: 'inactive'
									}` }
									ref={ ( el ) =>
										( elementRefs.current[ i ] = el )
									}
									onClick={ () => handleActiveStatus( i ) }
									role="button"
									tabIndex="-1"
									onKeyDown={ ( e ) => {
										if ( e.key === 'Enter' ) {
											handleActiveStatus( i );
										}
									} }
								/>
								<Button
									onlyIcon={ true }
									iconName="delete"
									background="base2"
									fontHeight="0"
									borderRadius="100"
									className="prad-btn-close"
									borderColor="transparent"
									onClick={ () => setDelete( i ) }
								/>
							</div>
						);
					} ) }
				</div>
				<div className="prad-plr-20 prad-mt-20">
					<Button
						value={ __( 'Add New', 'product-addons' ) }
						iconName="plus_20"
						background="primary"
						onClick={ () => setNew() }
					/>
				</div>
			</div>
			<div className="prad-d-flex prad-gap-12 prad-mb-24">
				<div
					className={ ` prad-cursor-pointer prad-settings-font-applied` }
					ref={ buttonRef }
					onClick={ () => {
						setShowPanel( true );
					} }
				>
					{ __( 'Applied Fields:', 'product-addons' ) }
					<div
						className={ `prad-settings-font-applied-count prad-cursor-pointer ` }
					>
						{ toApplyFields.length }{ ' ' }
					</div>
				</div>
				<Portal
					isOpen={ showPanel }
					anchorRef={ buttonRef }
					onClickOutside={ () => setShowPanel( false ) }
				>
					<div
						className="prad-border-default prad-br-smd prad-d-flex prad-gap-8 prad-flex-column prad-bg-base1 prad-scrollbar prad-overflow-y-auto prad-overflow-x-hidden"
						style={ {
							minWidth: '270px',
							padding: '20px 10px',
							maxHeight: '35vh',
							marginTop: '6px',
						} }
					>
						{ fieldData.map( ( field, key ) => {
							if (
								! [ 'textfield', 'textarea' ].includes(
									field.type
								)
							) {
								return null;
							}
							const isSelected = toApplyFields.includes(
								field.blockid
							);

							return (
								<div
									key={ key }
									className={ `prad-d-flex prad-gap-12 prad-cursor-pointer ${
										isSelected ? 'prad-bg-base2' : ''
									}` }
									onClick={ () =>
										handleToApplyFields( field.blockid )
									}
									style={ {
										padding: '6px 10px',
										borderRadius: '4px',
										border: '1px solid var(--prad-color-base-three)',
									} }
								>
									<div
										className={ ` prad-cursor-pointer prad-ellipsis-2` }
									>
										{ field.label }
									</div>
								</div>
							);
						} ) }
					</div>
				</Portal>

				<div className="pr prad-mt-20"></div>
			</div>
		</div>
	);
};

export default FontPickerSettings;
