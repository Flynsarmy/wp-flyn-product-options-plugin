import pradFrontendState from '../state';
import { setDefaultValue } from './handleDefault';
import { handleDateTimeConditions } from './logic_helper/dateTimeLogic';

const $ = jQuery;

const resetInputSelection = ( parentSelector, isSection ) => {
	if ( isSection ) {
		$( `${ parentSelector } .prad-parent` ).each( function () {
			const $block = $( this );
			fieldResetHandlers( $block );
		} );
	} else {
		fieldResetHandlers( $( parentSelector ) );
	}
	$( `${ parentSelector }` ).addClass( 'prad-field-none' );
};

const fieldResetHandlers = ( $block ) => {
	const blockType = $block.attr( 'data-btype' );

	switch ( blockType ) {
		case 'radio':
		case 'checkbox':
		case 'switch':
		case 'img_switch':
		case 'color_switch':
		case 'button':
			$block
				.find( 'input[type="checkbox"], input[type="radio"]' )
				.prop( 'checked', false );
			break;
		case 'select': {
			// Reset custom select to no selection
			const $parent = $block.find( '.prad-custom-select' );
			$parent.removeAttr( 'data-selected' );
			$parent.find( '.prad-select-option' ).removeClass( 'prad-active' );
			$parent
				.find( '.prad-select-box-item' )
				.html(
					$parent
						.find( '.prad-select-box-item' )
						.attr( 'data-placeholder' ) || 'Select an option'
				);
			break;
		}
		case 'number':
		case 'url':
		case 'email':
		case 'telephone':
		case 'textfield':
		case 'textarea':
			$block
				.find(
					'input[type="text"], input[type="number"], input[type="email"], input[type="url"], input[type="tel"], textarea'
				)
				.val( '' );
			break;
		case 'range': {
			$block.find( 'input[type="number"]' ).val( '' );
			const $currentRange = $block.find( 'input[type="range"]' );
			if ( $currentRange.length ) {
				const min = $currentRange.attr( 'min' ) || 0;
				$currentRange.val( min );
				$currentRange.css( '--range-value', '0%' );
			}
			break;
		}
		case 'date':
		case 'time':
		case 'datetime':
			$block.find( 'input[type="text"]' ).val( '' );
			break;
		case 'color_picker':
			$block.find( 'input[type="color"]' ).val( '' );
			$block.find( 'input[type="text"]' ).val( '' );
			break;
		case 'upload':
			$block.find( 'input[type="file"]' ).val( '' );
			$block.find( '.prad-upload-result' ).remove();
			break;
	}
};

/**
 * Scan DOM for fields with logic enabled and store their conditions
 * Builds the field condition registry from DOM data attributes
 *
 * @function renderFieldLogicData
 */
const renderFieldLogicData = () => {
	$( '.prad-parent' ).each( function () {
		const $this = $( this );
		const bid = $this.data( 'bid' );
		const enLogic = $this.data( 'enlogic' );
		const bType = $this.data( 'btype' );
		const fieldConditions = $this.data( 'fieldconditions' );

		if ( enLogic === 'yes' ) {
			pradFrontendState.updateFieldCondition( bid, {
				enLogic,
				isSection: bType === 'section',
				fieldconditions: fieldConditions,
			} );
		}
	} );
};

/**
 * Handle conditional field visibility based on field logic rules
 * Evaluates all field conditions and shows/hides fields accordingly
 *
 * @function handleFieldConditionalFieldShow
 */
const handleFieldConditionalFieldShow = () => {
	Object.entries( pradFrontendState.allFieldCondition ).forEach(
		( [ objKey, objValue ] ) => {
			const { enLogic, isSection, fieldconditions } = objValue;
			if ( enLogic !== 'yes' || ! fieldconditions?.rules?.length ) {
				return;
			}

			const { condition, rules } = fieldconditions;
			const matched = matchConditions(
				condition?.match || 'any',
				rules,
				objKey
			);
			const $field = $( `[data-bid="${ objKey }"]` );

			/**
			 * Hide field and clean up its pricing data
			 *
			 * @function hideField
			 * @private
			 */
			function hideField() {
				if ( isSection ) {
					removePriceUnderSections( objKey );
				} else {
					pradFrontendState.deleteOptionPriceObj( objKey );
				}
				resetInputSelection( `[data-bid="${ objKey }"]`, isSection );
				$field.addClass( 'prad-field-none' );
			}

			/**
			 * Show field and restore its default value if needed
			 *
			 * @function showField
			 * @private
			 */
			function showField() {
				if ( $field.hasClass( 'prad-field-none' ) ) {
					$field.removeClass( 'prad-field-none' );
					handleFieldShowDefValue( objKey, isSection );
				}
			}

			if ( condition?.visibility === 'hide' ) {
				matched ? hideField() : showField();
			} else {
				matched ? showField() : hideField();
			}
		}
	);
};

