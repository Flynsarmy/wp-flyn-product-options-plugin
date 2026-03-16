import { handleDefaultValue } from './utility/handleDefault';
import pradFrontendState from './state';
import { fieldLogic } from './utility/handleFieldLogic';
import { fieldWarning } from './utility/fieldWarnings';
import handleVariationPrice from './utility/variations';
import { fieldCompatibility } from './utility/compatibility';
import { initFields } from './handlers/initFields';
import { updateFormulaDynamicValues } from './handlers/formula';
import { initAnalytics } from './utility/analytics';
import { fieldPrice } from './utility/priceHandler';

const $ = jQuery;

/**
 * Main initialization function for WowActions
 * Orchestrates the startup of all frontend subsystems
 *
 * @function initWowActions
 * @description Sets up field handlers, state management, and compatibility layers
 * @since 1.0.0
 */
export function initWowActions() {
	initFields.initialize();
	initializeState();
	fieldCompatibility.initCompatibility();
	fieldWarning.initFieldWarnings();
	initAnalytics();
}

/**
 * Initialize application state and core functionality
 * Sets up base prices, field logic, and default values
 *
 * @function initializeState
 * @private
 * @since 1.0.0
 */
const initializeState = () => {
	const basePrice = Number( $( '#prad_base_price' ).text() );
	pradFrontendState.updateBasePrice( basePrice );
	updateFormulaDynamicValues( 'product_price', basePrice );
	const basePricePercentage = Number(
		$( '#prad_base_price_percentage' ).text()
	);
	pradFrontendState.updateBasePricePercentage( basePricePercentage );

	handleDefaultValue();
	fieldLogic.renderFieldLogicData();
	fieldWarning.renderFieldWarning();
	fieldLogic.handleFieldConditionalFieldShow();

	handleVariationPrice();
	fieldPrice.updateOptionPrice();
};
