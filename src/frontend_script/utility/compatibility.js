import { fieldWarning } from './fieldWarnings';

const $ = jQuery;

const initCompatibility = () => {
	initElesseiThemeCompatibility();
	initDiscountRuleForWooByFlycart();
};

function FlycartTrigger( optionPrice, basePrice ) {
	// Discount Rules for WooCommerce by Flycart
	if ( $.AdvanceWooDiscountRules ) {
		const $targets = $( '#prad_option_total_price' );
		$targets.attr( 'data-lock', true );
		$.AdvanceWooDiscountRules.getDynamicDiscountPriceFromCartForm(
			$( '#prad_option_total_price' ).closest( 'form' ),
			$targets,
			{
				custom_price: optionPrice + basePrice || 0,
				original_price: optionPrice + basePrice || 0,
			}
		);
	}
}

const initElesseiThemeCompatibility = () => {
	$( document ).on(
		'mouseup',
		'form.cart .single_add_to_cart_button, .ns_btn-fixed .single_add_to_cart_button',
		function ( e ) {
			fieldWarning.handleFormSubmission( e, 'mouse' );
		}
	);

	$( document ).on(
		'mousedown',
		'form.cart .single_add_to_cart_button, .ns_btn-fixed .single_add_to_cart_button',
		function ( e ) {
			fieldWarning.handleFormSubmission( e, 'mouse' );
		}
	);
};

/**
 * Initializes compatibility with the "Woo Discount Rules by Flycart" plugin.
 *
 * Attaches an event listener to the document body for the
 * 'advanced_woo_discount_rules_on_get_response_for_dynamic_discount' event.
 * When triggered, it updates the target element's HTML to display the initial and discounted prices,
 * and unlocks the target element by removing the data-lock attribute.
 *
 * @function
 * @memberof module:frontend_script/utility/compatibility
 */
const initDiscountRuleForWooByFlycart = () => {
	$( document.body ).on(
		'advanced_woo_discount_rules_on_get_response_for_dynamic_discount',
		function ( e, response, target ) {
			if ( response.success === true ) {
				let price_html = '';
				if ( response.data !== undefined ) {
					if (
						response.data.initial_price_html !== undefined &&
						response.data.discounted_price_html !== undefined
					) {
						price_html +=
							'<del>' +
							response.data.initial_price_html +
							'</del>';
						price_html +=
							' <ins>' +
							response.data.discounted_price_html +
							'</ins>';
						target.html( price_html );
					}
				}
			}
			target.attr( 'data-lock', false );
		}
	);
};

export const fieldCompatibility = {
	initCompatibility,
	FlycartTrigger,
};
