import pradFrontendState from '../state';
import { fieldPrice } from '../utility/priceHandler';
import {
	handleFormulaBlockPricing,
	removeFormulaValues,
	updateFormulaDynamicValues,
} from './formula';

const $ = jQuery;
export const initBlockRange = () => {
	rangeHandler();
	$( '.prad-parent input[type="range"]' ).on( 'change', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );
		const _val = Number( $this.val() );
		const bid = $parent.attr( 'data-bid' );

		if ( _val !== 0 ) {
			fieldPrice.updateOptionPriceObj( bid, {
				label: $parent.attr( 'data-label' ),
				type: 'range',
				optionid: $parent
					.closest( '.prad-blocks-container' )
					.attr( 'data-optionid' ),
				sectionid: $parent.attr( 'data-sectionid' ),
				value: _val,
				cost: fieldPrice.calculatePriceTypeBaseCost( {
					pType: $parent.attr( 'data-ptype' ),
					value: _val,
					cost: Number( $this.attr( 'data-val' ) ),
				} ),
			} );
			updateFormulaDynamicValues( bid, _val );
		} else {
			pradFrontendState.deleteOptionPriceObj( bid );
			fieldPrice.updateOptionPrice( bid );
			removeFormulaValues( bid );
		}

		// Handle Formula block Calculation
		handleFormulaBlockPricing();
	} );
};

const rangeHandler = () => {
	$(
		'.prad-block-range input[type="range"], .prad-block-range input[type="number"]'
	).on( 'input', function () {
		const $this = $( this );
		const $parent = $this.closest( '.prad-parent' );

		if ( $this.attr( 'type' ) === 'range' ) {
			$parent.find( 'input[type="number"]' ).val( Number( $this.val() ) );
		} else if ( $this.attr( 'type' ) === 'number' ) {
			$parent
				.find( 'input[type="range"]' )
				.val( Number( $this.val() ) )
				.trigger( 'change' )
				.trigger( 'input' );
		}

		if ( $this.attr( 'type' ) === 'range' ) {
			const minValue = $this.attr( 'min' );
			const maxValue = $this.attr( 'max' );
			const rangeValue =
				( parseFloat( $this.val() - minValue ) /
					( maxValue - minValue ) ) *
				100;
			$this.css( '--range-value', `${ rangeValue }%` );
		}
	} );
	$( '.prad-block-range input[type="range"]' ).each( function () {
		const $slider = $( this );
		const baseValue = parseFloat( $slider.val() );
		const minValue = $slider.attr( 'min' );
		const maxValue = $slider.attr( 'max' );
		const rangeValue =
			( ( baseValue - minValue ) / ( maxValue - minValue ) ) * 100;
		$slider.css( '--range-value', `${ rangeValue }%` );
	} );
};
