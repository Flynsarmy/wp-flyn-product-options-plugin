import RadioSettings from './radios';
import HeadingSettings from './heading';
import DividerSettings from './divider';
import ShortcodeSettings from './shortcode';
import MultiSwitcher from './swatches';
import SectionSettings from './section';
import UploadSettings from './upload';
import DateTimeSettings from './datetime';
import ProductsSettings from './products';
import CustomFormulaSettings from './formula';
import SwitchSettings from './switch';
import CheckboxSettings from './checkbox';
import SelectSettings from './select';
import ButtonSettings from './button';
import InputCommonSettings from './input_common';
import DateTimeSettingsExtended from './datetime/DateTimeSettingsExtended';
import ContentSettings from './content';
import FontPickerSettings from './font_picker';

const BlockGeneralSettings = ( props ) => {
	const { toolbarSetData, settings, currentBlock } = props;

	const FieldRender = ( fieldType ) => {
		switch ( fieldType ) {
			case 'textfield':
			case 'email':
			case 'number':
			case 'color_picker':
			case 'url':
			case 'telephone':
				return (
					<InputCommonSettings
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						type={ fieldType }
					/>
				);
			case 'range':
			case 'textarea':
				return (
					<InputCommonSettings
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						type={ fieldType }
					/>
				);
			case 'time':
			case 'date':
				return (
					<DateTimeSettings
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						type={ fieldType }
					/>
				);
			case 'datetime':
				return (
					<DateTimeSettingsExtended
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						type={ fieldType }
					/>
				);
			case 'shortcode':
				return (
					<ShortcodeSettings
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'radio':
				return (
					<RadioSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						_singleSwitch={ fieldType === 'switch' }
					/>
				);
			case 'button':
				return (
					<ButtonSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						_singleSwitch={ fieldType === 'switch' }
					/>
				);
			case 'select':
				return (
					<SelectSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						_singleSwitch={ fieldType === 'switch' }
					/>
				);
			case 'checkbox':
				return (
					<CheckboxSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						_singleSwitch={ fieldType === 'switch' }
					/>
				);
			case 'switch':
				return (
					<SwitchSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
						_singleSwitch={ fieldType === 'switch' }
					/>
				);

			case 'heading':
				return (
					<HeadingSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'spacer':
			case 'separator':
				return (
					<DividerSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'img_switch':
			case 'color_switch':
				return (
					<MultiSwitcher
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'section':
				return (
					<SectionSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'upload':
				return (
					<UploadSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'products':
				return (
					<ProductsSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'custom_formula':
				return (
					<CustomFormulaSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'content':
			case 'popup':
				return (
					<ContentSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
			case 'font_picker':
				return (
					<FontPickerSettings
						type={ fieldType }
						settings={ settings }
						toolbarSetData={ toolbarSetData }
					/>
				);
		}
	};

	return <>{ FieldRender( currentBlock.type ) }</>;
};

export default BlockGeneralSettings;
