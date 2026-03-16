import FieldToggle from '../../../../common/FieldToggle';
import ProductsAdd from './ProductsAdd';
import {
	FieldHelpText,
	FieldTitle,
	MinMaxSelectRestrictions,
	MinMaxQuantityRestrictions
} from '../common_compo/generalCommon';
const { __ } = wp.i18n;

const ProductsSettings = ( props ) => {
	const { type, settings, toolbarSetData } = props;

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
			<ProductsAdd
				settings={ settings }
				toolbarSetData={ toolbarSetData }
				type={ type }
			/>
			<FieldToggle
				fieldKey={ 'mergeVariation' }
				checked={ settings.mergeVariation || false }
				label={ __(
					'Merge Variation Products into one product',
					'product-addons'
				) }
				handleChange={ ( value ) =>
					toolbarSetData( 'mergeVariation', value )
				}
			/>
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
			{ settings.blockType === '_swatches' && (
				<FieldToggle
					fieldKey={ 'multiple' }
					checked={ settings.multiple }
					label={ 'Allow Multiple' }
					handleChange={ ( value ) => {
						toolbarSetData( 'multiple', value );
					} }
				/>
			) }
			{ ( settings.blockType === '_checkbox' ||
				( settings.blockType === '_swatches' &&
					settings.multiple ) ) && (
				<FieldToggle
					fieldKey={ 'enableMinMaxRes' }
					checked={ settings.enableMinMaxRes }
					label={ 'Min Max Restriction' }
					handleChange={ ( value ) =>
						toolbarSetData( 'enableMinMaxRes', value )
					}
				/>
			) }
			{ settings.enableMinMaxRes &&
				( settings.blockType === '_checkbox' ||
					( settings.blockType === '_swatches' &&
						settings.multiple ) ) && (
					<MinMaxSelectRestrictions
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				) }
		</div>
	);
};

export default ProductsSettings;
