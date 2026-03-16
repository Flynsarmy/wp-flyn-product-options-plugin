const { __ } = wp.i18n;
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import { FieldHelpText, FieldTitle } from '../common_compo/generalCommon';
import { RenderFieldSetting } from './inputCommonOthers';

const InputOtherSettings = ( props ) => {
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
	if ( settings.type === 'textarea' ) {
		priceTypes.push( { val: 'per_char', label: 'Per Character' } );
		priceTypes.push( {
			val: 'per_char_no_space',
			label: 'Per Character (No space)',
			isPro: true,
		} );
		priceTypes.push( { val: 'per_word', label: 'Per Word', isPro: true } );
	} else if ( settings.type === 'range' ) {
		priceTypes.push( { val: 'per_unit', label: 'Per Unit', isPro: true } );
	}

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-24">
			<div className="prad-d-flex prad-flex-wrap prad-item-center prad-gap-10 prad-mb-24">
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

			<RenderFieldSetting { ...props } />
		</div>
	);
};

export default InputOtherSettings;
