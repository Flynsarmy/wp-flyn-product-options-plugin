const _fieldCommon = [
	'color',
	'bold',
	'italic',
	'underline',
	'size',
	'height',
	'case',
	'class',
	'id',
];

/**
 * Generate Title CSS Styles
 *
 * @param {Object}  settings
 * @param {string}  settings.color
 * @param {number}  settings.size
 * @param {number}  settings.height
 * @param {boolean} settings.bold
 * @param {boolean} settings.italic
 * @param {string}  settings.case
 * @param {boolean} settings.underline
 *
 * @return {Object} return css.
 */
const titleCSS = ( settings ) => {
	return {
		color: settings.color,
		fontSize: settings.size + 'px',
		lineHeight: settings.height + 'px',
		fontWeight: settings.bold ? 'bold' : 'normal',
		fontStyle: settings.italic ? 'italic' : 'normal',
		textTransform: settings.case ? settings.case : 'none',
		textDecoration: settings.underline ? 'underline' : 'none',
	};
};

/**
 * Update Field Data
 * This function updates the field data at a specific position within the fieldData array.
 *
 * @param {Function} setFieldData
 * @param {Array}    fieldData
 * @param {Object}   settings
 * @param {number}   position
 * @param {string}   type
 * @param {any}      val
 */
const _setFieldData = (
	setFieldData,
	fieldData,
	settings,
	position,
	type,
	val
) => {
	let final = [ ...fieldData ];
	if ( settings.sectionid ) {
		final = updateBlockAttr( {
			allBlocks: [ ...fieldData ],
			blockid: settings.blockid,
			objKey: type,
			objValue: val,
		} );
	} else {
		const updatedFields =
			typeof type === 'object' ? type : { [ type ]: val };
		const _val = { ...settings, ...updatedFields };
		final.splice( position, 1, _val );
	}
	setFieldData( final );
};

/**
 * Generate a Unique Block ID
 * Generates a unique blockid using the current timestamp and a random string.
 * The blockid format consists of part of the timestamp and a random string.
 *
 * @return {string} return new blockid
 */
const _getnerateBlockid = () => {
	const dateString = Date.now().toString( 36 );
	return (
		dateString.slice( 0, 1 ) +
		dateString.slice( -3 ) +
		'-' +
		Math.random().toString( 36 ).substring( 2, 8 )
	);
};

/**
 * Update Block Attribute
 * Updates a specific attribute of a block with the given blockid in the allBlocks array.
 *
 * @param {Object} params
 * @param {Array}  params.allBlocks
 * @param {string} params.blockid
 * @param {string} params.objKey
 * @param {any}    params.objValue
 *
 * @return {Array} update attributes
 */
const updateBlockAttr = ( params ) => {
	const { allBlocks, blockid, objKey, objValue } = params;

	return allBlocks.map( ( block ) => {
		if ( block.blockid === blockid ) {
			const updatedFields =
				typeof objKey === 'object' ? objKey : { [ objKey ]: objValue };
			return { ...block, ...updatedFields };
		}
		if ( block.innerBlocks && block.innerBlocks?.length ) {
			return {
				...block,
				innerBlocks: updateBlockAttr( {
					allBlocks: block.innerBlocks,
					blockid,
					objKey,
					objValue,
				} ),
			};
		}
		return block;
	} );
};

/**
 * Duplicate Block
 * Duplicates the block with the specified blockid and appends it to the array.
 * The new block will have a modified blockid to ensure uniqueness.
 *
 * @param {Object} params
 * @param {Array}  params.allBlocks
 * @param {string} params.blockid
 *
 *  @return {Array} array of all blocks
 */
const duplicateBlock = ( params ) => {
	const { allBlocks, blockid } = params;
	return allBlocks
		.map( ( block ) => {
			if ( block.blockid == blockid ) {
				if ( block.type === 'section' ) {
					return [
						block,
						updateInnerBlockIds( {
							...block,
							label: ( block.label || ' ' ) + ' Copy',
						} ),
					];
				}
				return [
					block,
					{
						...block,
						label: ( block.label || ' ' ) + ' Copy',
						blockid: _getnerateBlockid(),
					},
				];
			}
			if ( block.innerBlocks && block.innerBlocks?.length ) {
				return {
					...block,
					innerBlocks: duplicateBlock( {
						allBlocks: block.innerBlocks,
						blockid,
					} ),
				};
			}
			return block;
		} )
		.flat();
};

/**
 *  ===== Update Inner Block IDs =====
 *  Updates the blockid for inner blocks and assigns a parentSectionId.
 *
 * @param {Object}      _block
 * @param {string|null} _parentSectionId
 *  @return {Object} array of blocks
 */
