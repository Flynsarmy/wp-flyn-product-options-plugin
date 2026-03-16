import ColorPicker from '../../../../../../components/ColorPicker';
import Select from '../../../../../../components/Select';
import icons from '../../../../../../utils/Icons';
import FieldNumber from '../../../../common/FieldNumber';
const { __ } = wp.i18n;

const SwatchesStyle = ( { settings, toolbarSetData } ) => {
	const style = settings._styles || {};
	const layout = settings.layout || '';

	const handleStyleChanges = ( key, value ) => {
		const cloneStyle = { ...style, [ key ]: value };
		toolbarSetData( '_styles', cloneStyle );
	};
	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div>
				<div className="prad-field-title">
					{ __( 'Image Styles', 'product-addons' ) }
				</div>
				<div className="prad-d-flex prad-gap-12 prad-overflow-auto">
					{ [
						{ key: '_default', label: 'Default' },
						{ key: '_overlay', label: 'Overlay' },
						{
							key: '_img',
							label:
								settings.type === 'color_switch'
									? 'Only Color'
									: 'Only Image',
						},
					].map( ( item, index ) => (
						<div
							key={ index }
							className=""
							title={ item.label }
							style={ {
								borderRadius: '4px',
								cursor: 'pointer',
								border:
									layout === item.key
										? '2px solid #86a62c'
										: '2px solid rgb(207, 207, 207)',
							} }
							onClick={ () => {
								toolbarSetData( 'layout', item.key );
							} }
						>
							{ icons[ item.key ] }
						</div>
					) ) }
				</div>
			</div>

			<div className="prad-d-flex prad-gap-12 prad-justify-between">
				<FieldNumber
					label={ __( 'Height', 'product-addons' ) }
					fieldKey={ 'height' }
					value={ style.height?.val }
					handleChange={ ( value ) =>
						handleStyleChanges( 'height', {
							val: value,
							unit: style.height?.unit || 'px',
						} )
					}
					disabled={ false }
					unit={ style.height?.unit || 'px' }
					min="0"
				/>
				<FieldNumber
					label={ __( 'Width', 'product-addons' ) }
					fieldKey={ 'width' }
					value={ style.width?.val }
					handleChange={ ( value ) =>
						handleStyleChanges( 'width', {
							val: value,
							unit: style.width?.unit || 'px',
						} )
					}
					disabled={ false }
					unit={ style.width?.unit || 'px' }
					min="0"
				/>
				<FieldNumber
					label={ __( 'Border Radius', 'product-addons' ) }
					fieldKey={ 'radius' }
					value={ style.radius?.val }
					handleChange={ ( value ) =>
						handleStyleChanges( 'radius', {
							val: value,
							unit: style.radius?.unit || 'px',
						} )
					}
					disabled={ false }
					unit={ style.radius?.unit || 'px' }
					min="0"
				/>
			</div>
			{ layout === '_overlay' && (
				<div>
					<div className="prad-mb-16">
						<div className="prad-mb-8">
							{ __( 'Visibility', 'product-addons' ) }
						</div>
						<Select
							options={ [
								{
									value: 'always_show',
									label: __( 'Always', 'product-addons' ),
								},
								{
									value: 'hover_show',
									label: __(
										'Show on Hover',
										'product-addons'
									),
								},
								{
									value: 'hover_hide',
									label: __(
										'Hide on Hover',
										'product-addons'
									),
								},
							] }
							onChange={ ( val ) => {
								toolbarSetData( 'layoutVisibility', val.value );
							} }
							width="100%"
							selectedOption={
								settings.layoutVisibility || 'always_show'
							}
							valueClass="prad-ellipsis"
						/>
					</div>
					<div className="prad-d-flex prad-gap-16 prad-flex-column">
						<div className="prad-d-flex prad-gap-20">
							<div>
								{ __( 'Overlay Color', 'product-addons' ) }
							</div>
							<ColorPicker
								initialColor={ style._ovr_color }
								onChange={ ( color ) =>
									handleStyleChanges( '_ovr_color', color )
								}
							/>
						</div>
						<div className="prad-d-flex prad-gap-20">
							<div>
								{ __( 'Overlay Background', 'product-addons' ) }
							</div>
							<ColorPicker
								initialColor={ style._ovr_bg }
								onChange={ ( color ) =>
									handleStyleChanges( '_ovr_bg', color )
								}
							/>
						</div>
					</div>
				</div>
			) }
		</div>
	);
};

export default SwatchesStyle;
