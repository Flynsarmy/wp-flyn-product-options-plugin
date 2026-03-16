import { generateCss } from '../../helper/cssGenerator';

export const generateBlockCss = ( params ) => {
	const { settings } = params;
	const generalcss = generateCss( {
		_style: settings._styles,
		selectorData: [
			...( settings.blockType === '_swatches'
				? [
						{
							selector:
								'{{PRAD}}.prad-type_swatches-input img.prad-swatch-item',
							include: [ 'width', 'height', 'radius' ],
						},
						{
							selector:
								'{{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-content-wrapper',
							include: [ '_ovr_bg' ],
						},
						{
							selector:
								'{{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-content, {{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price,{{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price span,{{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price span span,{{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price span span span, {{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price span.woocommerce-Price-amount, {{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol, {{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol span',
							include: [ '_ovr_color' ],
						},
				  ]
				: [] ),
		],
		blockid: settings.blockid,
		returType: '',
	} );

	return generalcss + generateCustomCss( params );
};

const generateCustomCss = ( params ) => {
	const { settings, globalStyles } = params;

	const { blockType } = settings;
	let customCss = '';

	if ( blockType === '_swatches' ) {
		const _height =
			settings._styles?.height?.val ||
			globalStyles?.field_comp?.swatches?.settings.height?.val;
		const _width =
			settings._styles?.width?.val ||
			globalStyles?.field_comp?.swatches?.settings.width?.val;
		const _borderStyle =
			globalStyles?.field_comp?.swatches?.settings.border;

		customCss +=
			Number( _height ) < 36 || Number( _width ) < 36
				? `.prad-type_swatches-input.prad-block-${ settings.blockid } .prad-swatch-mark-image { display: none !important; }`
				: '';

		customCss +=
			settings._styles?.radius?.val !== null &&
			settings._styles?.radius?.val !== '' &&
			Number( settings._styles?.radius?.val ) >= 0
				? `
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input .prad-swatch-container {
						border-radius: ${ settings._styles?.radius?.val || '0' }${
							settings._styles?.radius?.unit || 'px'
						} !important;
					}
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input .prad-swatch-mark-image {
						right: calc(${
							Number( _borderStyle?.val ) < 0
								? '0'
								: _borderStyle?.val || '0'
						}${ _borderStyle?.unit || 'px' } + ${
							Number( settings._styles?.radius?.val / 3 ) < 1
								? '0'
								: Math.min(
										Number(
											settings._styles?.radius?.val / 3
										),
										10
								  )
						}${ _borderStyle?.unit || 'px' });
						top: calc(${
							Number( _borderStyle?.val ) < 0
								? '0'
								: _borderStyle?.val || '0'
						}${ _borderStyle?.unit || 'px' } + ${
							Number( settings._styles?.radius?.val / 3 ) < 1
								? '0'
								: Math.min(
										Number(
											settings._styles?.radius?.val / 3
										),
										10
								  )
						}${ _borderStyle?.unit || 'px' });
					}
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-content-wrapper {
						border-radius: 0px 0px ${
							Number(
								settings._styles?.radius?.val -
									_borderStyle?.val
							) < 0
								? '0'
								: Number(
										settings._styles?.radius?.val -
											_borderStyle?.val
								  )
						}${ settings._styles?.radius?.unit || 'px' } ${
							Number(
								settings._styles?.radius?.val -
									_borderStyle?.val
							) < 0
								? '0'
								: Number(
										settings._styles?.radius?.val -
											_borderStyle?.val
								  )
						}${ settings._styles?.radius?.unit || 'px' } !important;
					}
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input.prad-swatch-layout_overlay input[type=number].prad-quantity-input.prad-block-input {
						width: calc( 100% - ${
							settings._styles?.radius?.val < 0
								? '0'
								: settings._styles?.radius?.val || '0'
						}% ) !important;
						min-width: 60px;
					}
				`
				: '';
		customCss +=
			( settings._styles?.width?.val !== null &&
			settings._styles?.width?.val !== '' &&
			Number( settings._styles?.width?.val ) >= 0
				? `.prad-block-${ settings.blockid } .prad-swatch-wrapper {
						grid-template-columns: repeat(auto-fit, minmax( 56px, ${
							settings._styles?.width?.val
						}${ settings._styles?.width?.unit } )) !important;
					}
					.prad-block-${ settings.blockid }.prad-swatch-layout_img .prad-swatch-wrapper {
						grid-template-columns: repeat(auto-fit, ${ settings._styles?.width?.val }${
							settings._styles?.width?.unit
						} ) !important;
					}
					.prad-block-${
						settings.blockid
					}.prad-swatch-layout_img .prad-swatch-wrapper:has(.prad-quantity-input) {
						grid-template-columns: repeat(auto-fit, minmax( 56px, ${
							settings._styles?.width?.val
						}${ settings._styles?.width?.unit } )) !important;
						gap: 2px !important;
					}
					.prad-parent.prad-block-${
						settings.blockid
					}.prad-swatch-layout_img .prad-swatch-wrapper:has(.prad-quantity-input) {
						gap: 10px !important;
					}
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input img.prad-swatch-item {
					max-width: ${ settings._styles?.width?.val }${
						settings._styles?.width?.unit
					} !important;
				}
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input .prad-swatch-container .prad-block-input, .prad-block-${
						settings.blockid
					}.prad-type_swatches-input input:is([type=url],[type=tel],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input {
						min-width: ${ settings._styles?.width?.val }${
							settings._styles?.width?.unit
						} !important;
					}
					.prad-block-${
						settings.blockid
					}.prad-type_swatches-input .prad-swatch-container {
						margin-right: auto;
						margin-left: ${
							Number( settings._styles?.width?.val ) < 56
								? 'auto'
								: '-5px'
						} !important;
					}
					.prad-parent.prad-block-${
						settings.blockid
					}.prad-type_swatches-input .prad-swatch-container {
						margin-left: ${
							Number( settings._styles?.width?.val ) < 56
								? 'auto'
								: '-2px'
						} !important;
					}
				`
				: '' ) +
			`
					.prad-block-${ settings.blockid }.prad-block-img-swatches.prad-swatch-layout_overlay input[type=number].prad-quantity-input.prad-block-input {
						color: ${ settings._styles?._ovr_color } !important;
						border-color: ${ settings._styles?._ovr_color } !important;
						background-color: transparent !important;
					}
				`;
	}

	return customCss;
};