function updateInnerBlockIds( _block, _parentSectionId = null ) {
	function updateObj( block, parentSectionId ) {
		const newBlockId = _getnerateBlockid();
		block = {
			...block,
			blockid: newBlockId,
			...( parentSectionId && { sectionid: parentSectionId } ),
		};
		if ( block.type === 'section' && Array.isArray( block.innerBlocks ) ) {
			block.innerBlocks = block.innerBlocks.map( ( innerBlock ) =>
				updateObj( innerBlock, newBlockId )
			);
		}
		return block;
	}
	return updateObj( _block, _parentSectionId );
}

/**
 *  ===== Remove Block =====
 * @param {Object} params
 * @param {Array}  params.allBlocks
 * @param {string} params.blockid
 */
const removeBlock = ( params ) => {
	const { allBlocks, blockid } = params;
	return allBlocks
		.filter( ( block ) => block.blockid != blockid )
		.map( ( block ) => {
			if ( block.innerBlocks && block.innerBlocks?.length ) {
				return {
					...block,
					innerBlocks: removeBlock( {
						allBlocks: block.innerBlocks,
						blockid,
					} ),
				};
			}
			return block;
		} );
};

/**
 *  ===== Handle Block Actions =====
 * @param {string}   type
 * @param {Object}   data
 * @param {Array}    data.allBlocks
 * @param {string}   data.blockid
 * @param {Function} data.setFieldData
 */
const handleBlockAction = ( type, data ) => {
	const { allBlocks, blockid, setFieldData, objKey, objValue } = data;
	let updated = [ ...allBlocks ];
	if ( type === 'update' ) {
		updated = updateBlockAttr( {
			allBlocks: [ ...updated ],
			blockid,
			objKey,
			objValue,
		} );
	} else if ( type === 'duplicate' ) {
		updated = duplicateBlock( {
			allBlocks: [ ...updated ],
			blockid,
		} );
	} else if ( type === 'remove' ) {
		updated = removeBlock( {
			allBlocks: [ ...updated ],
			blockid,
		} );
	}
	setFieldData( updated );
};

/**
 *  ===== Move element in array =====
 *  **Note: Nested elements are not allowed.**
 *
 * @param {Array}  theArr
 * @param {number} currentIndex
 * @param {number} toIndex
 */
const _moveItemInArray = ( theArr, currentIndex, toIndex ) => {
	const itemsArr = [ ...theArr ];
	const moveableItem = itemsArr[ currentIndex ];
	if ( moveableItem ) {
		const arrayLength = itemsArr.length;
		const indexDiff = currentIndex - toIndex;
		if ( indexDiff > 0 ) {
			return [
				...itemsArr.slice( 0, toIndex ),
				moveableItem,
				...itemsArr.slice( toIndex, currentIndex ),
				...itemsArr.slice( currentIndex + 1, arrayLength ),
			];
		} else if ( indexDiff < 0 ) {
			return [
				...itemsArr.slice( 0, currentIndex ),
				...itemsArr.slice( currentIndex + 1, toIndex + 1 ),
				moveableItem,
				...itemsArr.slice( toIndex + 1, arrayLength ),
			];
		}
	}
	return itemsArr;
};

/**
 *  ===== Move element - handled nested array =====
 *  1. Move within the main array,
 *  2. Move within a section,
 *  3. Move from one section to another.
 *
 * @param {Object} params
 * @param {Array}  params.itemsArr
 * @param {string} params.blockid
 * @param {number} params.toIndex
 * @param {string} [params.appendSectionId]
 */
const moveNestedBlock = ( params ) => {
	const { itemsArr, blockid, toIndex, appendSectionId } = params;
	const shalowItemsArr = JSON.parse( JSON.stringify( itemsArr ) );

	const findTheMoveAbleItem = ( theArr ) => {
		for ( let i = 0; i < theArr?.length; i++ ) {
			if ( theArr[ i ]?.blockid === blockid ) {
				return theArr.splice( i, 1 )[ 0 ];
			}
			if ( theArr[ i ].type === 'section' && theArr[ i ]?.innerBlocks ) {
				const found = findTheMoveAbleItem( theArr[ i ]?.innerBlocks );
				if ( found ) {
					return found;
				}
			}
		}
		return null;
	};

	const moveableItem = findTheMoveAbleItem( shalowItemsArr );
	if ( moveableItem ) {
		let targetArray = shalowItemsArr;
		if ( appendSectionId ) {
			const findTargetSection = ( array ) => {
				for ( const item of array ) {
					if (
						item?.blockid === appendSectionId &&
						item?.innerBlocks
					) {
						return item.innerBlocks;
					}
					if ( item?.type === 'section' && item?.innerBlocks ) {
						const result = findTargetSection( item.innerBlocks );
						if ( result ) {
							return result;
						}
					}
				}
				return null;
			};

			targetArray = findTargetSection( shalowItemsArr );
			if ( ! targetArray ) {
				return shalowItemsArr;
			}
		}
		targetArray.splice( toIndex, 0, moveableItem );

		return shalowItemsArr;
	}
	return shalowItemsArr;
};
/**
 * Updates the block IDs for all blocks in the array.
 *
 * @param {Array}   allBlocks
 *
 * @param {boolean} changeIds
 * @return {Array} array of blocks
 */
