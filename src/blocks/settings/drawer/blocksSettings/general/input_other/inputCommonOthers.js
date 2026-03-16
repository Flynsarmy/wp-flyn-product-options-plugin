import ButtonGroup from '../../../../../../components/button_group';
import ColorPicker from '../../../../../../components/ColorPicker';
import FieldNumber from '../../../../common/FieldNumber';
import FieldToggle from '../../../../common/FieldToggle';
const { __ } = wp.i18n;

const RenderFieldSetting = ( props ) => {
	const { settings } = props;

	switch ( settings.type ) {
		case 'textfield':
			return <TextFieldSetting { ...props } />;
		case 'email':
		case 'url':
			return <PlaceholderSetting { ...props } />;
		case 'telephone':
			return <TelephoneSetting { ...props } />;
		case 'range':
			return <RangeSetting { ...props } />;
		case 'number':
			return <NumberSetting { ...props } />;
		case 'textarea':
			return <TextAreaSetting { ...props } />;
		case 'color_picker':
			return <ColorSetting { ...props } />;
	}
};

const TextFieldSetting = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-item-center prad-gap-12">
				<FieldNumber
					label={ __( 'Minimum Character', 'product-addons' ) }
					fieldKey={ 'minChar' }
					value={ settings.minChar }
					handleChange={ ( val ) => toolbarSetData( 'minChar', val ) }
					min={ 0 }
				/>
				<FieldNumber
					label={ __( 'Maximum Character', 'product-addons' ) }
					fieldKey={ 'maxChar' }
					value={ settings.maxChar }
					handleChange={ ( val ) => toolbarSetData( 'maxChar', val ) }
					min={ 0 }
				/>
			</div>
			<PlaceholderSetting { ...props } />
		</div>
	);
};

const TelephoneSetting = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<ButtonGroup
				title={ __( 'Flag Style' ) }
				value={
					settings.flagStyle
						? settings.flagStyle
						: settings.showFlag
						? 'number_flag_code'
						: 'number_only'
				}
				options={ [
					{ label: 'Number Only', value: 'number_only' },
					{ label: 'Number & Flag', value: 'number_flag' },
					{
						label: 'Number & Flag & Dial Code',
						value: 'number_flag_code',
					},
				] }
				onChange={ ( value ) => toolbarSetData( 'flagStyle', value ) }
			/>
			<PlaceholderSetting { ...props } />
		</div>
	);
};

const RangeSetting = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-flex-column prad-gap-20">
				<FieldToggle
					fieldKey={ 'enablePostfix' }
					checked={ settings.enablePostfix || '' }
					label={ __( 'Enable PostFix', 'product-addons' ) }
					handleChange={ ( value ) =>
						toolbarSetData( 'enablePostfix', value )
					}
				/>
				{ settings.enablePostfix && (
					<div className="prad-w-full">
						<div className="prad-field-title">
							{ __( 'PostFix Text', 'product-addons' ) }
						</div>
						<input
							className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
							type="text"
							onChange={ ( e ) =>
								toolbarSetData( 'postFixText', e.target.value )
							}
							maxLength={ 10 }
							value={ settings.postFixText || '' }
						/>
					</div>
				) }
			</div>
			<div className="prad-d-flex prad-gap-12">
				<FieldNumber
					label={ 'Default Value' }
					fieldKey={ 'value' }
					value={ settings.value }
					handleChange={ ( val ) => toolbarSetData( 'value', val ) }
					min={ 0 }
				/>
				<FieldNumber
					label={ __( 'Steps', 'product-addons' ) }
					fieldKey={ 'step' }
					value={ settings.step }
					handleChange={ ( value ) =>
						toolbarSetData( 'step', value )
					}
					min={ 0 }
				/>
			</div>
			<div className="prad-d-flex prad-gap-12">
				<FieldNumber
					label={ __( 'Minimum Value', 'product-addons' ) }
					fieldKey={ 'min' }
					value={ settings.min }
					handleChange={ ( val ) => toolbarSetData( 'min', val ) }
					min={ 0 }
				/>
				<FieldNumber
					label={ __( 'Maximum Value', 'product-addons' ) }
					fieldKey={ 'max' }
					value={ settings.max }
					handleChange={ ( val ) => toolbarSetData( 'max', val ) }
					min={ 0 }
				/>
			</div>
		</div>
	);
};

