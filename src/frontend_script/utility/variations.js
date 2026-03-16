import pradFrontendState from '../state';
import { buildPriceHtml } from './helper';
import { fieldPrice } from './priceHandler';
const $ = jQuery;

/**
 * Handles variation price changes when a variation is selected.
 * Updates the base price and percentage-based price, then recalculates field prices.
 *
 * @function handleVariationPrice
 * @return {void}
 */
const handleVariationPrice = () => {
	const data = $( '#prad_variations_list' ).attr( 'data-variations' );
	const variationsList = data ? JSON.parse( data ) : {};

	const dataPercentage = $( '#prad_variations_list_percentage' ).attr(
		'data-variations'
	);
	const variationsListPercentage = dataPercentage
		? JSON.parse( dataPercentage )
		: {};

	$( document ).on( 'change', '.variation_id', function () {
		const basePrice =
			$( this ).val() &&
			Object.prototype.hasOwnProperty.call(
				variationsList,
				$( this ).val()
			)
				? Number( variationsList[ $( this ).val() ] )
				: '';
		if ( basePrice ) {
			pradFrontendState.updateBasePrice( basePrice );
			pradFrontendState.updateFormulaDynamicValue(
				'product_price',
				basePrice
			);
		}

		const basePricePercentage =
			$( this ).val() &&
			Object.prototype.hasOwnProperty.call(
				variationsListPercentage,
				$( this ).val()
			)
				? Number( variationsListPercentage[ $( this ).val() ] )
				: '';
		if ( basePricePercentage ) {
			pradFrontendState.updateBasePricePercentage( basePricePercentage );
		}

		fieldPrice.updateOptionPrice();
		handlePercentageBasedPriceHtmlOnVariationChange();
		recalculateOptionPriceCosts();
		fieldPrice.updateOptionPrice();
	} );
};

export default handleVariationPrice;

/**
 * Recalculates the cost values for all fields in pradFrontendState.optionPriceObj
 * when variation changes. This ensures percentage-based costs are updated with the new base price.
 *
 * @function recalculateOptionPriceCosts
 * @return {void}
 */
function recalculateOptionPriceCosts() {
	const optionPriceObj = pradFrontendState.optionPriceObj || {};

	Object.keys( optionPriceObj ).forEach( ( fieldKey ) => {
		const field = optionPriceObj[ fieldKey ];

		const $fieldElement = $( `.prad-parent[data-bid="${ fieldKey }"]` );
		if ( ! $fieldElement.length ) {
			return;
		}

		const bType = field.type;
		let fieldCost = field.cost;
		if (
			[
				'radio',
				'checkbox',
				'switch',
				'select',
				'button',
				'img_switch',
				'color_switch',
			].includes( bType )
		) {
			switch ( bType ) {
				case 'radio':
				case 'checkbox':
				case 'switch':
				case 'select':
				case 'button':
				case 'img_switch':
				case 'color_switch':
					if ( Array.isArray( field._vDatas ) ) {
						fieldCost = field._vDatas.map( ( vData, index ) => {
							const $optionElement = $fieldElement.find(
								`input[data-index="${ vData }"], .prad-select-options .prad-select-option[data-index="${ vData }"]`
							);
							if (
								$optionElement.length &&
								$optionElement.attr( 'data-ptype' ) ===
									'percentage'
							) {
								const rawCost = parseFloat(
									$optionElement.attr(
										bType === 'select'
											? 'data-value'
											: 'value'
									) || 0
								);
								return fieldPrice.calculatePriceTypeBaseCost( {
									pType: 'percentage',
									cost: rawCost,
								} );
							}
							return field.cost[ index ];
						} );
					}
					break;
			}
		} else {
			const pType = $fieldElement.attr( 'data-ptype' );
			if ( pType === 'percentage' ) {
				const rawCost = parseFloat(
					$fieldElement.attr( 'data-val' ) || 0
				);
				fieldCost = fieldPrice.calculatePriceTypeBaseCost( {
					pType: 'percentage',
					cost: rawCost,
				} );
			}
		}
		field.cost = fieldCost;
	} );

	// Update the state with recalculated costs
	pradFrontendState.replaceOptionPriceObject( optionPriceObj );
}

/**
 * Updates percentage-based field price displays when variation changes.
 * Iterates through all percentage-based fields and recalculates their displayed prices.
 *
 * @function handlePercentageBasedPriceHtmlOnVariationChange
 * @return {void}
 */
function handlePercentageBasedPriceHtmlOnVariationChange() {
	$( '.prad-parent [data-ptype="percentage"]' ).each( function () {
		const $this = $( this );
		const bType = $this.closest( '.prad-parent' ).attr( 'data-btype' );
		const price = fieldPrice.calculatePriceTypeBaseCost( {
			pType: 'percentage',
			cost:
				$this.attr( bType === 'select' ? 'data-value' : 'value' ) || 0,
		} );
		let $selector = '';
		switch ( bType ) {
			case 'radio':
			case 'switch':
			case 'checkbox':
				$selector = $this
					.closest( `.prad-${ bType }-item-wrapper` )
					.find( '.prad-block-price .pricex' );
				break;
			case 'select': {
				$selector = $this
					.closest( '.prad-select-option' )
					.find( '.prad-block-price .pricex' );
				const selectedIndex = $this.attr( 'data-index' );
				const $selectedOption = $this
					.closest( `.prad-parent` )
					.find(
						`.prad-custom-select[data-selected="${ selectedIndex }"] .prad-select-box-item .prad-block-price .pricex`
					);
				if ( $selectedOption ) {
					$selectedOption.html( buildPriceHtml( price ) );
				}

				break;
			}

			case 'button':
				$selector = $this
					.closest( '.prad-button-container' )
					.find( '.prad-block-price .pricex' );
				break;
			case 'img_switch':
			case 'color_switch':
				$selector = $this
					.closest( '.prad-swatch-item-wrapper' )
					.find( '.prad-block-price .pricex' );
				break;
		}

		if ( $selector ) {
			$selector.html( buildPriceHtml( price ) );
		}
	} );

	$( '.prad-parent[data-ptype="percentage"]' ).each( function () {
		const $this = $( this );
		const price = fieldPrice.calculatePriceTypeBaseCost( {
			pType: 'percentage',
			cost: $this.attr( 'data-val' ) || 0,
		} );
		$this
			.find( '.prad-block-price .pricex' )
			.html( buildPriceHtml( price ) );
	} );
}