const updateOptionBlockIds = ( allBlocks, changeIds = false ) => {
	let changes = {};
	function handleDuplication( blocks, parentBlockId = null ) {
		return blocks.map( ( block ) => {
			const newBlock = { ...block };
			const newBlockId = _getnerateBlockid();
			changes = {
				...changes,
				[ block.blockid ]: newBlockId,
			};
			newBlock.blockid = newBlockId;
			if ( newBlock.type === 'products' ) {
				newBlock.manualProducts = [];
			}

			if ( Array.isArray( newBlock.innerBlocks ) ) {
				newBlock.innerBlocks = handleDuplication(
					newBlock.innerBlocks,
					newBlockId
				);
			}

			if ( parentBlockId && newBlock.sectionid ) {
				newBlock.sectionid = parentBlockId;
			}

			return newBlock;
		} );
	}
	if ( changeIds ) {
		const updated = handleDuplication( allBlocks );
		let jsonString = JSON.stringify( updated );
		for ( const oldKey in changes ) {
			const newKey = changes[ oldKey ];
			jsonString = jsonString.replace(
				new RegExp( oldKey, 'g' ),
				newKey
			);
		}
		const updatedData = JSON.parse( jsonString );
		return updatedData;
	}
	return handleDuplication( allBlocks );
};

/**
 * Updates the block IDs for all blocks in the array.
 * @param {any} prev
 * @param {any} now
 * @return {any} the differences
 */

const _findDifferences = ( prev, now ) => {
	const changes = {};

	const compare = ( prevObj, nowObj, path = '' ) => {
		// Handle array comparison
		if ( Array.isArray( prevObj ) && Array.isArray( nowObj ) ) {
			const maxLength = Math.max( prevObj.length, nowObj.length );

			for ( let i = 0; i < maxLength; i++ ) {
				const currentPath = `${ path }[${ i }]`;

				if ( prevObj[ i ] !== nowObj[ i ] ) {
					if (
						typeof prevObj[ i ] === 'object' &&
						typeof nowObj[ i ] === 'object'
					) {
						compare( prevObj[ i ], nowObj[ i ], currentPath ); // Recursive call for objects in array
					} else {
						changes[ currentPath ] = {
							prev: prevObj[ i ],
							now: nowObj[ i ],
						};
					}
				}
			}
		}
		// Handle object comparison
		else if (
			typeof prevObj === 'object' &&
			typeof nowObj === 'object' &&
			prevObj !== null &&
			nowObj !== null
		) {
			for ( const key in nowObj ) {
				const fullPath = path ? `${ path }.${ key }` : key;

				if ( prevObj[ key ] !== nowObj[ key ] ) {
					if (
						typeof prevObj[ key ] === 'object' &&
						typeof nowObj[ key ] === 'object'
					) {
						compare( prevObj[ key ], nowObj[ key ], fullPath ); // Recursive call for nested objects
					} else {
						changes[ fullPath ] = {
							prev: prevObj[ key ],
							now: nowObj[ key ],
						};
					}
				}
			}

			// Check for removed keys from prevObj
			for ( const key in prevObj ) {
				if ( ! ( key in nowObj ) ) {
					const fullPath = path ? `${ path }.${ key }` : key;
					changes[ fullPath ] = {
						prev: prevObj[ key ],
						now: undefined,
					};
				}
			}
		}
	};

	compare( prev, now );
	return Object.keys( changes ).length > 0 ? changes : null; // Return null if no changes
};

/**
 *
 * @param {string} type    ex: common / field_comp
 * @param {string} typeKey ex: heading, title / section
 * @param {string} key     ex: typo/color
 * @param {any}    value   ex: typo object / hexa code
 */
// eslint-disable-next-line no-unused-vars
const updateGlobalStyle = ( type, typeKey, key, value ) => {
	let newObj = {};
	// eslint-disable-next-line no-undef
	setGlobalStyle( ( prevStyle ) => {
		newObj = {
			...prevStyle,
			[ type ]: {
				...prevStyle[ type ],
				[ typeKey ]: {
					...( prevStyle[ type ]?.[ typeKey ] || {} ),
					[ key ]: value,
				},
			},
		};
		return newObj;
	} );
};