const NumberSetting = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<FieldToggle
				fieldKey={ 'enableMinMaxRes' }
				checked={ settings.enableMinMaxRes }
				label={ __( 'Enable Min/Max Restriction', 'product-addons' ) }
				handleChange={ ( value ) =>
					toolbarSetData( 'enableMinMaxRes', value )
				}
			/>
			{ settings.enableMinMaxRes && (
				<div className="prad-d-flex prad-item-center prad-gap-12">
					<FieldNumber
						label={ __( 'Minimum Value', 'product-addons' ) }
						fieldKey={ 'min' }
						value={ settings.min }
						handleChange={ ( val ) => toolbarSetData( 'min', val ) }
						min={ 0 }
					/>
					<FieldNumber
						label={ __( 'Maximum Value', 'product-addons' ) }
						fieldKey={ 'max' }
						value={ settings.max }
						handleChange={ ( val ) => toolbarSetData( 'max', val ) }
						min={ 0 }
					/>
				</div>
			) }
			<div className="prad-d-flex prad-gap-12">
				<FieldNumber
					label={ 'Default Value' }
					fieldKey={ 'value' }
					value={ settings.value }
					handleChange={ ( val ) => toolbarSetData( 'value', val ) }
					min={ 0 }
				/>
				<FieldNumber
					label={ __( 'Steps', 'product-addons' ) }
					fieldKey={ 'step' }
					value={ settings.step }
					handleChange={ ( value ) =>
						toolbarSetData( 'step', value )
					}
					min={ 0 }
				/>
			</div>
			<PlaceholderSetting { ...props } />
		</div>
	);
};

const TextAreaSetting = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-item-center prad-gap-12">
				<FieldNumber
					label={ __( 'Minimum Character', 'product-addons' ) }
					fieldKey={ 'min' }
					value={ settings.min }
					handleChange={ ( val ) => toolbarSetData( 'min', val ) }
					min={ 0 }
				/>
				<FieldNumber
					label={ __( 'Maximum Character', 'product-addons' ) }
					fieldKey={ 'max' }
					value={ settings.max }
					handleChange={ ( val ) => toolbarSetData( 'max', val ) }
					min={ 0 }
				/>
			</div>
			<div className="prad-d-flex prad-item-center prad-gap-12">
				<PlaceholderSetting { ...props } />
				<FieldNumber
					label={ __( 'Row', 'product-addons' ) }
					fieldKey={ 'step' }
					value={ settings.step }
					handleChange={ ( value ) =>
						toolbarSetData( 'step', value )
					}
					min={ 0 }
				/>
			</div>
		</div>
	);
};

const ColorSetting = ( props ) => {
	const { settings, toolbarSetData } = props;

	const rgbaToHex = ( rgba ) => {
		const [ r, g, b, a ] = rgba
			.replace( /^rgba?\(|\s+|\)$/g, '' )
			.split( ',' )
			.map( Number );
		const hex = ( x ) => x.toString( 16 ).padStart( 2, '0' );
		if ( a === 1 ) {
			return `#${ hex( r ) }${ hex( g ) }${ hex( b ) }`;
		}
		return `#${ hex( r ) }${ hex( g ) }${ hex( b ) }${ hex(
			Math.round( a * 255 )
		) }`;
	};

	return (
		<div className="prad-w-full">
			<div className="prad-field-title">
				{ __( 'Default Value', 'product-addons' ) }
			</div>
			<div className="prad-p-2 prad-plr-12 prad-border-default prad-d-flex prad-item-center prad-gap-2 prad-w-full">
				<ColorPicker
					initialColor={ settings.defaultColor }
					isSwatches={ true }
					onChange={ ( newColor ) => {
						toolbarSetData( 'defaultColor', newColor );
					} }
					style={ {
						width: '54px',
						height: '34px',
					} }
					triggerClass="prad-p-2 prad-br-smd"
					selectedColorClass="prad-br-sm"
				/>
				<div className="prad-w-full">
					<input
						type="text"
						className="prad-input prad-border-none"
						value={
							settings.defaultColor.startsWith( 'rgba' )
								? rgbaToHex( settings.defaultColor )
								: settings.defaultColor
						}
						onChange={ ( e ) => {
							toolbarSetData( 'defaultColor', e.target.value );
						} }
					/>
				</div>
			</div>
		</div>
	);
};

const PlaceholderSetting = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-w-full">
			<div className="prad-field-title">
				{ __( 'Placeholder', 'product-addons' ) }
			</div>
			<input
				className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
				type="text"
				onChange={ ( e ) =>
					toolbarSetData( 'placeholder', e.target.value )
				}
				value={ settings.placeholder }
			/>
		</div>
	);
};

export { RenderFieldSetting };
