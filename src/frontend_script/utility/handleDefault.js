import { isValidJSON } from './helper';

const $ = jQuery;

/**
 * Handles setting default values for form elements by rendering default values
 * and applying them to their corresponding elements.
 *
 * This function retrieves default values through renderDefaultValue() and iterates
 * through each value to set it on the appropriate element using setDefaultValue().
 *
 * @function handleDefaultValue
 * @return {void}
 */
const handleDefaultValue = () => {
	const defValues = renderDefaultValue();
	for ( const id in defValues ) {
		setDefaultValue( defValues[ id ], id );
	}
};

/**
 * Sets default values for various form input types based on the provided block definition.
 * Supports radio buttons, switches, checkboxes, selects, ranges, color pickers, and text inputs.
 *
 * @param {Object}              blockDefValue       - The block definition containing type and value information
 * @param {string}              blockDefValue.type  - The type of input element (radio, checkbox, select, range, etc.)
 * @param {string|number|Array} blockDefValue.value - The default value(s) to set for the input
 * @param {string}              id                  - The block ID used to target the specific form elements via data-bid attribute
 *
 * @description
 * This function handles setting default values for different input types:
 * - radio: Sets checked state for radio button at specified index
 * - img_switch/color_switch/button: Sets checked state for checkboxes or radio buttons
 * - switch/checkbox: Sets checked state for switch or multiple checkboxes
 * - select: Sets selected option and updates custom select display
 * - range: Sets slider value and triggers input events
 * - color_picker: Sets color value, parsing JSON if needed
 * - text/textarea/number/url/email: Sets input field values
 */
const setDefaultValue = ( blockDefValue, id ) => {
	const { type, value } = blockDefValue || {};
	switch ( type ) {
		case 'radio': {
			const $radio = $(
				`.prad-parent[data-bid="${ id }"] input[type="radio"][data-index="${ value?.[ 0 ] }"]`
			);
			if ( $radio.length ) {
				$radio.prop( 'checked', true ).trigger( 'change' );
			}
			break;
		}
		case 'img_switch':
		case 'color_switch':
		case 'button': {
			const $checkboxes = $(
				`.prad-parent[data-bid="${ id }"] input[type="checkbox"]`
			);
			if ( $checkboxes.length ) {
				value?.forEach( ( index ) => {
					const $button = $checkboxes.filter(
						`[data-index="${ index }"]`
					);
					if ( $button.length ) {
						$button.prop( 'checked', true ).trigger( 'change' );
					}
				} );
			} else {
				$(
					`.prad-parent[data-bid="${ id }"] input[type="radio"][data-index="${ value?.[ 0 ] }"]`
				)
					.prop( 'checked', true )
					.trigger( 'change' );
			}
			break;
		}
		case 'switch':
		case 'checkbox': {
			if ( type === 'switch' ) {
				$(
					`.prad-parent[data-bid="${ id }"] input[type="checkbox"][data-index="${ value[ 0 ] }"]`
				)
					.prop( 'checked', true )
					.trigger( 'change' );
			} else {
				const $checkboxes = $(
					`.prad-parent[data-bid="${ id }"] input[type="checkbox"]`
				);
				if ( $checkboxes.length ) {
					value?.forEach( ( index ) => {
						const $button = $checkboxes.filter(
							`[data-index="${ index }"]`
						);
						if ( $button.length ) {
							$button.prop( 'checked', true ).trigger( 'change' );
						}
					} );
				}
			}

			break;
		}
		case 'font_picker':
		case 'select': {
			const $option = $(
				`.prad-parent[data-bid="${ id }"] .prad-custom-select .prad-select-option[data-index="${ value[ 0 ] }"]`
			);
			const $parent = $option.closest( '.prad-custom-select' );
			$parent.attr( 'data-selected', value[ 0 ] );
			// Manage active class
			$parent.find( '.prad-select-option' ).removeClass( 'prad-active' );
			$option.addClass( 'prad-active' );
			const selectedText = $option.html();
			$parent
				.find( '.prad-select-box-item' )
				.html( selectedText )
				.trigger( 'change' );

			break;
		}
		case 'range': {
			const $range = $(
				`.prad-parent[data-bid="${ id }"] input[type="range"]`
			);

			if ( $range.length ) {
				$range
					.val( Number( value ) )
					.trigger( 'input' )
					.trigger( 'change' );
			}
			break;
		}
		case 'color_picker': {
			const $color = $(
				`.prad-parent[data-bid="${ id }"] input[type="color"]`
			);
			const _value = isValidJSON( value ) ? JSON.parse( value ) : value;
			if ( $color.length && _value ) {
				$color.val( _value ).trigger( 'input' ).trigger( 'change' );
			}
			break;
		}
		case 'number':
		case 'url':
		case 'email':
		case 'text':
		case 'textarea': {
			const inputType = type === 'telephone' ? 'tel' : type;
			const $input = $(
				`.prad-parent[data-bid="${ id }"] input[type="${ inputType }"], .prad-parent[data-bid="${ id }"] textarea`
			);

			if ( $input.length ) {
				$input.val( String( value ) ).trigger( 'input' );
			}
			break;
		}
		default:
			break;
	}
};

/**
 * Renders default values for product add-on elements by iterating through elements with 'prad-parent' class.
 * Extracts block ID, block type, and default value from each element's data attributes.
 *
 * @return {Object} An object containing default values indexed by block ID, where each entry has:
 *   - type: The block type from data-btype attribute
 *   - value: The default value from data-defval attribute
 */
const renderDefaultValue = () => {
	const defs = [];
	$( '.prad-parent' ).each( function () {
		const $this = $( this );
		const bid = $this.data( 'bid' );
		const bType = $this.data( 'btype' );
		const defaultVal = $this.data( 'defval' );

		if ( defaultVal ) {
			defs[ bid ] = {
				type: bType,
				value: defaultVal,
			};
		}
	} );
	return defs;
};

export { setDefaultValue, handleDefaultValue };
