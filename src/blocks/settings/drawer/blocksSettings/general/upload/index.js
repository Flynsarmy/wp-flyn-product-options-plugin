const { __ } = wp.i18n;
import { useState } from 'react';
import Icons from '../../../../../../utils/Icons';
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import Button from '../../../../../../components/Button';
import { FieldHelpText, FieldTitle } from '../common_compo/generalCommon';

const UploadSettings = ( props ) => {
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

	const priceTypes = [
		{ val: 'fixed', label: 'Fixed' },
		{ val: 'percentage', label: 'Percentage' },
		{ val: 'no_cost', label: 'No Cost' },
	];

	const [ isOpen, setIsOpen ] = useState( false );

	const allFileTypes = [
		'png',
		'jpg',
		'jpeg',
		'pdf',
		'csv',
		'doc',
		'txt',
		'ppt',
	];
	const selectedFileTypes = settings.allowedFileTypes || [];

	const handleSelection = ( fileType ) => {
		const newDef = [ ...selectedFileTypes ];
		const index = newDef.indexOf( fileType );
		if ( index === -1 ) {
			newDef.push( fileType );
		} else {
			newDef.splice( index, 1 );
		}
		toolbarSetData( 'allowedFileTypes', newDef );
	};

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
			<div className="prad-mt-24 prad-mb-24 prad-border-top-default prad-pt-20">
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-24">
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Upload Text', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							onChange={ ( e ) =>
								toolbarSetData( 'uploadText', e.target.value )
							}
							value={ settings.uploadText || 'Upload' }
						/>
					</div>
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Drag & Drop Text', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							onChange={ ( e ) =>
								toolbarSetData( 'dragDropText', e.target.value )
							}
							value={
								settings.dragDropText ||
								'Click or drag and drop'
							}
						/>
					</div>
				</div>
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-24">
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Maximum File Size', 'product-addons' ) } (MB)
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="number"
							max={ 25 }
							onChange={ ( e ) =>
								toolbarSetData( 'maxSize', e.target.value )
							}
							value={ settings.maxSize }
						/>
					</div>
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Error Message', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							onChange={ ( e ) =>
								toolbarSetData( 'sizeError', e.target.value )
							}
							value={ settings.sizeError }
						/>
					</div>
				</div>
				<div className="prad-w-full prad-mt-12">
					<label
						htmlFor={ `file_size_label` }
						className="prad-field-title"
					>
						{ __( 'File Size Prefix Text', 'product-addons' ) }
					</label>
					<input
						className="prad-input prad-bc-border-primary prad-w-full"
						type="text"
						placeholder="Max File Size: [max_size]"
						id={ `file_size_label` }
						onChange={ ( v ) =>
							toolbarSetData( 'sizePrefix', v.target.value )
						}
						value={ settings.sizePrefix }
					/>
				</div>
			</div>
			<div className="prad-mb-24 prad-border-top-default prad-pt-20">
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-24">
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __(
								'Maximum Number of Files',
								'product-addons'
							) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="number"
							onChange={ ( e ) =>
								toolbarSetData( 'maxNumber', e.target.value )
							}
							value={ settings.maxNumber }
						/>
					</div>
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Error Message', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							onChange={ ( e ) =>
								toolbarSetData( 'numberError', e.target.value )
							}
							value={ settings.numberError }
						/>
					</div>
				</div>
				<div className="prad-w-full prad-mt-12">
					<label
						htmlFor={ `file_number_label` }
						className="prad-field-title"
					>
						{ __( 'File Number Prefix Text', 'product-addons' ) }
					</label>
					<input
						className="prad-input prad-bc-border-primary prad-w-full"
						type="text"
						placeholder="Maximum Number of Files: [max_files]"
						id={ `file_number_label` }
						onChange={ ( v ) =>
							toolbarSetData( 'numberPrefix', v.target.value )
						}
						value={ settings.numberPrefix }
					/>
				</div>
			</div>
			<div className="prad-w-full prad-mb-24 prad-border-top-default prad-pt-20">
				<label
					htmlFor={ `file_type_label` }
					className="prad-field-title"
				>
					{ __( 'Allowed File Types', 'product-addons' ) }
				</label>
				<div className="prad-relative">
					<div
						className={ `prad-multi-selection-wrapper prad-${
							isOpen ? 'active' : 'inactive'
						}` }
						onClick={ () => setIsOpen( ! isOpen ) }
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								setIsOpen( ! isOpen );
							}
						} }
					>
						<div className="prad-w-full prad-multi-selection-container">
							{ selectedFileTypes?.map( ( fileType, index ) => (
								<div
									key={ `${ fileType }_${ index }` }
									className="prad-multi-selection-item"
								>
									{ fileType }
									<Button
										onlyIcon={ true }
										iconName="cross"
										padding="4px 0 0"
										className="prad-hover-color-negative"
										color="active"
										onClick={ ( e ) => {
											e.stopPropagation();
											handleSelection( fileType );
										} }
									/>
								</div>
							) ) }
						</div>
						<div className="prad-lh-0 prad-multi-selection-icon">
							{ Icons.angleDown }
						</div>
					</div>
					{ isOpen && (
						<div
							className="prad-multi-selection-options prad-select-dropdown prad-upper-4 prad-overflow-y-auto prad-overflow-x-hidden prad-scrollbar"
							style={ { maxHeight: '20vh' } }
						>
							{ allFileTypes.map( ( fileType, index ) => (
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
												selectedFileTypes.indexOf(
													fileType
												) > -1
											}
											onChange={ () => {
												handleSelection( fileType );
											} }
										/>
										<div className="prad-font-12 prad-ellipsis prad-multi-selection-name prad-select-option prad-cursor-pointer prad-relative">
											{ fileType }
										</div>
									</label>
								</div>
							) ) }
						</div>
					) }
				</div>
			</div>
			<div className="prad-w-full prad-mt-12">
				<label
					htmlFor={ `allowedPrefix_label` }
					className="prad-field-title"
				>
					{ __( 'Allowed Type Prefix Text', 'product-addons' ) }
				</label>
				<input
					className="prad-input prad-bc-border-primary prad-w-full"
					type="text"
					placeholder="Allowed Types are: [allowed_types]"
					id={ `allowedPrefix_label` }
					onChange={ ( v ) =>
						toolbarSetData( 'allowedPrefix', v.target.value )
					}
					value={ settings.allowedPrefix }
				/>
			</div>
		</>
	);
};

export default UploadSettings;