const handleFieldShowDefValue = ( fieldId, isSection ) => {
	const $field = $( `[data-bid="${ fieldId }"]` );
	if ( isSection ) {
		$field.find( '.prad-parent:not(.prad-field-none)' ).each( function () {
			const $singleField = $( this );
			if (
				$singleField.parents( '.prad-parent.prad-field-none' )
					.length === 0
			) {
				setShowFieldDefValue( $singleField );
			}
		} );
	} else {
		setShowFieldDefValue( $field );
	}
};

const setShowFieldDefValue = ( $elementBlock ) => {
	const fieldType = $elementBlock.data( 'btype' );
	const defaultVal = $elementBlock.data( 'defval' );
	if ( defaultVal ) {
		setDefaultValue(
			{
				type: fieldType,
				value: defaultVal,
			},
			$elementBlock.attr( 'data-bid' )
		);
	}
};

/**
 * @namespace fieldLogic
 * @description Field logic utilities for conditional field management
 */
export const fieldLogic = {
	renderFieldLogicData,
	handleFieldConditionalFieldShow,
};

/**
 * Evaluate field conditions to determine if they match
 *
 * @function matchConditions
 * @param {string} match - Match type ('any' or 'all')
 * @param {Array}  rules - Array of condition rules to evaluate
 * @return {boolean} True if conditions match according to match type
 */
function matchConditions( match, rules ) {
	let matchAll = 0;

	rules.forEach( function ( rule ) {
		const { compare, field, value } = rule;
		const targetValue = pradFrontendState.optionPriceObj[ field ]?.value;
		let _matching = false;

		const targetBtype = $( `[data-bid="${ field }"]` ).data( 'btype' );

		if ( [ 'date', 'datetime', 'time' ].includes( targetBtype ) ) {
			_matching = handleDateTimeConditions(
				compare,
				targetValue,
				value,
				targetBtype
			);
		} else {
			_matching = handleOtherConditions(
				compare,
				targetValue,
				value,
				targetBtype
			);
		}

		if ( _matching ) {
			matchAll++;
		}
	} );

	return match === 'any' ? matchAll > 0 : matchAll === rules.length;
}

/**
 * Handles date and time condition logic for field validation
 * @param {string}               compare     - The comparison operator
 * @param {string|string[]|Date} targetValue - The target value to compare against. The value of the other field.
 * @param {string|Object}        value       - The value to compare. The current field's condition value.
 * @param {string}               targetBtype - The target field type
 * @return {boolean} Returns true if the condition matches, false otherwise
 */
function handleOtherConditions( compare, targetValue, value, targetBtype ) {
	let _matching = false;
	let intTarget;
	let intValue;

	switch ( compare ) {
		case '_is':
		case '_not_is':
			if ( targetBtype === 'switch' ) {
				if ( value == 'true' ) {
					_matching = Array.isArray( targetValue )
						? targetValue.length > 0
						: targetValue
						? true
						: false;
				} else {
					_matching = Array.isArray( targetValue )
						? targetValue.length === 0
						: targetValue
						? false
						: true;
				}
			} else if ( Array.isArray( targetValue ) ) {
				_matching = targetValue.some( function ( val ) {
					return val.label !== undefined
						? val.label == value
						: val == value;
				} );
			} else {
				_matching = value == targetValue;
			}
			_matching = compare === '_is' ? _matching : ! _matching;
			break;

		case '_in':
		case '_not_in':
			if ( Array.isArray( targetValue ) ) {
				_matching = targetValue.some( function ( val ) {
					return value.includes(
						val.label !== undefined ? val.label : val
					);
				} );
			} else {
				_matching = value?.includes( targetValue );
			}
			_matching = compare === '_in' ? _matching : ! _matching;
			break;

		case '_empty':
		case '_not_empty':
			if ( targetValue === undefined || targetValue === null ) {
				_matching = true;
			} else if ( typeof targetValue === 'object' ) {
				_matching = Object.keys( targetValue ).length === 0;
			} else {
				_matching = targetValue?.length === 0;
			}
			_matching = compare === '_empty' ? _matching : ! _matching;
			break;

		case '_contains':
		case '_not_contains':
			if ( Array.isArray( targetValue ) ) {
				_matching = targetValue.some( function ( val ) {
					return val.includes( value );
				} );
			} else {
				_matching = targetValue?.includes( value );
			}
			_matching = compare === '_contains' ? _matching : ! _matching;
			break;

		case '_less':
		case '_less_equal':
		case '_greater':
		case '_greater_equal':
			intTarget = Number( targetValue );
			intValue = Number( value );
			if ( compare === '_less' ) {
				_matching = intTarget < intValue;
			} else if ( compare === '_less_equal' ) {
				_matching = intTarget <= intValue;
			} else if ( compare === '_greater' ) {
				_matching = intTarget > intValue;
			} else if ( compare === '_greater_equal' ) {
				_matching = intTarget >= intValue;
			}
			break;
	}
	return _matching;
}

function removePriceUnderSections( sectionId ) {
	const updatedObj = Object.fromEntries(
		Object.entries( pradFrontendState.getOptionPriceObj() ).filter(
			( [ key ] ) =>
				$( `[data-bid="${ sectionId }"]` ).find(
					`[data-bid="${ key }"]`
				).length === 0
		)
	);
	pradFrontendState.replaceOptionPriceObject( updatedObj );
}