function resetFieldConditions( blocksArray ) {
	return blocksArray.map( ( block ) => {
		let updatedBlock = { ...block };
		if ( updatedBlock.hasOwnProperty( 'fieldConditions' ) ) {
			updatedBlock = {
				...updatedBlock,
				en_logic: false,
				fieldConditions: {},
			};
		}
		if ( Array.isArray( updatedBlock.innerBlocks ) ) {
			updatedBlock.innerBlocks = resetFieldConditions(
				updatedBlock.innerBlocks
			);
		}
		return updatedBlock;
	} );
}

const getPriceHtml = ( data ) => {
	let { regular, sale, type } = data;

	regular = parseFloat( regular || 0 );
	sale = handlePradSalePrice( sale );
	type = type || 'fixed';

	switch ( type ) {
		case 'percentage': {
			const priceProduct = 20;
			const regularC = regular ? ( priceProduct * regular ) / 100 : null;
			const saleC = sale ? ( priceProduct * sale ) / 100 : null;
			return priceHtml( regularC, saleC );
		}
		case 'per_char':
		case 'per_unit':
			return priceHtml( regular, sale );
		case 'no_cost':
			return <span className="pricex prad-d-none">10</span>;
		default:
			return priceHtml( regular, sale );
	}
};

const priceHtml = ( regular, sale ) => {
	let html = <span className="pricex">{ buildPriceHtml( regular ) }</span>;
	if ( sale ) {
		html = (
			<span className="pricex">
				<del>{ buildPriceHtml( regular, 'reg' ) }</del>{ ' ' }
				<ins>{ buildPriceHtml( sale, 'sale' ) }</ins>
			</span>
		);
	}
	return html;
};
const buildPriceHtml = ( amount, type ) => {
	const currencyHtml = `${ pradBackendData.currencySymbol }`;
	if ( type === 'reg' && ! amount ) {
		return '';
	}
	if ( ! amount ) {
		amount = 0;
	}
	let [ integer, decimal ] = amount
		.toFixed( pradBackendData.num_decimals )
		.split( '.' );
	integer = integer.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		pradBackendData.decimal_sep
	);
	let formattedPrice = decimal
		? integer + pradBackendData.decimal_sep + decimal
		: integer;

	if ( pradBackendData.currency_pos === 'left' ) {
		formattedPrice = currencyHtml + formattedPrice;
	} else if ( pradBackendData.currency_pos === 'right' ) {
		formattedPrice = currencyHtml + formattedPrice;
	} else if ( pradBackendData.currency_pos === 'left_space' ) {
		formattedPrice = currencyHtml + ' ' + formattedPrice;
	} else if ( pradBackendData.currency_pos === 'right_space' ) {
		formattedPrice = formattedPrice + ' ' + currencyHtml;
	}

	return formattedPrice;
};

const handlePradSalePrice = ( sale ) => {
	return parseFloat( sale || 0 );
};

const findBlockItem = ( theArr, blockid ) => {
	for ( let i = 0; i < theArr?.length; i++ ) {
		if ( theArr[ i ]?.blockid === blockid ) {
			return {
				position: i,
				type: theArr[ i ].type,
				block: theArr.splice( i, 1 )[ 0 ],
			};
		}
		if ( theArr[ i ].type === 'section' && theArr[ i ]?.innerBlocks ) {
			const found = findBlockItem(
				[ ...theArr[ i ].innerBlocks ],
				blockid
			);
			if ( found ) {
				return found;
			}
		}
	}
	return null;
};

const getSelectedAfterRemoved = ( data, id ) => {
	let prevItem = null;

	const findItem = ( items, targetId ) => {
		for ( let i = 0; i < items.length; i++ ) {
			const item = items[ i ];
			if ( item.blockid === targetId ) {
				if ( i > 0 ) {
					prevItem = items[ i - 1 ];
				}

				if ( ! prevItem ) {
					if ( items[ i + 1 ] ) {
						return items[ i + 1 ].blockid;
					} else if ( item.sectionid ) {
						return item.sectionid;
					}
				}
				return prevItem?.blockid || '';
			}
			if ( item.innerBlocks && item.innerBlocks.length > 0 ) {
				const result = findItem( item.innerBlocks, targetId );
				if ( result ) {
					return result;
				}
			}
		}

		return '';
	};

	return findItem( data, id );
};

const generateUID = ( prefix = '' ) => {
	return (
		prefix +
		Date.now().toString( 36 ) +
		Math.random().toString( 36 ).slice( 2, 7 )
	);
};

export {
	titleCSS,
	_setFieldData,
	_fieldCommon,
	_getnerateBlockid,
	updateBlockAttr,
	duplicateBlock,
	removeBlock,
	handleBlockAction,
	moveNestedBlock,
	_moveItemInArray,
	updateOptionBlockIds,
	resetFieldConditions,
	getPriceHtml,
	_findDifferences,
	findBlockItem,
	getSelectedAfterRemoved,
	generateUID,
};
