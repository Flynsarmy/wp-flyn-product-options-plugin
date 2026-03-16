import { useEffect, useRef, useState } from 'react';
import ButtonGroup from '../../../../../../components/button_group';
import { useAddons } from '../../../../../../context/AddonsContext';
import { FieldHelpText, FieldTitle } from '../common_compo/generalCommon';
const { __ } = wp.i18n;

const getDynamicValueJS = ( variableName ) => {
	const dynamicVariablesJS = { product_price: 100 };
	if (
		Object.prototype.hasOwnProperty.call( dynamicVariablesJS, variableName )
	) {
		const value = dynamicVariablesJS[ variableName ];
		if ( typeof value === 'number' && ! isNaN( value ) ) {
			return value;
		}
		return 0;
	}
	return 0;
};

const preprocessFormulaJS = ( formula ) => {
	const trimmedFormula = formula.trim();
	let warning = '';
	let processedFormula = ''; // Initialize to empty string by default.

	if ( ! trimmedFormula ) {
		warning = __( 'Formula cannot be empty.', 'product-addons' );
		return { processedFormula: '', warning };
	}

	// Basic Regex Validation (Allows %, letters, numbers, underscores, hyphens for vars)
	const validFormulaRegex = /^[0-9\s+\-*/().{}a-zA-Z_%-]+$/;
	if ( ! validFormulaRegex.test( trimmedFormula ) ) {
		warning = __(
			'Formula contains invalid characters.',
			'product-addons'
		);
		return { processedFormula: '', warning };
	}

	processedFormula = trimmedFormula; // Start with the trimmed formula.

	// Flag to detect if variable replacement caused an error.
	let variableReplacementError = false;

	// Replace Dynamic Placeholders {{variable_name}}
	processedFormula = processedFormula.replace(
		/\{\{([a-zA-Z0-9_-]+)\}\}/g,
		( match, variableName ) => {
			if ( variableReplacementError ) {
				// If an error already occurred, stop processing and return the match to prevent further issues.
				return match;
			}
			const value = getDynamicValueJS( variableName.trim() );
			if ( typeof value !== 'number' || isNaN( value ) ) {
				warning = __(
					'Value is not a valid number.',
					'product-addons'
				);
				variableReplacementError = true; // Set flag to stop further processing in this callback.
				return match; // Return the original match so replacement doesn't break.
			}
			return value.toString(); // Ensure it's a string for replacement.
		}
	);

	// If an error occurred during variable replacement, return early.
	if ( variableReplacementError ) {
		return { processedFormula: '', warning };
	}

	// Convert Percentages (e.g., N% to (N/100))
	processedFormula = processedFormula.replace(
		/(\d+(\.\d+)?)\%/g,
		'($1/100)'
	);

	return { processedFormula, warning };
};

const calculateFormulaJS = ( formula ) => {
	let warning = '';
	let result = 0;

	const { processedFormula, warning: preprocessWarning } =
		preprocessFormulaJS( formula );

	if ( preprocessWarning ) {
		return { res: 0, warning: preprocessWarning };
	}

	try {
		// Basic sanitization before evaluation:
		// Check if anything other than numbers, operators, parentheses, dots, 'e', or 'E' remain.
		const sanitizedForEval = processedFormula.replace( /\s+/g, '' );

		// Allow 'e' or 'E' for scientific notation like 1e-5.
		if ( /[^0-9.+\-*/()eE]/.test( sanitizedForEval ) ) {
			warning = __( 'Invalid formula.', 'product-addons' );
			return { res: 0, warning };
		}

		if ( ! sanitizedForEval ) {
			warning = __( 'Processed formula is empty.', 'product-addons' );
			return { res: 0, warning };
		}

		// WARNING: Using new Function() is still a security risk with untrusted user input.
		// For production, consider a dedicated math parser library.
		const evalResult = new Function( 'return ' + sanitizedForEval )();
		if ( ! Number.isFinite( evalResult ) ) {
			// Number.isFinite() checks for finite numbers, excluding Infinity, -Infinity, and NaN
			warning = __(
				'Calculation resulted in an infinite value, returning 0.',
				'product-addons'
			);
			result = 0;
		} else if ( typeof evalResult === 'number' && ! isNaN( evalResult ) ) {
			result = evalResult;
		} else {
			warning = __(
				'Calculation resulted in a non-numeric or invalid value.',
				'product-addons'
			);
		}
	} catch ( error ) {
		warning =
			__( 'Calculation error:', 'product-addons' ) + ' ' + error.message;
	}

	return { res: result, warning };
};

