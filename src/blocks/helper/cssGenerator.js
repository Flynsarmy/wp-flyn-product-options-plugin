const generateCss = ( data ) => {
	const returnCss = [];
	const { _style, selectorData, blockid, returType } = data;
	if ( ! _style ) {
		return;
	}
	selectorData.forEach( ( el ) => {
		const cssStyle =
			el?.include === 'all'
				? _style
				: Object.fromEntries(
						Object.entries( _style ).filter( ( [ key ] ) =>
							el.include.includes( key )
						)
				  );
		const css_ = _buildCss( cssStyle );
		returnCss.push(
			`${ el.selector.replace(
				new RegExp( '{{PRAD}}', 'g' ),
				'.prad-block-' + blockid
			) } { ${ css_.join( '' ) } }`
		);
	} );

	return returType === 'arr' ? returnCss : returnCss.join( ' ' );
};

const _buildCss = ( cssStyle ) => {
	const cssArr = [];
	Object.entries( cssStyle ).forEach( ( _sty ) => {
		let value;
		const [ type, property ] = _sty;
		switch ( type ) {
			case '_ovr_color': // string
			case 'color': // string
				value = property ? `color: ${ property };` : '';
				break;
			case '_ovr_bg': // string
			case 'bg': // string
				value = property ? `background: ${ property };` : '';
				break;
			case 'bgC': // string
				value = property ? `background-color: ${ property };` : '';
				break;
			case '_bold': // bool
				value = property ? `font-weight: 700;` : '';
				break;
			case '_italic': // bool
				value = property ? `font-style: italic;` : '';
				break;
			case '_underline': // bool
				value = property ? `text-decoration: underline;` : '';
				break;
			case '_size': // number/string
				value = property ? `font-size: ${ property }px;` : '';
				break;
			case '_height': // number/string
				value = property ? `line-height: ${ property };` : '';
				break;
			case '_case': // string
				value = property ? `text-transform: ${ property };` : '';
				break;
			case 'height': // object having val and unit
				value = property?.val
					? `height: ${
							property?.val + ( property?.unit || 'px' )
					  } !important;`
					: '';
				break;
			case 'width': // object having val and unit
				value = property?.val
					? `width: ${
							property?.val + ( property?.unit || 'px' )
					  }!important;`
					: '';
				break;
			case 'radius': // object having val and unit
				value = property?.val
					? `border-radius: ${
							property?.val + ( property?.unit || 'px' )
					  }!important;`
					: '';
				break;
			case 'fgap': // object having val and unit
				value = property?.val
					? `gap: ${ property?.val + ( property?.unit || 'px' ) };`
					: '';
				break;
			case 'mrL': // object having val and unit
				value = property?.val
					? `margin-left: ${
							property?.val + ( property?.unit || 'px' )
					  };`
					: '';
				break;
			case 'mrR': // object having val and unit
				value = property?.val
					? `margin-right: ${
							property?.val + ( property?.unit || 'px' )
					  };`
					: '';
				break;
		}
		cssArr.push( value );
	} );
	return cssArr;
};

const buildTypo = ( cssStyle ) => {
	const cssArr = [];
	Object.entries( cssStyle ).forEach( ( _sty ) => {
		let value;
		const [ type, property ] = _sty;
		switch ( type ) {
			case '_size':
				value = property?.val
					? `font-size: ${ property?.val }${
							property?.unit || 'px'
					  };`
					: '';
				break;
			case '_height':
				value = property?.val
					? `line-height: ${ property?.val }${
							property?.unit || 'px'
					  };`
					: '';
				break;
			case '_space':
				value = property?.val
					? `letter-spacing: ${ property?.val }${
							property?.unit || 'px'
					  };`
					: '';
				break;
			case '_weight':
				value = property ? `font-weight: ${ property };` : '';
				break;
			case '_decoration':
				value = property ? `text-decoration: ${ property };` : '';
				break;
			case '_style':
				value = property ? `font-style: ${ property };` : '';
				break;
			default:
				break;
		}
		cssArr.push( value );
	} );
	return cssArr.join( '' );
};

