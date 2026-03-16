const { __ } = wp.i18n;
const getOptionLabel = ( key ) => {
	const optionLabel = {
		paddingTB: __( 'Padding Top-Bottom', 'product-addons' ),
		paddingLR: __( 'Padding Left-Right', 'product-addons' ),
		border: __( 'Border Width', 'product-addons' ),
		radius: __( 'Border Radius', 'product-addons' ),
		height: __( 'Height', 'product-addons' ),
		width: __( 'Width', 'product-addons' ),
		size: __( 'Size', 'product-addons' ),
	};
	return optionLabel[ key ];
};

function CardFieldSettings( { options = {}, onChange, isDisable } ) {
	const handleInputChange = ( key, value ) => {
		const shallow = { ...options, [ key ]: value };
		onChange( 'settings', shallow );
	};

	return (
		<div className="prad-card prad-bg-base1">
			<div className="prad-card-body prad-d-flex prad-flex-column prad-gap-8">
				{ Object.keys( options ).map( ( key ) => {
					const optionValue = options[ key ];
					return (
						<div key={ key }>
							<div className="prad-font-12 prad-color-text-dark prad-mb-8">
								{ getOptionLabel( key ) }
							</div>
							<div className="prad-global-settings-item">
								<input
									id={ key }
									name={ key }
									type="number"
									min="0"
									value={ optionValue?.val }
									onChange={ ( e ) =>
										handleInputChange( key, {
											val: e.target.value,
											unit: 'px',
										} )
									}
									disabled={ isDisable ? true : false }
									className={ `prad-input` }
								/>
								<div className="prad-global-settings-unit">
									{ optionValue?.unit }
								</div>
							</div>
						</div>
					);
				} ) }
			</div>
		</div>
	);
}

export default CardFieldSettings;