const CustomFormulaSettings = ( props ) => {
	const { settings, toolbarSetData } = props;
	const { fieldData } = useAddons();
	const addonFields = fieldData?.reduce( ( acc, field ) => {
		if ( field.type === 'range' || field.type === 'number' ) {
			acc.push( { addonid: field.blockid, label: field.label } );
		}
		return acc;
	}, [] );
	const [ showWarning, setShowWarning ] = useState( '' );
	const [ showSuggestions, setShowSuggestions ] = useState( false );
	const inputRef = useRef( null );
	const suggestionsRef = useRef( null );

	const { warning } = calculateFormulaJS(
		settings.formulaData?.expression || ''
	);
	useEffect( () => {
		setShowWarning( warning );
	}, [ warning ] );

	const formulaInputHandle = ( formulaString ) => {
		const returnedData = calculateFormulaJS( formulaString );
		if ( returnedData.warning ) {
			setShowWarning( returnedData.warning );
		} else {
			setShowWarning( '' );
		}
		toolbarSetData( 'formulaData', {
			valid: returnedData.warning ? false : true,
			expression: formulaString,
		} );
	};

	const handleInputChange = ( e ) => {
		const value = e.target.value;
		formulaInputHandle( value );
		if ( value.slice( -2 ) === '{{' ) {
			setShowSuggestions( true );
		} else {
			setShowSuggestions( false );
		}
	};

	useEffect( () => {
		const abortControl = new AbortController();
		const handleClickOutside = ( event ) => {
			if (
				inputRef.current &&
				! inputRef.current.contains( event.target ) &&
				suggestionsRef.current &&
				! suggestionsRef.current.contains( event.target )
			) {
				setShowSuggestions( false );
			}
		};

		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		return () => {
			abortControl.abort();
		};
	}, [] );

	const handleSuggestionClick = ( suggestionText ) => {
		formulaInputHandle(
			`${ settings.formulaData?.expression || '' }${ suggestionText }}}`
		);
		if ( inputRef.current ) {
			inputRef.current.focus();
		}
		setShowSuggestions( false );
		handleBlockHighlight( suggestionText, 'remove' );
	};

	const handleBlockHighlight = ( addonid, action ) => {
		const childElement = document.getElementById( `prad-bid-${ addonid }` );
		if ( childElement ) {
			const parentElement = childElement.closest(
				'.prad-builder-wrapper'
			);
			if ( parentElement ) {
				if ( action === 'add' ) {
					parentElement.classList.add(
						'prad-formula-suggestion-highlight'
					);

					const rect = parentElement.getBoundingClientRect();
					const currentScrollY = window.scrollY || window.pageYOffset; // Current scroll position

					let scrollTargetY;
					const viewportHeight = window.innerHeight;

					if ( rect.top < 85 ) {
						scrollTargetY = currentScrollY + rect.top - 85;
					} else if ( rect.bottom > viewportHeight ) {
						if ( rect.height > viewportHeight - 85 ) {
							scrollTargetY = currentScrollY + rect.top - 85;
						} else {
							scrollTargetY =
								currentScrollY + rect.bottom - 85 - rect.height;
						}
					} else {
						return;
					}

					window.scrollTo( {
						top: scrollTargetY,
						behavior: 'smooth',
					} );
				} else {
					parentElement.classList.remove(
						'prad-formula-suggestion-highlight'
					);

					const theElement = document.getElementById(
						`prad-bid-${ settings.blockid }`
					);
					const rect = theElement.getBoundingClientRect();
					const currentScrollY = window.scrollY || window.pageYOffset; // Current scroll position

					let scrollTargetY;
					const viewportHeight = window.innerHeight;

					if ( rect.top < 85 ) {
						scrollTargetY = currentScrollY + rect.top - 85;
					} else if ( rect.bottom > viewportHeight ) {
						if ( rect.height > viewportHeight - 85 ) {
							scrollTargetY = currentScrollY + rect.top - 85;
						} else {
							// Otherwise, just bring its bottom into view
							scrollTargetY =
								currentScrollY + rect.bottom - 85 - rect.height;
						}
					} else {
						return;
					}

					window.scrollTo( {
						top: scrollTargetY,
						behavior: 'smooth',
					} );
				}
			}
		}
	};

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-gap-12">
				<FieldTitle
					classes="prad-w-full"
					onChange={ ( _val ) => toolbarSetData( 'label', _val ) }
					value={ settings.label }
				/>
				<FieldHelpText
					value={ settings.description }
					classes="prad-w-full"
					onChange={ ( _val ) =>
						toolbarSetData( 'description', _val )
					}
				/>
			</div>
			<div className="prad-d-flex prad-gap-12">
				<ButtonGroup
					// inlineView={ true }
					title={ __( 'Width' ) }
					value={ settings.blockWidth || '_100' }
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
				<ButtonGroup
					// inlineView={ true }
					title={ __( 'Help Text Position' ) }
					value={ settings.descpPosition || 'belowTitle' }
					options={ [
						{ label: 'Below Title', value: 'belowTitle' },
						{ label: 'Tooltip', value: 'tooltip' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'descpPosition', value )
					}
				/>
			</div>

			<div className="prad-w-full prad-mb-24">
				<label
					htmlFor={ `${ settings.type }-formula` }
					className="prad-field-title"
				>
					{ __( 'Custom Formula', 'product-addons' ) }
				</label>
				<div className="prad-relative">
					<input
						ref={ inputRef }
						className="prad-input prad-bc-border-primary prad-w-full"
						type="text"
						placeholder="{{product_price}} + {{addon_field}}+20*3"
						id={ `${ settings.type }-formula` }
						value={ settings.formulaData?.expression || '' }
						onChange={ ( e ) => {
							handleInputChange( e );
						} }
					/>
					{ showSuggestions && addonFields.length > 0 && (
						<div
							className="prad-scrollbar prad-w-full"
							ref={ suggestionsRef }
							style={ {
								position: 'absolute',
								top: '100%',
								left: 0,
								right: 0,
								border: '1px solid var(--prad-color-border-primary)',
								backgroundColor: '#fff',
								padding: 0,
								margin: '5px 0 0 0',
								maxHeight: '200px',
								overflowY: 'auto',
								zIndex: 1000,
								boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
								borderRadius: '4px',
							} }
						>
							{ addonFields.map( ( suggestion ) => (
								<div
									key={ suggestion.addonid }
									onClick={ () => {
										handleSuggestionClick(
											suggestion.addonid
										);
									} }
									style={ {
										padding: '8px 10px',
										cursor: 'pointer',
									} }
									onMouseEnter={ ( e ) => {
										e.currentTarget.style.backgroundColor =
											'var(--prad-color-border-primary)';
										handleBlockHighlight(
											suggestion.addonid,
											'add'
										);
									} }
									onMouseLeave={ ( e ) => {
										e.currentTarget.style.backgroundColor =
											'#fff';
										handleBlockHighlight(
											suggestion.addonid,
											'remove'
										);
									} }
								>
									{ suggestion.label }
								</div>
							) ) }
						</div>
					) }
				</div>
				{ showWarning && (
					<span style={ { color: '#ea4b08' } }>{ showWarning }</span>
				) }
				<div className="prad-font-12 prad-color-primary prad-mt-8">
					{ __( 'Example 1:', 'product-addons' ) }{ ' ' }
					{ `10+{{product_price}}` }{ ' ' }
				</div>
				<div className="prad-font-12 prad-color-primary prad-mt-8">
					{ __( 'Example 2:', 'product-addons' ) }{ ' ' }
					{ `{{addon_field_1}}*5+{{addon_field_2}}*3` }{ ' ' }
				</div>
			</div>
			<div className="prad-w-full prad-mb-24">
				<div className="prad-field-title prad-font-16 prad-mb-16 prad-font-bold">
					{ __( 'Add Variables to Formula', 'product-addons' ) }
				</div>
				<div className="prad-d-flex prad-gap-16 prad-item-center">
					<div className="prad-field-title prad-mb-0">
						{ __( 'Product Price', 'product-addons' ) }:{ ' ' }
					</div>
					<div
						className="prad-button prad-button-secondary prad-cursor-pointer"
						onClick={ () => {
							formulaInputHandle(
								`${
									settings.formulaData?.expression || ''
								}{{product_price}}`
							);
						} }
						style={ {
							borderRadius: '4px',
							padding: '4px 6px',
							boxSizing: 'content-box',
							border: '1px solid var(--prad-color-border-primary)',
							background: '#fafdef',
						} }
						title={ `{{product_price}}` }
					>
						{ __( 'Product Price', 'product-addons' ) }
					</div>
				</div>
				<div className="prad-mt-24 prad-d-flex">
					<div
						className="prad-field-title prad-mb-0"
						style={ { width: '105px', paddingTop: '4px' } }
					>
						{ __( 'Addon Field', 'product-addons' ) }:{ ' ' }
					</div>
					<div
						className="prad-d-flex prad-gap-10 prad-flex-wrap"
						style={ { width: 'calc( 100% - 105px )' } }
					>
						{ addonFields.map( ( field, index ) => (
							<div
								style={ {
									width: '80px',
									borderRadius: '4px',
									padding: '4px 6px',
									boxSizing: 'content-box',
									border: '1px solid var(--prad-color-border-primary)',
									background: '#fafdef',
								} }
								key={ index }
								className="prad-button prad-button-secondary prad-cursor-pointer prad-ellipsis"
								onClick={ () => {
									formulaInputHandle(
										`${
											settings.formulaData?.expression ||
											''
										}{{${ field.addonid }}}`
									);
									if ( inputRef.current ) {
										inputRef.current.focus();
									}
								} }
								title={ `{{${ field.addonid }}}` }
								onMouseEnter={ () => {
									handleBlockHighlight(
										field.addonid,
										'add'
									);
								} }
								onMouseLeave={ () => {
									handleBlockHighlight(
										field.addonid,
										'remove'
									);
								} }
							>
								{ field.label }
							</div>
						) ) }
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomFormulaSettings;
