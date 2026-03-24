const { __ } = wp.i18n;
import { generateUID } from '../../../../../../utils/Utils';
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import {
	FieldHelpText,
	FieldTitle,
	MinMaxQuantityRestrictions,
} from '../common_compo/generalCommon';

const RadioSettings = ( props ) => {
	const { type, settings, toolbarSetData, _singleSwitch } = props;

	const handleImage = ( pos, action ) => {
		if ( action === 'remove' ) {
			setOption( pos, 'img', '' );
			return;
		}
		const pradImage = wp?.media( {
			title: 'Add Image',
			button: { text: 'Add Image' },
			multiple: false,
			library: {
				type: 'image',
			},
			mimeTypes: [ 'image/jpeg', 'image/png' ],
		} );

		pradImage.on( 'select', function () {
			const attachment = pradImage
				.state()
				.get( 'selection' )
				.first()
				.toJSON();
			setOption( pos, 'img', attachment.url );
		} );

		pradImage.open();
	};

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
		...( [ 'radio', 'checkbox', 'switch' ].includes( type )
			? [ { val: 'per_unit', label: 'Per Unit', isPro: true } ]
			: [] ),
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
				hasImg={ type !== 'button' }
				handleImage={ handleImage }
			/>
			{ settings.columns == 1 && (
				<div className="prad-relative">
					<FieldToggle
						fieldKey={ 'enableCount' }
						checked={ settings.enableCount }
						label={ 'Quantity' }
						handleChange={ ( value ) =>
							toolbarSetData( 'enableCount', value )
						}
					/>
				</div>
			) }
			{ settings.enableCount && (
				<MinMaxQuantityRestrictions
					settings={ settings }
					toolbarSetData={ toolbarSetData }
				/>
			) }
		</div>
	);
};

export default RadioSettings;