const buildColor = ( property ) => {
	return property ? `color: ${ property };` : '';
};
const buildBg = ( property ) => {
	return property ? `background-color: ${ property } !important;` : '';
};
const buildPadding = ( { paddingTB, paddingLR } ) => {
	const pT =
		paddingTB?.val === ''
			? ''
			: `${ paddingTB?.val || 0 }${ paddingTB?.unit || 'px' }`;
	const pL =
		paddingLR?.val === ''
			? ''
			: `${ paddingLR?.val || 0 }${ paddingLR?.unit || 'px' }`;
	return pT || pL
		? `padding: ${ pT || '0px' } ${ pL || '0px' } !important;`
		: '';
};
const buildBorder = ( { property, type, color } ) => {
	return property?.val
		? `border: ${ property?.val }${ property?.unit || 'px' } ${
				type || 'solid'
		  } ${ color || '' } !important;`
		: '';
};
const buildRadius = ( property ) => {
	return property?.val
		? `border-radius: ${ property?.val }${
				property?.unit || 'px'
		  } !important;`
		: '';
};

const buildHeight = ( property ) => {
	return property?.val
		? `height: ${ property?.val }${ property?.unit || 'px' } !important;`
		: '';
};
const buildWidth = ( property ) => {
	return property?.val
		? `width: ${ property?.val }${ property?.unit || 'px' };`
		: '';
};
const buildSize = ( property ) => {
	const _val = property?.val ? property?.val : '';
	return _val
		? `height: ${ _val }${ property?.unit || 'px' }; width: ${ _val }${
				property?.unit || 'px'
		  };`
		: '';
};

