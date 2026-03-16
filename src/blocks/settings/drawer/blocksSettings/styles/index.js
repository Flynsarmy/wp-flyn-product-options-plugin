import { useAddons } from '../../../../../context/AddonsContext';
import { findBlockItem } from '../../../../../utils/Utils';
import ButtonStyles from './button';
import CheckboxStyles from './checkbox';
import DateTimeStyles from './datetime';
import InputCommonStyles from './input_common';
import PopUpContentStyles from './popup';
import ProductsStyles from './products';
import RadioStyles from './radios';
import SectionStyles from './section';
import SelectStyles from './select';
import MultiSwitcherStyles from './swatches';
import SwitchStyles from './switch';
import UploadStyles from './upload';
const { __ } = wp.i18n;

const BlockStyles = ( props ) => {
	const { toolbarSetData } = props;
	const { selectedBlock, fieldData } = useAddons();
	const currentBlock = findBlockItem( [ ...fieldData ], selectedBlock ) || {};
	const settings = currentBlock.block || {};

	const StylesRender = ( fieldType ) => {
		switch ( fieldType ) {
			case 'textfield':
			case 'email':
			case 'url':
			case 'telephone':
			case 'range':
			case 'number':
			case 'textarea':
			case 'color_picker':
				return (
					<InputCommonStyles
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'datetime':
				return (
					<DateTimeStyles
						fieldType={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);

			case 'radio':
				return (
					<RadioStyles
						fieldType={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'checkbox':
				return (
					<CheckboxStyles
						fieldType={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'select':
				return (
					<SelectStyles
						fieldType={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'button':
				return (
					<ButtonStyles
						fieldType={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'switch':
				return (
					<SwitchStyles
						fieldType={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'img_switch':
			case 'color_switch':
				return (
					<MultiSwitcherStyles
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);

			case 'section':
				return (
					<SectionStyles
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);

			case 'upload':
				return (
					<UploadStyles
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'products':
				return (
					<ProductsStyles
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'content':
			case 'popup':
			case 'font_picker':
				return (
					<PopUpContentStyles
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
		}
	};

	return (
		<div>
			{ StylesRender( currentBlock.type ) }
			<div className="prad-mt-20 prad-pb-24">
				<div className="prad-d-flex prad-item-center prad-gap-12">
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Element Class Name', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							onChange={ ( e ) =>
								toolbarSetData( 'class', e.target.value )
							}
							value={ settings.class }
						/>
					</div>
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'Element ID', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							value={ `prad-bid-${ settings.blockid }` }
							disabled
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlockStyles;
