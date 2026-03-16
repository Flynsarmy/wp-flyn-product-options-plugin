import ButtonGroup from '../../../../../../components/button_group';

const { __ } = wp.i18n;

const DividerSettings = ( props ) => {
	const {
		settings: { height, type, blockWidth },
		toolbarSetData,
	} = props;
	const MAX = type === 'spacer' ? 300 : 100;
	const getBackgroundSize = ( area ) => {
		return { backgroundSize: `${ ( area * 100 ) / MAX }% 100%` };
	};

	return (
		<div className="prad-d-flex prad-gap-16 prad-flex-column">
			<div className="prad-d-flex prad-mt-10 prad-flex-column prad-relative">
				<div className="prad-field-title" htmlFor="height">
					{ __( 'Height', 'product-addons' ) } ({ height.unit })
				</div>
				<div className="prad-d-flex prad-gap-12 prad-item-center prad-w-full">
					<input
						className="prad-input prad-w-full prad-range"
						type="range"
						id="height"
						min="1"
						max={ MAX }
						style={ getBackgroundSize( height.val ) }
						value={ height.val }
						onChange={ ( e ) =>
							toolbarSetData( 'height', {
								val: e.target.value,
								unit: height.unit,
							} )
						}
					/>
					<input
						className="prad-input prad-w-20 prad-bc-border-primary"
						type="number"
						min="1"
						max={ MAX }
						value={ height.val }
						onChange={ ( e ) =>
							toolbarSetData( 'height', {
								val: e.target.value,
								unit: height.unit,
							} )
						}
					/>
				</div>
			</div>
			<div className="prad-w-half">
				<ButtonGroup
					title={ __( 'Width' ) }
					value={ blockWidth || '_100' }
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
		</div>
	);
};

export default DividerSettings;