const generateGlobalCss = ( globalStyle ) => {
	const commonCss = [];
	const fieldCssArr = [];

	Object.entries( globalStyle.common ).forEach( ( commonStyle ) => {
		const [ commonName, property ] = commonStyle;
		const typo = buildTypo( property?.typo );
		const color = buildColor( property?.color );
		let selector = '';

		switch ( commonName ) {
			case 'heading':
				selector = '.prad-parent *.prad-block-heading';
				break;
			case 'title':
				selector = '.prad-block-title';
				break;
			case 'description':
				selector = '.prad-block-description';
				break;
			case 'content':
				selector =
					'.prad-block-content, .prad-dial-code-show, input:is([type=url],[type=tel],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input, textarea.prad-block-input, .prad-block-products.prad-swatch-layout_overlay .prad-select-box .prad-select-box-item';
				break;
			case 'placeHolder':
				selector =
					'input:is([type=url],[type=tel],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input::placeholder, textarea.prad-block-input::placeholder';
				break;
			case 'price':
				selector =
					'.prad-block-price, .prad-block-price span, .prad-block-price span span, .prad-block-price span span span, .prad-block-price span.woocommerce-Price-amount, .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol, .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol span';
				break;
			case 'sectionTitle':
				selector = '.prad-section-title .prad-block-title';
				break;
			default:
				break;
		}
		commonCss.push(
			`${ selector } { ${ typo + color } }`
				.replace( /\\n/g, '' )
				.replace( /\s+/g, ' ' )
				.trim()
		);
	} );

	/* Field CSS generator */
	Object.entries( globalStyle.field_comp ).forEach( ( fieldComp ) => {
		const [ name, property ] = fieldComp;
		let fieldCss = '';
		switch ( name ) {
			case 'section':
				fieldCss = `.prad-section-wrapper {
                            ${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color,
							} ) }
                            ${ buildRadius( property?.settings?.radius ) }
                            ${ buildBg( property?.bg_color ) }
                        }
                        .prad-block-border-top {
                            border-top: ${ property?.settings?.border?.val }${
								property?.settings?.border?.unit
							} solid ${ property?.border_color };
                        }
                        .prad-section-header, .prad-section-container {
                            ${ buildPadding( {
								paddingTB: property?.settings?.paddingTB,
								paddingLR: property?.settings?.paddingLR,
							} ) }
                        }
                    `;
				break;
			case 'input_field':
				// eslint-disable-next-line no-case-declarations
				const telRad =
					( property?.settings?.radius?.val || 0 ) -
					( property?.settings?.border?.val || 0 );
				fieldCss = `
						.prad-tel-container {
							${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color?.normal,
							} ) }
                            ${ buildRadius( property?.settings?.radius ) }
							${ buildBg( property?.bg_color?.normal ) }
						}
						.prad-tel-country-wrapper {
							border-radius: ${ telRad }${
								property?.settings?.radius?.unit || 'px'
							} 0 0 ${ telRad }${
								property?.settings?.radius?.unit || 'px'
							};
						}
						.prad-block-input,
						textarea.prad-block-input,
						input:is([type=url],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input {
                            ${ buildPadding( {
								paddingTB: property?.settings?.paddingTB,
								paddingLR: property?.settings?.paddingLR,
							} ) }
                            ${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color?.normal,
							} ) }
                            ${ buildRadius( property?.settings?.radius ) }
                            ${ buildBg( property?.bg_color?.normal ) }
                        }
                        .prad-block-input:focus,
                        textarea.prad-block-input:focus,
                        .prad-select-open,
                        .prad-block-input:has(input:focus),
                        input:is([type=url],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input:focus {
                            ${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color?.hover,
							} ) }
                            ${ buildBg( property?.bg_color?.hover ) }
							outline: 0 !important;
							box-shadow: none !important;
                        }
						.prad-block-input.prad-select-box,
						.prad-block-input.prad-color-picker-container,
						.prad-block-input.prad-date-picker-container,
						.prad-block-input.prad-time-picker-container {
							padding: ${ property?.settings?.paddingTB.val - 1 || 0 }${
								property?.settings?.paddingTB.unit || 'px'
							} ${ property?.settings?.paddingLR.val || 0 }${
								property?.settings?.paddingLR.unit || 'px'
							}!important;
						}
                    `;
				break;
			case 'range':
				fieldCss = `
						.prad-range-header, .prad-range-input-container {
							margin-bottom: calc(${ Number( property?.settings?.height?.val ) / 2 || 8 }${
								property?.settings?.height?.unit || 'px'
							} + 4${
								property?.settings?.height?.unit || 'px'
							}) !important;
						}
                        .prad-block-range .prad-range-input-container input[type="range"].prad-block-range-input {
                            ${ buildHeight( property?.settings?.height ) }
							background: linear-gradient(90deg, ${
								property?.active_color
							} var(--range-value, 50%), ${
								property?.inactive_color
							} var(--range-value, 50%)) !important;
                        }
                        .prad-block-range .prad-range-input-container input[type="range"].prad-block-range-input::-webkit-slider-thumb {
                            ${ buildBg( property?.inactive_color ) }
							width: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} * 2);
							height: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} * 2);
							border-width: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} / 2);
							border-color: ${ property?.active_color };
							border-style: solid;
							position: absolute;
							top: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} / -2);
							left: max(
								0px,
								calc(
									var(--range-value) - ${ property?.settings?.height?.val * 1.95 }${
										property?.settings?.height?.unit || 'px'
									} + 10px
								)
							);
                        }
						.theme-astra .prad-block-range .prad-range-input-container input[type="range"].prad-block-range-input.prad-range-frontend::-webkit-slider-thumb {
							top: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} / ${
								// eslint-disable-next-line no-nested-ternary
								property?.settings?.height?.val > 10
									? // eslint-disable-next-line no-nested-ternary
									  property?.settings?.height?.val < 20
										? -4
										: -2.5
									: 4
							} );
						}
                        .prad-block-range .prad-range-input-container input[type="range"].prad-block-range-input::-moz-range-thumb {
                            ${ buildBg( property?.inactive_color ) }
							width: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} * 2);
							height: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} * 2);
							border-width: calc(${ property?.settings?.height?.val }${
								property?.settings?.height?.unit || 'px'
							} / 2);
							border-color: ${ property?.active_color };
							border-style: solid;
                        }
                    `;
				break;
			case 'checkbox':
				fieldCss = `
                        .prad-checkbox-mark {
                            ${ buildSize( property?.settings?.size ) }
							${ buildBg( property?.bg_color?.normal ) }
                            ${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color?.normal,
							} ) }
                            ${ buildRadius( property?.settings?.radius ) }
                        }
                       .prad-type-checkbox-input .prad-input-container input[type="checkbox"]:checked + label .prad-checkbox-mark {
							${ buildBg( property?.bg_color?.active ) }
							border: 1px solid ${ property?.border_color?.active } !important;
                        }
                        .prad-checkbox-mark svg {
							${ buildSize( property?.settings?.size ) }
                            ${ buildColor( property?.icon_color ) }
                        }
                    `;
				break;
			case 'radio':
				fieldCss = `
                        .prad-radio-mark {
							width: ${
								Number( property?.settings?.size?.val ) +
								Number( property?.settings?.border?.val )
							}${ property?.unit || 'px' };
							height: ${
								Number( property?.settings?.size?.val ) +
								Number( property?.settings?.border?.val )
							}${ property?.unit || 'px' };
                            ${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color,
							} ) }
							${ buildBg( property?.bg_color ) }
							flex-shrink: 0;
                        }
                        .prad-radio-dot {
                            ${ buildBg( property?.dot_color ) }
							width: calc(${ property?.settings?.size?.val }${
								property?.settings?.size?.unit
							} - (${ property?.settings?.border?.val }${
								property?.settings?.size?.unit
							} * 2) - 6px);
							height: calc(${ property?.settings?.size?.val }${
								property?.settings?.size?.unit
							}  - (${ property?.settings?.border?.val }${
								property?.settings?.size?.unit
							} * 2) - 6px);
                        }
						.prad-type-radio-input .prad-input-container input[type=radio]:checked + label .prad-radio-mark {
							border-color: ${ property?.dot_color } !important;
							border-width: ${ Number( property?.settings?.border?.val ) + 3 }${
								property?.settings?.size?.unit
							} !important;
							width: ${
								Number( property?.settings?.size?.val ) +
								Number( property?.settings?.border?.val ) -
								6
							}${ property?.unit || 'px' };
							height: ${
								Number( property?.settings?.size?.val ) +
								Number( property?.settings?.border?.val ) -
								6
							}${ property?.unit || 'px' };
						} 
                    `;
				break;
			case 'button':
				fieldCss = `
                        .prad-button-item {
                            ${ buildPadding( {
								paddingTB: property?.settings?.paddingTB,
								paddingLR: property?.settings?.paddingLR,
							} ) }
                            ${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color?.normal,
							} ) }
                            ${ buildRadius( property?.settings?.radius ) }
                            ${ buildTypo( property?.typo ) }
                            ${ buildColor( property?.color?.normal ) }
                            ${ buildBg( property?.bg_color?.normal ) }
                        }
						.prad-button-item .prad-block-price, 
						.prad-button-item .prad-block-price span, 
						.prad-button-item .prad-block-price span span, 
						.prad-button-item .prad-block-price span span span, 
						.prad-button-item .prad-block-price span.woocommerce-Price-amount, 
						.prad-button-item .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol, 
						.prad-button-item .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol span {
							${ buildTypo( property?.typo ) }
                            ${ buildColor( property?.color?.normal ) }
						}
						.prad-button-item:hover .prad-block-price, 
						.prad-button-item:hover .prad-block-price span, 
						.prad-button-item:hover .prad-block-price span span, 
						.prad-button-item:hover .prad-block-price span span span, 
						.prad-button-item:hover .prad-block-price span.woocommerce-Price-amount, 
						.prad-button-item:hover .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol, 
						.prad-button-item:hover .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol span,
						.prad-button-container.prad-active .prad-button-item .prad-block-price span, 
						.prad-button-container.prad-active .prad-button-item .prad-block-price span span, 
						.prad-button-container.prad-active .prad-button-item .prad-block-price, 
						.prad-button-container.prad-active .prad-button-item .prad-block-price span span span, 
						.prad-button-container.prad-active .prad-button-item .prad-block-price span.woocommerce-Price-amount, 
						.prad-button-container.prad-active .prad-button-item .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol, 
						.prad-button-container.prad-active .prad-button-item .prad-block-price span.woocommerce-Price-amount span.woocommerce-Price-currencySymbol span {
							${ buildColor( property?.color?.hover ) }
						}
						.prad-button-item:hover,
						.prad-button-item.prad-active,
						.prad-button-container.prad-active .prad-button-item {
                            ${ buildColor( property?.color?.hover ) }
                            ${ buildBg( property?.bg_color?.hover ) }
							border-color: ${ property?.border_color?.hover };
                        }
						.prad-button-item:hover .prad-block-price,
						.prad-button-item.prad-active .prad-block-price,
						.prad-button-container.prad-active .prad-button-item .prad-block-price {
                            ${ buildColor( property?.color?.hover ) }
                        }
                    `;
				break;
			case 'switch':
				fieldCss = `
						.prad-switch-body {
							${ buildBorder( {
								property: property?.settings?.border,
								type: '',
								color: property?.border_color?.normal,
							} ) }
							${ buildBg( property?.bg_color?.normal ) }
							width: ${ property?.settings?.size?.val }${
								property?.settings?.size?.unit || 'px'
							};
							height: calc(${ property?.settings?.size?.val }${
								property?.settings?.size?.unit || 'px'
							} / 2);
							border-radius: ${
								Number( property?.settings?.size?.val ) / 4 < 30
									? '30px'
									: `calc(${ property?.settings?.size?.val }${
											property?.settings?.size?.unit ||
											'px'
									  } / 4)`
							};
						}
						.prad-switch-thumb {
							${ buildBg( property?.thumb_color ) }
							width: calc((${ property?.settings?.size?.val }${
								property?.settings?.size?.unit || 'px'
							} / 2) - 4${
								property?.settings?.size?.unit || 'px'
							});
						}
						.prad-block-switch input[type="checkbox"]:checked + label .prad-switch-body {
							${ buildBg( property?.bg_color?.active ) }
							border-color: ${ property?.border_color?.active };
						}
						.prad-block-switch input[type="checkbox"]:checked + label .prad-switch-thumb {
							left: calc((${ property?.settings?.size.val }${
								property?.settings?.size?.unit || 'px'
							} / 2) + 2${
								property?.settings?.size?.unit || 'px'
							});
						}
					`;
				break;
			case 'swatches':
				fieldCss = `
						.prad-type_swatches-input .prad-swatch-wrapper {
							grid-template-columns: repeat(auto-fit, minmax( 56px, ${
								property?.settings?.width?.val
							}${ property?.settings?.width?.unit } ));
						}
						.prad-type_swatches-input.prad-swatch-layout_img .prad-swatch-wrapper {
							grid-template-columns: repeat(auto-fit, ${ property?.settings?.width?.val }${
								property?.settings?.width?.unit
							} );
						}
						.prad-type_swatches-input.prad-swatch-layout_img .prad-swatch-wrapper:has(.prad-quantity-input) {
							grid-template-columns: repeat(auto-fit, minmax( 56px, ${
								property?.settings?.width?.val
							}${ property?.settings?.width?.unit } ));
						}
						.prad-type_swatches-input img.prad-swatch-item {
							${ buildHeight( property?.settings?.height ) }
                            ${ buildWidth( property?.settings?.width ) }
							max-width: ${ property?.settings?.width?.val }${
								property?.settings?.width?.unit
							};
						}
                        .prad-type_swatches-input .prad-swatch-item {
                            ${ buildHeight( property?.settings?.height ) }
                            ${ buildWidth( property?.settings?.width ) }
                            ${ buildRadius( property?.settings?.radius ) }
							border: ${
								Number( property?.settings?.border?.val ) >= 1
									? property?.settings?.border?.val
									: '2'
							}${
								property?.settings?.border?.unit || 'px'
							} solid ${
								Number( property?.settings?.border?.val ) >= 1
									? property?.border_color
									: 'transparent'
							}
                        }
                        .prad-type_swatches-input .prad-swatch-mark-image {
                            right: calc(${
								property?.settings?.border?.val || '0'
							}${ property?.settings?.border?.unit || 'px' } + ${
								Number( property?.settings?.radius?.val ) / 3 <
								1
									? '0'
									: Math.min(
											Math.floor(
												Number(
													property?.settings?.radius
														?.val
												) / 3
											),
											10
									  ).toString()
							}${
								property?.settings?.border?.unit || 'px'
							} + 4px);
                            top: calc(${
								property?.settings?.border?.val || '0'
							}${ property?.settings?.border?.unit || 'px' } + ${
								Number( property?.settings?.radius?.val ) / 3 <
								1
									? '0'
									: Math.min(
											Math.floor(
												Number(
													property?.settings?.radius
														?.val
												) / 3
											),
											10
									  ).toString()
							}${
								property?.settings?.border?.unit || 'px'
							} + 4px);
                            color: ${ property?.active_border_color };
                        }
                        .prad-type_swatches-input .prad-swatch-container.prad-active, .prad-type_swatches-input .prad-active .prad-swatch-item, .prad-type_swatches-input .prad-swatch-item:hover  {
                            border-color: ${ property?.active_border_color };
                        }
						.prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-content-wrapper {
							left: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 2px );
							right: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 2px );
							bottom: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 2px );
							top: 47%;
							justify-content: center;
							border-radius: 0px 0px ${
								Number( property?.settings?.radius?.val ) -
									Number( property?.settings?.border?.val ) <
								0
									? '0'
									: Number(
											property?.settings?.radius?.val
									  ) -
									  Number( property?.settings?.border?.val )
							}${ property?.settings?.radius?.unit || 'px' } ${
								Number( property?.settings?.radius?.val ) -
									Number( property?.settings?.border?.val ) <
								0
									? '0'
									: Number(
											property?.settings?.radius?.val
									  ) -
									  Number( property?.settings?.border?.val )
							}${ property?.settings?.radius?.unit || 'px' };
						}
						{{PRAD}}.prad-type_swatches-input.prad-swatch-layout_overlay input[type=number].prad-quantity-input.prad-block-input {
							width: calc( 100% - ${
								property?.settings?.radius?.val < 0
									? '0'
									: property?.settings?.radius?.val || '0'
							}% ) !important;
							min-width: 60px;
						}
						.prad-parent .prad-type_swatches-input.prad-swatch-layout_overlay .prad-block-content-wrapper {
							left: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 4px );
							right: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 4px );
							bottom: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 4px );
						}
						.prad-type_swatches-input .prad-swatch-container .prad-block-input, .prad-type_swatches-input input:is([type=url],[type=tel],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input {
							min-width: ${ property?.settings?.width?.val }${
								property?.settings?.width?.unit
							};
						}
						.prad-type_swatches-input .prad-swatch-container {
							margin-right: auto;
							margin-left: ${
								Number( property?.settings?.width?.val ) < 56
									? 'auto'
									: '-5px'
							}
						}
						.prad-parent.prad-type_swatches-input .prad-swatch-container {
							margin-left: ${
								Number( property?.settings?.width?.val ) < 56
									? 'auto'
									: '-2px'
							}
						}
                    `;
				break;
			case 'color_swatches':
				fieldCss = `
						.prad-block-color-switcher .prad-swatch-wrapper {
							grid-template-columns: repeat(auto-fit, minmax( 56px, ${
								property?.settings?.width?.val
							}${ property?.settings?.width?.unit } ));
						}
						.prad-block-color-switcher.prad-swatch-layout_img .prad-swatch-wrapper {
							grid-template-columns: repeat(auto-fit, ${ property?.settings?.width?.val }${
								property?.settings?.width?.unit
							} );
						}
						.prad-block-color-switcher.prad-swatch-layout_img .prad-swatch-wrapper:has(.prad-quantity-input) {
							grid-template-columns: repeat(auto-fit, minmax( 56px, ${
								property?.settings?.width?.val
							}${ property?.settings?.width?.unit } ));
						}
                        .prad-block-color-switcher .prad-swatch-item {
                            ${ buildHeight( property?.settings?.height ) }
                            ${ buildWidth( property?.settings?.width ) }
                            ${ buildRadius( property?.settings?.radius ) }
							border: ${
								Number( property?.settings?.border?.val ) >= 1
									? property?.settings?.border?.val
									: '2'
							}${
								property?.settings?.border?.unit || 'px'
							} solid ${
								Number( property?.settings?.border?.val ) >= 1
									? property?.border_color
									: 'transparent'
							}
                        }
                        .prad-block-color-switcher .prad-swatch-mark-image {
                            right: calc(${
								property?.settings?.border?.val || '0'
							}${ property?.settings?.border?.unit || 'px' } + ${
								Number( property?.settings?.radius?.val ) / 3 <
								1
									? '0'
									: Math.min(
											Math.floor(
												Number(
													property?.settings?.radius
														?.val
												) / 3
											),
											10
									  ).toString()
							}${
								property?.settings?.border?.unit || 'px'
							} + 4px);
                            top: calc(${
								property?.settings?.border?.val || '0'
							}${ property?.settings?.border?.unit || 'px' } + ${
								Number( property?.settings?.radius?.val ) / 3 <
								1
									? '0'
									: Math.min(
											Math.floor(
												Number(
													property?.settings?.radius
														?.val
												) / 3
											),
											10
									  ).toString()
							}${
								property?.settings?.border?.unit || 'px'
							} + 4px);
                            color: ${ property?.active_border_color };
                        }
                        .prad-block-color-switcher .prad-swatch-container.prad-active, .prad-block-color-switcher .prad-active .prad-swatch-item, .prad-block-color-switcher .prad-swatch-item:hover  {
                            border-color: ${ property?.active_border_color };
                        }
						.prad-block-color-switcher.prad-swatch-layout_overlay .prad-block-content-wrapper {
							left: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 2px );
							right: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 2px );
							bottom: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 2px );
							top: 47%;
							justify-content: center;
							border-radius: 0px 0px ${
								Number( property?.settings?.radius?.val ) -
									Number( property?.settings?.border?.val ) <
								0
									? '0'
									: Number(
											property?.settings?.radius?.val
									  ) -
									  Number( property?.settings?.border?.val )
							}${ property?.settings?.radius?.unit || 'px' } ${
								Number( property?.settings?.radius?.val ) -
									Number( property?.settings?.border?.val ) <
								0
									? '0'
									: Number(
											property?.settings?.radius?.val
									  ) -
									  Number( property?.settings?.border?.val )
							}${ property?.settings?.radius?.unit || 'px' };
						}
						{{PRAD}}.prad-block-color-switcher.prad-swatch-layout_overlay input[type=number].prad-quantity-input.prad-block-input {
							width: calc( 100% - ${
								property?.settings?.radius?.val < 0
									? '0'
									: property?.settings?.radius?.val || '0'
							}% ) !important;
							min-width: 60px;
						}
						.prad-parent .prad-block-color-switcher.prad-swatch-layout_overlay .prad-block-content-wrapper {
							left: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 4px );
							right: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 4px );
							bottom: calc( ${ property?.settings?.border?.val || '0' }${
								property?.settings?.border?.unit || 'px'
							} + 4px );
						}
						.prad-block-color-switcher .prad-swatch-container .prad-block-input,.prad-block-color-switcher .prad-swatch-container input:is([type=url],[type=tel],[type=text],[type=email],[type=number],[type=search],[type=password]).prad-block-input {
							min-width: ${ property?.settings?.width?.val }${
								property?.settings?.width?.unit
							};
						}
						.prad-block-color-switcher .prad-swatch-container {
							margin-right: auto;
							margin-left: ${
								Number( property?.settings?.width?.val ) < 56
									? 'auto'
									: '-5px'
							}
						}
						.prad-parent.prad-block-color-switcher .prad-swatch-container {
							margin-left: ${
								Number( property?.settings?.width?.val ) < 56
									? 'auto'
									: '-2px'
							}
						}
                    `;
				break;
			case 'others':
				fieldCss = `
                        .prad-block-required {
                            ${ buildColor( property?.req_color ) }
							font-size: ${ globalStyle.common?.title?.typo?._size?.val || '14' }${
								globalStyle.common?.title?.typo?._size?.unit ||
								'px'
							};
							right: calc((${ globalStyle.common?.title?.typo?._size?.val || '14' }${
								globalStyle.common?.title?.typo?._size?.unit ||
								'px'
							} - 4${
								globalStyle.common?.title?.typo?._size?.unit ||
								'px'
							}) * -1);
							top: 6px;
							line-height: 0;
                        }
						.prad-separator-item {
							background-color: ${ property?.separator_color };
						}
                        .prad-block-error {
                            ${ buildColor( property?.error_color ) }
                        }
                    `;
				break;
			default:
				break;
		}
		fieldCssArr.push(
			fieldCss?.replace( /\\n/g, '' ).replace( /\s+/g, ' ' ).trim()
		);
	} );

	const returnCss = commonCss.join( '' ) + fieldCssArr.join( '' );
	if ( returnCss ) {
		document.getElementById( 'prad-global-css' ).innerHTML = returnCss;
	}
	return returnCss;
};

export { generateCss, generateGlobalCss };
