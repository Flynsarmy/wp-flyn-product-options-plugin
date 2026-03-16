import pradFrontendState from '../state';
import { fieldCompatibility } from './compatibility';
import { fieldWarning } from './fieldWarnings';
import { fieldLogic } from './handleFieldLogic';
import { buildPriceHtml, getCurrencyConvertedPrice } from './helper';

const $ = jQuery;

/**
 * @typedef {Object} PriceCalculationData
 * @property {string} pType - Price type (per_unit, percentage, etc.)
 * @property {*}      value - The value to calculate price for
 * @property {number} cost  - The base cost
 */

/**
 * Calculate price based on price type and value
 * Handles different pricing models like per unit, percentage, per character, etc.
 *
 * @function calculatePriceTypeBaseCost
 * @param {PriceCalculationData} data - The price calculation data
 * @return {number} The calculated price
 */
const calculatePriceTypeBaseCost = ( data ) => {
	const { pType, value, cost } = data;
	let baseValue = Number( value ) || 1;
	const baseCost = Number(
		pType === 'percentage' ? cost : getCurrencyConvertedPrice( cost || 0 )
	);
	let price = 0;
	if (
		! prad_option_front.isActive &&
		[ 'per_unit', 'per_word', 'per_char_no_space' ].includes( pType )
	) {
		return baseCost;
	}

	switch ( pType ) {
		case 'per_unit':
			baseValue = Math.abs( baseValue );
			price = baseValue * baseCost;
			break;
		case 'per_char':
			price = value ? value.length * baseCost : 0;
			break;
		case 'per_char_no_space':
			price = value ? value.replace( /\s+/g, '' ).length * baseCost : 0;
			break;
		case 'per_word':
			price = value ? value.trim().split( /\s+/ ).length * baseCost : 0;
			break;
		case 'percentage':
			price =
				( ( Number( pradFrontendState.basePricePercentage ) || 0 ) *
					baseCost ) /
				100;
			break;
		case 'no_cost':
			price = 0;
			break;
		default:
			price = baseCost;
			break;
	}

	return price;
};

/**
 * Update option price object and trigger price recalculation
 *
 * @function updateOptionPriceObj
 * @param {string} key   - The option identifier
 * @param {Object} value - The price data object
 */
function updateOptionPriceObj( key, value ) {
	pradFrontendState.updateOptionPriceObj( key, value );
	updateOptionPrice( key );
}

/**
 * Calculate and update total option pricing
 * Handles field logic, warnings, and updates UI elements
 *
 * @function updateOptionPrice
 * @param {string} _id - The field identifier that triggered the update
 * @since 1.0.0
 */
function updateOptionPrice( _id ) {
	fieldLogic.handleFieldConditionalFieldShow();
	fieldWarning.showMinMaxWarnings( _id ?? null );
	fieldWarning.showReqWarnings( _id ?? null );

	let optionPrice = 0;
	let string = '';
	for ( const key in pradFrontendState.optionPriceObj ) {
		// eslint-disable-next-line no-prototype-builtins
		if ( pradFrontendState.optionPriceObj.hasOwnProperty( key ) ) {
			let price = pradFrontendState.optionPriceObj[ key ].cost;

			if ( Array.isArray( price ) && price.length ) {
				price = price.reduce(
					( total, num ) => total + Number( num ),
					0
				);
			} else if ( ! Array.isArray( price ) ) {
				price = Number( price ) || 0;
			} else {
				pradFrontendState.deleteOptionPriceObj( key );
				continue;
			}

			// eslint-disable-next-line no-unused-vars
			string += ' + ' + String( price );
			optionPrice += price;
		}
	}

	$( '#prad_option_price' ).html( buildPriceHtml( optionPrice ) );
	$( '#prad_option_total_price' ).html(
		buildPriceHtml( optionPrice + pradFrontendState.basePrice || 0 )
	);
	$( '#prad_selection' ).val(
		JSON.stringify(
			sortedSelectionReturn( pradFrontendState.optionPriceObj )
		)
	);

	$( '#prad_option_total_price').trigger('flynpo_price_updated', [pradFrontendState.basePrice + optionPrice]);

	const items = [];
	Object.values( pradFrontendState.addAbleProductsObj ).forEach( ( arr ) => {
		arr.forEach( ( item ) => items.push( item ) );
	} );
	$( '#prad_products_selection' ).val( JSON.stringify( items ) );



	fieldCompatibility.FlycartTrigger(
		optionPrice,
		pradFrontendState.basePrice
	);
}

/**
 * Sort selection object based on field order in DOM
 *
 * @function sortedSelectionReturn
 * @param {Object} selection - The selection object to sort
 * @return {Object} Sorted selection object
 */
function sortedSelectionReturn( selection ) {
	const bidOrder = {};
	$( '.prad-parent' ).each( function ( index ) {
		const bid = $( this ).data( 'bid' );
		if ( bid ) {
			bidOrder[ bid ] = index + 1; // order starts from 1
		}
	} );

	const sortedSelection = Object.fromEntries(
		Object.entries( selection ).sort( ( [ keyA ], [ keyB ] ) => {
			return (
				( bidOrder[ keyA ] ?? Infinity ) -
				( bidOrder[ keyB ] ?? Infinity )
			);
		} )
	);

	return sortedSelection;
}

export const fieldPrice = {
	calculatePriceTypeBaseCost,
	updateOptionPriceObj,
	updateOptionPrice,
};
