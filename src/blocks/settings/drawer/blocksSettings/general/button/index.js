const { __ } = wp.i18n;
import { generateUID } from '../../../../../../utils/Utils';
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import {
	FieldHelpText,
	FieldTitle,
	MinMaxSelectRestrictions,
} from '../common_compo/generalCommon';

const ButtonSettings = ( props ) => {
	const { type, settings, toolbarSetData, _singleSwitch } = props;

	const setNew = ( insertAfterIndex = null ) => {
		const newOption = {
			value: '',
			type: 'fixed',
			regular: '',
			sale: '',
			uid: generateUID(),
		};
		const options = [ ...( settings._options ?? [] ) ];
		if ( insertAfterIndex !== null ) {
			options.splice( insertAfterIndex + 1, 0, newOption );
		} else {
			options.push( newOption );
		}
		toolbarSetData( '_options', options );
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
		{ val: 'fixed', label: 'Fixed' },
		{ val: 'percentage', label: 'Percentage' },
		{ val: 'no_cost', label: 'No Cost' },
	];

	const handleDrop = ( index, draggedIndex ) => {
		if ( draggedIndex !== index ) {
			const newOptions = [ ...( settings._options ?? [] ) ];
			const movedItem = newOptions.splice( draggedIndex, 1 )[ 0 ];
			newOptions.splice( index, 0, movedItem );

			toolbarSetData( '_options', newOptions );
		}
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
			<FieldOptions
				hasMultiple={ _singleSwitch ? false : true }
				options={ settings._options }
				priceTypes={ priceTypes }
				setOption={ setOption }
				setDelete={ setDelete }
				setNew={ setNew }
				hasLabel={ true }
				onDrop={ handleDrop }
				type={ type }
				defVal={ settings.defval || [] }
				setDefault={ ( val ) => toolbarSetData( 'defval', val ) }
				multiChoice={ settings.multiple }
			/>
			<FieldToggle
				fieldKey={ 'multiple' }
				checked={ settings.multiple }
				label={ 'Allow Multiple' }
				handleChange={ ( value ) =>
					toolbarSetData( 'multiple', value )
				}
			/>
			{ settings.multiple && (
				<FieldToggle
					fieldKey={ 'enableMinMaxRes' }
					checked={ settings.enableMinMaxRes }
					label={ 'Min Max Restriction' }
					handleChange={ ( value ) =>
						toolbarSetData( 'enableMinMaxRes', value )
					}
				/>
			) }
			{ settings.multiple && settings.enableMinMaxRes && (
				<MinMaxSelectRestrictions
					settings={ settings }
					toolbarSetData={ toolbarSetData }
				/>
			) }
		</div>
	);
};

export default ButtonSettings;
