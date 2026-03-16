const { __ } = wp.i18n;
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import Toast from '../utils/toaster/Toast';
import EditableTitle from './EditableTitle';

const getOptionLabel = ( key ) => {
	const optionLabel = {
		normal: __( 'Normal', 'product-addons' ),
		active: __( 'Active', 'product-addons' ),
		hover: __( 'Active/Hover', 'product-addons' ),
	};
	return optionLabel[ key ];
};

const ColorPicker = ( {
	className = '',
	triggerClass = '',
	selectedColorClass = '',
	initialColor = '#86a62cd5',
	onChange,
	colorTabNormal,
	colorTabHover,
	onTabChange,
	style,
	isSwatches,
} ) => {
	// Convert color to HSV
	const rgbToHSV = ( r, g, b, a = 1 ) => {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max( r, g, b );
		const min = Math.min( r, g, b );
		const delta = max - min;

		let h = 0;
		const s = max === 0 ? 0 : delta / max;
		const v = max;

		if ( delta !== 0 ) {
			if ( max === r ) {
				h = ( g - b ) / delta;
			} else if ( max === g ) {
				h = ( b - r ) / delta + 2;
			} else {
				h = ( r - g ) / delta + 4;
			}
			h *= 60;
			if ( h < 0 ) {
				h += 360;
			}
		}

		return { h, s: s * 100, v: v * 100, a };
	};

	const hexToHSV = useCallback( ( hex ) => {
		hex = hex.replace( /^#/, '' );
		let r,
			g,
			b,
			a = 1;
		if ( hex.length === 3 ) {
			r = parseInt( hex.charAt( 0 ) + hex.charAt( 0 ), 16 );
			g = parseInt( hex.charAt( 1 ) + hex.charAt( 1 ), 16 );
			b = parseInt( hex.charAt( 2 ) + hex.charAt( 2 ), 16 );
		} else if ( hex.length === 8 ) {
			r = parseInt( hex.substr( 0, 2 ), 16 );
			g = parseInt( hex.substr( 2, 2 ), 16 );
			b = parseInt( hex.substr( 4, 2 ), 16 );
			a = parseInt( hex.substr( 6, 2 ), 16 ) / 255;
			a = Math.round( a * 100 ) / 100;
		} else {
			r = parseInt( hex.substr( 0, 2 ), 16 );
			g = parseInt( hex.substr( 2, 2 ), 16 );
			b = parseInt( hex.substr( 4, 2 ), 16 );
		}
		return rgbToHSV( r, g, b, a );
	}, [] );

	const identifyColorFormat = useCallback(
		( identifyColor ) => {
			const hexRegex =
				/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
			const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
			const rgbaRegex =
				/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d?(\.\d+)?|\d+(\.\d+)?%)\)$/;
			const hsvRegex = /^hsv\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
			const hsvaRegex =
				/^hsva\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d?(\.\d+)?|\d+(\.\d+)?%)\)$/;

			if ( hexRegex.test( identifyColor ) ) {
				if ( identifyColor.length === 9 ) {
					const hexWithoutHash = identifyColor.slice( 1 );
					const r = parseInt( hexWithoutHash.slice( 0, 2 ), 16 );
					const g = parseInt( hexWithoutHash.slice( 2, 4 ), 16 );
					const b = parseInt( hexWithoutHash.slice( 4, 6 ), 16 );
					const a =
						parseInt( hexWithoutHash.slice( 6, 8 ), 16 ) / 255;
					return rgbToHSV( r, g, b, a );
				}
				return hexToHSV( identifyColor );
			} else if ( rgbRegex.test( identifyColor ) ) {
				const rgbString = identifyColor;
				const rgbValues = rgbString.match( /\d+/g ).map( Number );
				return rgbToHSV( ...rgbValues );
			} else if ( rgbaRegex.test( identifyColor ) ) {
				const rgbaString = identifyColor;
				const rgbaValues = rgbaString
					.match( /\d+(\.\d+)?/g )
					.map( Number );
				return rgbToHSV( ...rgbaValues );
			} else if ( hsvRegex.test( identifyColor ) ) {
				const hsvString = identifyColor;
				const hsvValues = hsvString.match( /\d+/g ).map( Number );
				return hsvToHSV( ...hsvValues );
			} else if ( hsvaRegex.test( identifyColor ) ) {
				const hsvaString = identifyColor;
				const hsvaValues = hsvaString
					.match( /\d+(\.\d+)?/g )
					.map( Number );
				return hsvToHSV( ...hsvaValues );
			}
			return 'Unknown format';
		},
		[ hexToHSV ]
	);

	const defaultColor = identifyColorFormat( initialColor );
	const [ selectedColor, setSelectedColor ] = useState( defaultColor );
	const [ activeTab, setActiveTab ] = useState( colorTabNormal );

	const [ isDragging, setIsDragging ] = useState( false );
	const [ dragTarget, setDragTarget ] = useState( null );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
	} );
	const [ colorPickerPosition, setColorPickerPosition ] = useState( {
		top: 0,
		left: 0,
		isAbove: false,
		isRight: false,
	} );

	const mainSquareRef = useRef( null );
	const hueSliderRef = useRef( null );
	const alphaSliderRef = useRef( null );
	const triggerRef = useRef( null );
	const colorPickerRef = useRef( null );

	const handleClickOutside = ( event ) => {
		if (
			colorPickerRef.current &&
			! colorPickerRef.current.contains( event.target ) &&
			triggerRef.current &&
			! triggerRef.current.contains( event.target )
		) {
			setIsOpen( false );
		}
	};

	const updateColorPickerPosition = () => {
		const triggerRect = triggerRef.current?.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;

		const colorPickerHeight =
			colorPickerRef.current?.getBoundingClientRect().height || 0;
		const colorPickerWidth =
			colorPickerRef.current?.getBoundingClientRect().width || 0;

		const isAbove =
			triggerRect.top - colorPickerHeight - 10 > 0
				? triggerRect.bottom + colorPickerHeight + 10 > viewportHeight
				: false;

		const isRight =
			triggerRect.left - colorPickerWidth - 10 > 0
				? triggerRect.left + colorPickerWidth + 10 > viewportWidth
				: false;

		setColorPickerPosition( {
			top: isAbove
				? triggerRect?.top + window.scrollY - colorPickerHeight - 1
				: triggerRect?.bottom + window.scrollY + 1,
			left: isRight
				? triggerRect?.right + window.scrollX - colorPickerWidth
				: triggerRect?.left + window.scrollX,
			isAbove,
			isRight,
		} );
	};

	useEffect( () => {
		updateColorPickerPosition();
	}, [ isOpen ] );

	useEffect( () => {
		document.addEventListener( 'mousedown', handleClickOutside );
		window.addEventListener( 'scroll', updateColorPickerPosition, true );
		return () =>
			document.removeEventListener( 'mousedown', handleClickOutside );
	}, [] );

	const handleColorChange = useCallback(
		( newColor ) => {
			if ( onChange ) {
				const newRGBA = hsvToRgb(
					newColor.h,
					newColor.s,
					newColor.v,
					newColor.a
				);
				onChange(
					isSwatches
						? rgbToHex( newRGBA.r, newRGBA.g, newRGBA.b, newRGBA.a )
						: `rgba(${ newRGBA.r }, ${ newRGBA.g }, ${ newRGBA.b }, ${ newRGBA.a })`
				);
			}
		},
		[ onChange ]
	);

	const hsvToHSV = ( h, s, v, a = 1 ) => {
		return { h, s, v, a };
	};

	// Convert HSV to RGB
	const hsvToRgb = ( h, s, v, a ) => {
		h = h / 360;
		s = s / 100;
		v = v / 100;

		let r, g, b;
		const i = Math.floor( h * 6 );
		const f = h * 6 - i;
		const p = v * ( 1 - s );
		const q = v * ( 1 - f * s );
		const t = v * ( 1 - ( 1 - f ) * s );

		switch ( i % 6 ) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			case 5:
				r = v;
				g = p;
				b = q;
				break;
		}

		return {
			r: Math.round( r * 255 ),
			g: Math.round( g * 255 ),
			b: Math.round( b * 255 ),
			a: Math.round( a * 100 ) / 100,
		};
	};

	// Convert RGB to Hex
	const rgbToHex = ( r, g, b, a = 1 ) => {
		const hex = `#${ [ r, g, b ]
			.map( ( x ) => {
				const hexValue = x.toString( 16 );
				return hexValue.length === 1 ? '0' + hexValue : hexValue;
			} )
			.join( '' ) }`;

		if ( a !== 1 ) {
			const alphaHex = Math.round( a * 255 ).toString( 16 );
			return `${ hex }${
				alphaHex.length === 1 ? '0' + alphaHex : alphaHex
			}`;
		}

		return hex;
	};

	const handleMouseDown = ( e, target ) => {
		setIsDragging( true );
		setDragTarget( target );
		handleMouseMove( e, target );
	};

	const handleMouseMove = useCallback(
		( e, forcedTarget = null ) => {
			if ( ! isDragging && ! forcedTarget ) {
				return;
			}

			const target = forcedTarget || dragTarget;

			const rect = ( () => {
				if ( target === 'main' ) {
					return mainSquareRef.current.getBoundingClientRect();
				} else if ( target === 'hue' ) {
					return hueSliderRef.current.getBoundingClientRect();
				}
				return alphaSliderRef.current.getBoundingClientRect();
			} )();

			if ( target === 'main' ) {
				const x = Math.max(
					0,
					Math.min( 1, ( e.clientX - rect.left ) / rect.width )
				);
				const y = Math.max(
					0,
					Math.min( 1, ( e.clientY - rect.top ) / rect.height )
				);
				const updatedColor = {
					...selectedColor,
					s: Math.round( x * 100 ),
					v: Math.round( ( 1 - y ) * 100 ),
				};
				setSelectedColor( updatedColor );
				handleColorChange( updatedColor );
			} else if ( target === 'hue' ) {
				const y = Math.max(
					0,
					Math.min( 1, ( e.clientY - rect.top ) / rect.height )
				);
				const updatedColor = {
					...selectedColor,
					h: Math.round( 360 * y ),
				};
				setSelectedColor( updatedColor );
				handleColorChange( updatedColor );
			} else if ( target === 'alpha' ) {
				const y = Math.max(
					0,
					Math.min( 1, ( e.clientY - rect.top ) / rect.height )
				);
				const updatedColor = {
					...selectedColor,
					a: 1 - y,
				};
				setSelectedColor( updatedColor );
				handleColorChange( updatedColor );
			}
		},
		[ isDragging, dragTarget, selectedColor, handleColorChange ]
	);

	const handleMouseUp = useCallback( () => {
		setIsDragging( false );
		setDragTarget( null );
	}, [] );

	const handleCopy = () => {
		const colorText = hexColor;
		if ( colorText ) {
			if ( navigator.clipboard && navigator.clipboard.writeText ) {
				navigator.clipboard
					.writeText( colorText )
					.then( () => {
						setToastMessages( {
							status: 'success',
							messages: [ 'Color code copied.' ],
							state: true,
						} );
					} )
					.catch( ( err ) => {
						setToastMessages( {
							status: 'error',
							messages: [ 'Failed to copy: ' + err ],
							state: true,
						} );
					} );
			} else {
				// Fallback for older browsers
				const textArea = document.createElement( 'textarea' );
				textArea.value = colorText;
				document.body.appendChild( textArea );
				textArea.select();
				try {
					document.execCommand( 'copy' );
					setToastMessages( {
						status: 'success',
						messages: [ 'Color code copied.' ],
						state: true,
					} );
				} catch ( err ) {
					setToastMessages( {
						status: 'error',
						messages: [ 'Failed to copy: ' + err ],
						state: true,
					} );
				}
				document.body.removeChild( textArea );
			}
		}
	};

	useEffect( () => {
		if ( isDragging ) {
			window.addEventListener( 'mousemove', handleMouseMove );
			window.addEventListener( 'mouseup', handleMouseUp );
			return () => {
				window.removeEventListener( 'mousemove', handleMouseMove );
				window.removeEventListener( 'mouseup', handleMouseUp );
			};
		}
	}, [ isDragging, handleMouseMove, handleMouseUp ] );

	const rgba = hsvToRgb(
		selectedColor.h,
		selectedColor.s,
		selectedColor.v,
		selectedColor.a
	);
	const [ hexColor, setHexColor ] = useState(
		rgbToHex( rgba.r, rgba.g, rgba.b, rgba.a )
	);

	useEffect( () => {
		const newSelectedColor = identifyColorFormat( initialColor );
		const rgbaNew = hsvToRgb(
			newSelectedColor.h,
			newSelectedColor.s,
			newSelectedColor.v,
			newSelectedColor.a
		);
		setSelectedColor( newSelectedColor );
		setHexColor( rgbToHex( rgbaNew.r, rgbaNew.g, rgbaNew.b, rgbaNew.a ) );
	}, [ initialColor, identifyColorFormat ] );
	useEffect( () => {
		const rgbaUpdated = hsvToRgb(
			selectedColor.h,
			selectedColor.s,
			selectedColor.v,
			selectedColor.a
		);
		setHexColor(
			rgbToHex(
				rgbaUpdated.r,
				rgbaUpdated.g,
				rgbaUpdated.b,
				rgbaUpdated.a
			)
		);
	}, [ selectedColor ] );

	const renderColorPicker = isOpen && (
		<div
			className="prad-card prad-br-smd prad-absolute prad-bg-base1 prad-color-picker-wrapper"
			ref={ colorPickerRef }
			style={ {
				zIndex: isOpen ? 999999 : -999999,
				visibility: isOpen ? 'visible' : 'hidden',
				opacity: isOpen ? 1 : 0,
				top: isOpen ? `${ colorPickerPosition.top }px` : 0,
				left: isOpen ? `${ colorPickerPosition.left }px` : 0,
				width: 'min-content',
			} }
		>
			{ onTabChange && colorTabNormal && colorTabHover && (
				<div className="prad-card-header prad-plr-12 prad-p-0 prad-d-flex prad-gap-12">
					<div
						className={ `prad-color-tab-item prad-${
							activeTab === colorTabNormal ? 'active' : 'inactive'
						}` }
						onClick={ () => {
							onTabChange( colorTabNormal );
							setActiveTab( colorTabNormal );
						} }
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								onTabChange( colorTabNormal );
								setActiveTab( colorTabNormal );
							}
						} }
					>
						{ getOptionLabel( colorTabNormal ) }
					</div>
					<div
						className={ `prad-color-tab-item prad-${
							activeTab === colorTabHover ? 'active' : 'inactive'
						}` }
						onClick={ () => {
							onTabChange( colorTabHover );
							setActiveTab( colorTabHover );
						} }
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								onTabChange( colorTabHover );
								setActiveTab( colorTabHover );
							}
						} }
					>
						{ getOptionLabel( colorTabHover ) }
					</div>
				</div>
			) }
			<div className="prad-card-body prad-d-flex prad-flex-column prad-gap-12 prad-p-12">
				<div className="prad-d-flex prad-gap-12">
					{ /* Main color square */ }
					<div
						ref={ mainSquareRef }
						className="prad-color-main-square prad-relative prad-cursor-crosshair"
						onMouseDown={ ( e ) => handleMouseDown( e, 'main' ) }
						style={ {
							backgroundColor: `hsl(${ selectedColor.h }, 100%, 50%)`,
						} }
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								handleMouseDown( e, 'main' );
							}
						} }
					>
						<div
							className="prad-absolute prad-inset-0"
							style={ {
								background:
									'linear-gradient(to right, #fff 0%, transparent 100%)',
							} }
						/>
						<div
							className="prad-absolute prad-inset-0"
							style={ {
								background:
									'linear-gradient(to bottom, transparent 0%, #000 100%)',
							} }
						/>
						<div
							className="prad-color-selector prad-absolute"
							style={ {
								left: `${ selectedColor.s - 5 }%`,
								top: `${ 95 - selectedColor.v }%`,
							} }
						/>
					</div>

					{ /* Vertical sliders container */ }
					<div className="prad-d-flex prad-gap-10">
						{ /* Hue slider */ }
						<div
							ref={ hueSliderRef }
							className="prad-color-slider prad-relative prad-cursor-pointer"
							onMouseDown={ ( e ) => handleMouseDown( e, 'hue' ) }
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									handleMouseDown( e, 'hue' );
								}
							} }
						>
							<div
								className="prad-color-bar prad-absolute prad-inset-0"
								style={ {
									background:
										'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
								} }
							/>
							<div
								className="prad-color-selector prad-absolute"
								style={ {
									top: `calc(${
										( selectedColor.h / 360 ) * 100
									}% - ${
										selectedColor.h === 0 ? '0px' : '10px'
									})`,
								} }
							/>
						</div>

						{ /* Alpha slider */ }
						<div
							ref={ alphaSliderRef }
							className="prad-color-slider prad-relative prad-cursor-pointer"
							onMouseDown={ ( e ) =>
								handleMouseDown( e, 'alpha' )
							}
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									handleMouseDown( e, 'alpha' );
								}
							} }
						>
							<div
								className="prad-color-bar prad-absolute prad-inset-0"
								style={ {
									background: `linear-gradient(to bottom, rgb(${ rgba.r }, ${ rgba.g }, ${ rgba.b }) 0%, transparent 100%)`,
								} }
							/>
							<div
								className="prad-color-selector prad-absolute"
								style={ {
									top: `${ ( 1 - selectedColor.a ) * 100 }%`,
								} }
							/>
						</div>
					</div>
				</div>
				{ /* Color info */ }
				<div className="prad-d-flex prad-item-stretch prad-gap-8">
					<Button
						onlyIcon={ true }
						iconName="none"
						iconColor="text-dark"
						background="base2"
						padding="6px"
						onClick={ () => {
							setSelectedColor( { h: 0, s: 0, v: 0, a: 0 } );
							handleColorChange( { h: 0, s: 0, v: 0, a: 0 } );
						} }
					/>
					<div className="prad-color-info prad-d-flex prad-item-center prad-gap-8">
						<div className="prad-color-selected-wrapper">
							<div
								className="prad-color-selected"
								style={ {
									backgroundColor: hexColor,
									opacity: selectedColor.a,
								} }
							/>
						</div>
						<EditableTitle
							initialTitle={ hexColor }
							onChange={ ( e, val ) => {
								const newColor = identifyColorFormat( val );
								setSelectedColor( newColor );
								handleColorChange( newColor );
							} }
							width="64px"
							padding="2px 2px"
							fontSize="12"
							borderColor="transparent"
						/>
					</div>
					<Button
						onlyIcon={ true }
						iconName="copy"
						iconColor="text-dark"
						background="base2"
						padding="6px"
						onClick={ handleCopy }
					/>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<div className={ `prad-relative ${ className }` }>
				<div
					className={ `prad-color-trigger ${ triggerClass }` }
					ref={ triggerRef }
					onClick={ () => setIsOpen( ! isOpen ) }
					role="button"
					tabIndex="-1"
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' ) {
							setIsOpen( ! isOpen );
						}
					} }
					style={ {
						...style,
					} }
				>
					<div
						className={ selectedColorClass }
						style={ {
							backgroundColor: hexColor,
							opacity: selectedColor.a,
							width: '100%',
							height: '100%',
						} }
					/>
				</div>
			</div>
			{ ReactDOM.createPortal( renderColorPicker, document.body ) }
			{ toastMessages.state && (
				<Toast
					delay={ 2000 }
					toastMessages={ toastMessages }
					setToastMessages={ setToastMessages }
				/>
			) }
		</>
	);
};

export default ColorPicker;
