const { __ } = wp.i18n;
import { generateUID } from '../../../../../../utils/Utils';
import FieldOptions from '../../../../common/FieldOptions';
import FieldToggle from '../../../../common/FieldToggle';
import {
	FieldHelpText,
	FieldTitle,
	MinMaxSelectRestrictions,
	MinMaxQuantityRestrictions,
} from '../common_compo/generalCommon';

const MultiSwitcher = ( props ) => {
	const { type, settings, toolbarSetData } = props;

	const setNew = () => {
		const _options = [
			...( settings._options ?? [] ),
			{
				value: 'New Option',
				type: 'fixed',
				regular: '12',
				sale: '',
				...( type === 'color_switch' && { color: '#fff000' } ),
				uid: generateUID(),
			},
		];
		toolbarSetData( '_options', _options );
	};

	const setDelete = ( position ) => {
		const _options = [ ...( settings._options ?? [] ) ];
		_options.splice( position, 1 );
		toolbarSetData( '_options', _options );
	};

	const setOption = ( i, fieldType, val ) => {
		const _options = [ ...( settings._options ?? [] ) ];
		const updatedFields =
			typeof fieldType === 'object' ? fieldType : { [ fieldType ]: val };
		_options.splice(
			i,
			1,
			Object.assign( {}, _options.length > 0 ? _options[ i ] : [], {
				...updatedFields,
			} )
		);
		toolbarSetData( '_options', _options );
	};

	const handleImage = ( pos ) => {
		const ultpCustomFont = wp?.media( {
			title: 'Add Image',
			button: { text: 'Add Image' },
			multiple: false,
			library: {
				type: 'image',
			},
			mimeTypes: [ 'image/jpeg', 'image/png' ],
		} );

		ultpCustomFont.on( 'select', function () {
			const attachment = ultpCustomFont
				.state()
				.get( 'selection' )
				.first()
				.toJSON();
			setOption( pos, { img: attachment.url, imgid: attachment.id } );
		} );

		ultpCustomFont.open();
	};

	const handleDrop = ( index, draggedIndex ) => {
		if ( draggedIndex !== index ) {
			const newOptions = [ ...( settings._options ?? [] ) ];
			const movedItem = newOptions.splice( draggedIndex, 1 )[ 0 ];
			newOptions.splice( index, 0, movedItem );

			toolbarSetData( '_options', newOptions );
		}
	};

	const priceTypes = [
		{ val: 'fixed', label: 'Fixed' },
		{ val: 'percentage', label: 'Percentage' },
		{ val: 'per_unit', label: 'Per Unit', isPro: true },
		{ val: 'no_cost', label: 'No Cost' },
	];

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
				hasMultiple={ true }
				options={ settings._options }
				priceTypes={ priceTypes }
				setOption={ setOption }
				setDelete={ setDelete }
				setNew={ setNew }
				hasLabel={ true }
				type={ type }
				isSwatches={ true }
				onDrop={ handleDrop }
				handleImage={ handleImage }
				defVal={ settings.defval || [] }
				setDefault={ ( val ) => toolbarSetData( 'defval', val ) }
				multiChoice={ settings.multiple }
			/>
			{ type === 'img_switch' &&
				Object.prototype.hasOwnProperty.call(
					settings,
					'updateProductImage'
				) && (
					<div className="prad-w-full">
						<FieldToggle
							fieldKey={ 'updateProductImage' }
							checked={ settings.updateProductImage }
							label={ 'Update product image on selection ' }
							handleChange={ ( value ) => {
								toolbarSetData( 'updateProductImage', value );
							} }
						/>
					</div>
				) }
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
			{ settings.enableCount && (
				<MinMaxQuantityRestrictions
					settings={ settings }
					toolbarSetData={ toolbarSetData }
				/>
			) }
			<FieldToggle
				fieldKey={ 'multiple' }
				checked={ settings.multiple }
				label={ 'Allow Multiple' }
				handleChange={ ( value ) => {
					toolbarSetData( 'multiple', value );
				} }
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

export default MultiSwitcher;
