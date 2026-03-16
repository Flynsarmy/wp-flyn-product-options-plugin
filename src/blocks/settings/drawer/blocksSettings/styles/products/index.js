import ButtonGroup from '../../../../../../components/button_group';
import Select from '../../../../../../components/Select';
import SelectiveStyle from '../SelectiveStyle';
import SwatchesStyle from '../swatches/SwatchesStyle';
const { __ } = wp.i18n;

const ProductsStyles = ( props ) => {
	const { settings, toolbarSetData, type } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-gap-12">
				<ButtonGroup
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
				<div className="prad-btn-group-field prad-w-full">
					<div className="prad-btn-group-field">
						{ __( 'Block Type', 'product-addons' ) }
					</div>
					<Select
						options={ [
							{ value: '_swatches', label: 'Swatches' },
							{ value: '_radios', label: 'Radio' },
							{ value: '_checkbox', label: 'Checkbox' },
						] }
						onChange={ ( val ) => {
							toolbarSetData( 'blockType', val.value );
						} }
						width="100%"
						selectedOption={ settings.blockType || '_swatches' }
						valueClass="prad-ellipsis"
						className="prad-mt-8"
					/>
				</div>
			</div>
			<div className="prad-d-flex prad-gap-12 prad-w-half">
				<ButtonGroup
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
			<div className="prad-d-flex prad-gap-12">
				{ settings.blockType === '_swatches' && (
					<SwatchesStyle
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						type={ type }
					/>
				) }
				{ settings.blockType !== '_swatches' && (
					<SelectiveStyle
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						type={ type }
					/>
				) }
			</div>
		</div>
	);
};

export default ProductsStyles;
