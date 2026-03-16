const { __ } = wp.i18n;
import ButtonGroup from '../../../../../../components/button_group';
import FieldToggle from '../../../../common/FieldToggle';

const ShortcodeSettings = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<FieldToggle
				fieldKey={ 'hide' }
				checked={ settings.hide }
				label={ __( 'Hide Title', 'product-addons' ) }
				handleChange={ ( value ) => toolbarSetData( 'hide', value ) }
			/>

			<div className="prad-d-flex prad-gap-12">
				<div className="prad-field-title-wrapper prad-w-full">
					<label
						htmlFor="shortcode-label"
						className="prad-field-title"
					>
						{ __( 'Title', 'product-addons' ) }
					</label>
					<input
						className="prad-input prad-bc-border-primary prad-w-full"
						type="text"
						id="shortcode-label"
						onChange={ ( v ) =>
							toolbarSetData( 'label', v.target.value )
						}
						value={ settings.label }
					/>
				</div>
				<div className="prad-field-title-wrapper prad-w-full">
					<label
						htmlFor="shortcode-value"
						className="prad-field-title"
					>
						{ __( 'Shortcode', 'product-addons' ) }
					</label>
					<input
						className="prad-input prad-bc-border-primary prad-w-full"
						type="text"
						id="shortcode-value"
						placeholder='eg: [shortcode_example id="1100"]'
						value={ settings.value }
						onChange={ ( e ) =>
							toolbarSetData( 'value', e.target.value )
						}
					/>
				</div>
			</div>
			<ButtonGroup
				classes="prad-w-half"
				title={ __( 'Width' ) }
				value={ settings.blockWidth || '_100' }
				options={ [
					{ label: '33%', value: '_33' },
					{ label: '50%', value: '_50' },
					{ label: '66%', value: '_66' },
					{ label: '100%', value: '_100' },
				] }
				onChange={ ( value ) => toolbarSetData( 'blockWidth', value ) }
			/>
		</div>
	);
};

export default ShortcodeSettings;
