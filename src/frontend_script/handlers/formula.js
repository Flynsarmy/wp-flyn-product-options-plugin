import pradFrontendState from '../state';
import { buildPriceHtml } from '../utility/helper';
import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;

const handleFormulaBlockPricing = () => {
	$( '.prad-block-custom-formula' ).each( function () {
		const $this = $( this );
		const bid = $this.attr( 'data-bid' );
		const formulaData = $this.attr( 'data-formula-data' ) || '""';
		const label = $this.attr( 'data-label' );
		const priceObj = calculateFormulaJS( JSON.parse( formulaData ) );
		$this
			.find( '.prad-formula-price-container' )
			.html( buildPriceHtml( priceObj.res ) );

		fieldPrice.updateOptionPriceObj( bid, {
			label,
			type: 'custom_formula',
			optionid: $this
				.closest( '.prad-blocks-container' )
				.attr( 'data-optionid' ),
			sectionid: $this.attr( 'data-sectionid' ),
			value: priceObj.res || '',
			cost: priceObj.res || 0,
		} );
	} );
};

function calculateFormulaJS( formula ) {
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
			warning = 'Invalid Formula.';
			return { res: 0, warning };
		}

		if ( ! sanitizedForEval ) {
			warning = 'Processed formula is empty.';
			return { res: 0, warning };
		}

		const evalResult = safeEvaluateExpression( sanitizedForEval );

		if ( ! Number.isFinite( evalResult ) ) {
			// Number.isFinite() checks for finite numbers, excluding Infinity, -Infinity, and NaN
			warning = 'Calculation resulted in an infinite value, returning 0';
			result = 0;
		} else if ( typeof evalResult === 'number' && ! isNaN( evalResult ) ) {
			result = evalResult;
		} else {
			warning = 'Calculation resulted in a non-numeric or invalid value';
		}
	} catch ( error ) {
		warning = 'Calculation error:';
	}

	return { res: result, warning };
}

function getDynamicValueJS( variableName ) {
	if (
		Object.prototype.hasOwnProperty.call(
			pradFrontendState.formulaDynamicValues,
			variableName
		)
	) {
		const value = pradFrontendState.formulaDynamicValues[ variableName ];
		// Ensure the dynamic variable is a number.
		if ( typeof value === 'number' && ! isNaN( value ) ) {
			return value;
		}
		return 0;
	}
	return 0;
}
function preprocessFormulaJS( formula ) {
	const trimmedFormula = formula.trim();
	let warning = '';
	let processedFormula = '';

	if ( ! trimmedFormula ) {
		warning = 'Formula cannot be empty.';
		return { processedFormula: '', warning };
	}

	// Basic Regex Validation (Allows %, letters, numbers, underscores, hyphens for vars)
	const validFormulaRegex = /^[0-9\s+\-*/().{}a-zA-Z_%-]+$/;
	if ( ! validFormulaRegex.test( trimmedFormula ) ) {
		warning = 'Formula contains invalid characters.';
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
				// Set the warning and flag that an error occurred.
				// translators: %s: Variable name.
				( warning = 'Value for  is not a valid number.' ),
					'product-addons';
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
		/(\d+(\.\d+)?)%/g,
		'($1/100)'
	);

	return { processedFormula, warning };
}

function safeEvaluateExpression( expression ) {
	// Remove whitespace
	expression = expression.replace( /\s+/g, '' );

	if ( ! expression ) {
		throw new Error( 'Processed formula is empty' );
	}

	// Validate expression contains only allowed characters (including scientific notation)
	if ( ! /^[0-9.+\-*/()eE]+$/.test( expression ) ) {
		throw new Error( 'Invalid characters in formula' );
	}

	// Check for balanced parentheses
	if ( ! hasBalancedParentheses( expression ) ) {
		throw new Error( 'Unbalanced parentheses' );
	}

	// Parse and evaluate the expression
	return parseExpression( expression );
}

function hasBalancedParentheses( expression ) {
	let count = 0;
	for ( const char of expression ) {
		if ( char === '(' ) {
			count++;
		} else if ( char === ')' ) {
			count--;
			if ( count < 0 ) {
				return false;
			}
		}
	}
	return count === 0;
}

function parseExpression( expression ) {
	// Handle parentheses first (innermost first)
	while ( expression.includes( '(' ) ) {
		expression = expression.replace( /\(([^()]+)\)/g, ( match, inner ) =>
			evaluateSimpleExpression( inner )
		);
	}

	return evaluateSimpleExpression( expression );
}

function evaluateSimpleExpression( expression ) {
	// Handle scientific notation first - convert to regular numbers
	expression = expression.replace(
		/(\d+(?:\.\d+)?)[eE]([+-]?\d+)/g,
		( match, base, exp ) =>
			(
				parseFloat( base ) * Math.pow( 10, parseInt( exp, 10 ) )
			).toString()
	);

	// Handle multiplication and division first (left to right)
	while (
		/(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/.test( expression )
	) {
		expression = expression.replace(
			/(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)/,
			( match, left, op, right ) => {
				const leftNum = parseFloat( left );
				const rightNum = parseFloat( right );

				if ( op === '*' ) {
					return ( leftNum * rightNum ).toString();
				} else if ( op === '/' ) {
					if ( rightNum === 0 ) {
						throw new Error( 'Division by zero' );
					}
					return ( leftNum / rightNum ).toString();
				}
			}
		);
	}

	// Handle addition and subtraction (left to right)
	while (
		/(-?\d+(?:\.\d+)?)\s*([+\-])\s*(-?\d+(?:\.\d+)?)/.test( expression )
	) {
		expression = expression.replace(
			/(-?\d+(?:\.\d+)?)\s*([+\-])\s*(-?\d+(?:\.\d+)?)/,
			( match, left, op, right ) => {
				const leftNum = parseFloat( left );
				const rightNum = parseFloat( right );
				return op === '+'
					? ( leftNum + rightNum ).toString()
					: ( leftNum - rightNum ).toString();
			}
		);
	}

	// Should be left with just a number
	const result = parseFloat( expression );
	if ( isNaN( result ) ) {
		throw new Error( `Invalid expression result: ${ expression }` );
	}

	return result;
}

function updateFormulaDynamicValues( key, value ) {
	pradFrontendState.updateFormulaDynamicValue( key, Number( value ) );
	handleFormulaBlockPricing();
}

function removeFormulaValues( key ) {
	pradFrontendState.deleteFormulaValue( key );
	handleFormulaBlockPricing();
}

export {
	handleFormulaBlockPricing,
	updateFormulaDynamicValues,
	removeFormulaValues,
};
