const { __ } = wp.i18n;
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../../../../components/Button';
import Search from '../../../../../../components/Search';
import { useAddons } from '../../../../../../context/AddonsContext';
import Icons from '../../../../../../utils/Icons';
import Skeleton from '../../../../../../utils/Skeleton';

const ProductsAdd = ( props ) => {
	const { settings, toolbarSetData } = props;
	const [ searchKey, setSearchKey ] = useState( '' );
	const [ productSearchList, setProductSearchList ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ fetching, setFetching ] = useState( true );
	const [ selectedWithDetails, setSelectedWithDetails ] = useState( [ {} ] );
	const selectedProducts = settings.manualProducts || [];

	const [ isFocused, setIsFocused ] = useState( null );
	const containerRef = useRef();
	const searchResultsRef = useRef();
	const searchResultsPopupRef = useRef(); // New ref for the popup
	const [ openVariationIndex, setOpenVariationIndex ] = useState( null );
	const { selectedBlock } = useAddons();

	const [ searchResPos, setSearchResPos ] = useState( {
		top: 0,
		left: 0,
		width: 0,
	} );

	useLayoutEffect( () => {
		const trackPositions = () => {
			if ( searchResultsRef.current ) {
				const rect = searchResultsRef.current.getBoundingClientRect();
				setSearchResPos( {
					top: rect.bottom + window.scrollY,
					left: rect.left + window.scrollX,
					width: rect.width,
				} );
			}
		};

		trackPositions();
		window.addEventListener( 'resize', trackPositions );
		window.addEventListener( 'scroll', trackPositions, true );

		return () => {
			window.removeEventListener( 'resize', trackPositions );
			window.removeEventListener( 'scroll', trackPositions, true );
		};
	}, [ isFocused ] );

	useEffect( () => {
		const abortControl = new AbortController();
		function handleClickOutside( event ) {
			// Check if click is outside both the container and the search results popup
			const isOutsideContainer =
				containerRef.current &&
				! containerRef.current.contains( event.target );
			const isOutsideSearchResults =
				searchResultsPopupRef.current &&
				! searchResultsPopupRef.current.contains( event.target );

			if ( isOutsideContainer && isOutsideSearchResults ) {
				setIsFocused( null );
			}
		}
		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		return () => abortControl.abort();
	}, [] );

	const handleSearchAndSelection = useCallback( () => {
		setFetching( true );
		const excludes = selectedWithDetails.map( ( el ) => {
			return el.id || 0;
		} );
		wp.apiFetch( {
			method: 'POST',
			path: '/prad/product_search',
			data: {
				term: searchKey,
				limit: '5',
				excludes,
			},
		} )
			.then( ( response ) => {
				setProductSearchList( response.length ? response : [ {} ] );
			} )
			.catch( () => {
				setProductSearchList( [ {} ] );
			} )
			.finally( () => setFetching( false ) );
	}, [ searchKey, selectedWithDetails ] );

	const fetchSearchItems = useCallback( async () => {
		handleSearchAndSelection();
	}, [ handleSearchAndSelection ] );

	useEffect( () => {
		const delayDebounce = setTimeout( () => fetchSearchItems(), 500 );
		return () => clearTimeout( delayDebounce );
	}, [ searchKey, fetchSearchItems ] );

	useEffect( () => {
		setLoading( true );
		wp.apiFetch( {
			method: 'POST',
			path: '/prad/products_details',
			data: {
				items: selectedProducts,
			},
		} )
			.then( ( response ) => {
				setSelectedWithDetails( response.length ? response : [ {} ] );
			} )
			.catch( () => {
				setSelectedWithDetails( [ {} ] );
			} )
			.finally( () => setLoading( false ) );
	}, [ selectedBlock, setLoading ] );

	const handleSelectionChange = ( params ) => {
		const { type, _pId, position, item, _variations } = params;
		if ( type === 'new' ) {
			setSelectedWithDetails( [ ...selectedWithDetails, {} ] );
			setSearchKey( '' );
		} else if ( type === 'update' ) {
			const newSelection = [
				...selectedWithDetails.slice( 0, position ),
				item,
				...selectedWithDetails.slice( position + 1 ),
			];

			const newProducts = [
				...selectedProducts.slice( 0, position ),
				{
					id: item.id,
					...( item.variation && { variation: [] } ),
				},
				...selectedProducts.slice( position + 1 ),
			];
			setSearchKey( '' );
			setSelectedWithDetails( newSelection );
			toolbarSetData( 'manualProducts', newProducts );
		} else if ( type === 'variation' ) {
			const variationIds = _variations.map( ( el ) => {
				return el.id;
			} );

			const newProducts = selectedProducts.map( ( el ) =>
				el.id === _pId ? { ...el, variation: variationIds } : el
			);
			toolbarSetData( 'manualProducts', newProducts );
		}
	};

	const handleDelete = ( position ) => {
		setSelectedWithDetails( ( prev ) => {
			const updated = [ ...( prev ?? [] ) ];
			updated.splice( position, 1 );
			return updated;
		} );

		const newProducts = [ ...( selectedProducts || [] ) ];
		newProducts.splice( position, 1 );
		toolbarSetData( 'manualProducts', newProducts );
	};

	const isValidVariation = ( obj ) => {
		if ( ! obj || typeof obj !== 'object' ) {
			return false;
		}
		return Object.values( obj ).every(
			( val ) => val !== null && val !== undefined && val !== ''
		);
	};

	// Drag operations
	const [ draggedIndex, setDraggedIndex ] = useState( null );
	const handleDropCleanup = () => {
		const dragWrapper = document.body.querySelector(
			'.prad-dragged-element-wrapper'
		);
		if ( dragWrapper ) {
			document.body.removeChild( dragWrapper );
		}
	};

	const handleDragOver = ( e ) => {
		e.preventDefault();
		const target = e.target.closest( '.prad-drag-wrapper-toolbar' );

		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );

		if ( target && ! target.classList.contains( 'prad-dragging' ) ) {
			target.classList.add( 'prad-drag-over' );
		}
	};
	const handleDragLeave = ( e ) => {
		const related = e.relatedTarget?.closest(
			'.prad-drag-wrapper-toolbar'
		);
		const target = e.target.closest( '.prad-drag-wrapper-toolbar' );

		if ( ! related && target ) {
			target.classList.remove( 'prad-drag-over' );
		}
	};
	const handleDrop = ( e, index ) => {
		e.preventDefault();
		setDraggedIndex( e.dataTransfer.getData( 'text/plain' ) );
		handleDropCleanup();
		if ( draggedIndex !== index ) {
			// Only move if the index is different (to avoid unnecessary updates)
			const newOptions = [ ...( selectedWithDetails ?? [] ) ];
			const movedItem = newOptions.splice( draggedIndex, 1 )[ 0 ]; // Remove dragged item
			newOptions.splice( index, 0, movedItem ); // Insert the dragged item at the new position
			setSelectedWithDetails( newOptions );

			const newProducts = [ ...( selectedProducts ?? [] ) ];
			const toMove = newProducts.splice( draggedIndex, 1 )[ 0 ]; // Remove dragged item
			newProducts.splice( index, 0, toMove ); // Insert the dragged
			toolbarSetData( 'manualProducts', newProducts );
		}

		document.querySelectorAll( '.prad-dragging' ).forEach( ( el ) => {
			el.classList.remove( 'prad-dragging' );
		} );
		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );
	};
	const handleDragEnd = () => {
		handleDropCleanup();
		document.querySelectorAll( '.prad-dragging' ).forEach( ( el ) => {
			el.classList.remove( 'prad-dragging' );
		} );
		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );
	};
	const handleDragEnter = ( e ) => {
		const target = e.target.closest( '.prad-drag-wrapper-toolbar' );

		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );

		if ( target && ! target.classList.contains( 'prad-dragging' ) ) {
			target.classList.add( 'prad-drag-over' );
		}
	};
	const handleDragStart = ( e, index ) => {
		if ( ! e.target.classList.contains( 'prad-option-drag-toolbar' ) ) {
			e.preventDefault();
			return;
		}

		e.dataTransfer.setData( 'text/plain', index );
		e.dataTransfer.effectAllowed = 'move';

		e.target
			.closest( '.prad-drag-wrapper-toolbar' )
			.classList.add( 'prad-dragging' );

		setDraggedIndex( index );

		const blockElement = e.target.closest( '.prad-drag-wrapper-toolbar' );

		const dragImage = blockElement.cloneNode( true ); // Clone the block element
		dragImage.style.position = 'absolute';
		dragImage.style.pointerEvents = 'none'; // Prevent interactions
		dragImage.style.zIndex = '9999';
		dragImage.classList.add( 'prad-dragged-element-wrapper' ); // Add a custom class for styling
		document.body.appendChild( dragImage ); // Append to the document1

		// Get mouse position relative to the blockElement
		const rect = blockElement.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top + 30;

		// Set custom drag image with proper offset
		e.dataTransfer.setDragImage( dragImage, offsetX, offsetY );
	};

	return (
		<div className="prad-relative prad-pb-20 prad-border-default prad-br-smd">
			<div className="prad-editor-setting-product-table prad-overflow-auto">
				<div className="prad-field-header prad-font-14 prad-font-semi prad-mb-20 prad-gap-6 prad-d-grid prad-column-two">
					<div>
						<div className="prad-lh-0"></div>
					</div>
					<div className="prad-pr-18">
						{ __( 'Product', 'product-addons' ) }
					</div>
					<div className="prad-pr-18">
						{ __( 'Variation', 'product-addons' ) }
					</div>
				</div>
				<div className="prad-products-body">
					{ loading ? (
						<div className="prad-products-container prad-d-flex prad-flex-column prad-w-full prad-gap-10 prad-p-10">
							{ [ ...Array( selectedProducts.length || 1 ) ].map(
								( _, i ) => (
									<div
										key={ i }
										className="prad-d-flex prad-item-center prad-gap-12"
									>
										<div className="prad-selection-item prad-d-flex prad-item-center prad-gap-12 prad-cursor-pointer prad-w-fit">
											<Skeleton
												height="16px"
												width="16px"
											/>
										</div>
										<div>
											<Skeleton
												height="36px"
												width="350px"
											/>
										</div>
										<div>
											<Skeleton
												height="36px"
												width="150px"
											/>
										</div>
									</div>
								)
							) }
						</div>
					) : (
						selectedWithDetails.map( ( item, index ) => {
							const theProduct = selectedProducts?.find(
								( _product ) => item.id === _product.id
							);
							return (
								<div
									key={ `prad-product-${ index }` }
									className="prad-field-row prad-drag-wrapper-toolbar prad-gap-6 prad-plr-20 prad-d-grid prad-item-center prad-column-two"
									id={ index }
									onDragOver={ ( e ) => handleDragOver( e ) } // Handle drag over
									onDragLeave={ ( e ) =>
										handleDragLeave( e )
									} // Handle drag leave
									onDrop={ ( e ) => handleDrop( e, index ) }
									onDragEnd={ handleDragEnd }
									onDragEnter={ ( e ) =>
										handleDragEnter( e )
									}
								>
									<div>
										<div
											className="prad-lh-0 prad-cursor-pointer prad-option-drag-toolbar"
											draggable={ true }
											onDragStart={ ( e ) =>
												handleDragStart( e, index )
											}
										>
											{ Icons.drag }
										</div>
									</div>
									<div className="prad-products-item prad-pr-18">
										{ item.id ? (
											<div className="prad-bg-base2 prad-br-100 prad-p-6 prad-d-flex prad-item-center prad-gap-8">
												<div className="prad-lh-0">
													<img
														key={ `profiler-${ item?.item_id }` }
														className="prad-product-image"
														src={
															item?.img ||
															pradBackendData?.url +
																'assets/img/default-product.svg'
														}
														alt="profile"
													/>
												</div>
												<div
													className="prad-ellipsis"
													title={ item.value }
												>
													{ item.value }
												</div>
											</div>
										) : (
											<div
												ref={ containerRef }
												className="prad-relative"
											>
												<Search
													onChange={ ( value ) =>
														setSearchKey( value )
													}
													onFocus={ () =>
														setIsFocused( index )
													}
													iconBorder={ false }
													iconPosition="before"
													maxHeight="36px"
												/>
												<div
													ref={ searchResultsRef }
													style={ {
														display: 'block',
														height: '0px !important',
														width: '100%',
													} }
												></div>
												{ ReactDOM.createPortal(
													<div
														ref={
															searchResultsPopupRef
														}
														className="prad-product-search-results prad-absolute prad-bg-base1 prad-sh prad-w-full prad-br-md prad-shadow-tertiary prad-overflow-x-hidden prad-overflow-y-auto prad-scrollbar"
														onClick={ ( e ) =>
															e.stopPropagation()
														}
														style={ {
															transition:
																'max-height var(--prad-transition-smd) ease, padding var(--prad-transition-smd) ease',
															maxHeight:
																isFocused ===
																	index &&
																productSearchList.length
																	? '300px'
																	: '0px',
															padding:
																isFocused ===
																	index &&
																productSearchList.length
																	? '8px 16px'
																	: '0px',
															zIndex: 99999999,
															top: `${ searchResPos.top }px`,
															left: `${ searchResPos.left }px`,
															width: `${ searchResPos.width }px`,
														} }
													>
														{ fetching ? (
															<div className="prad-text-center prad-pt-8 prad-pb-b prad-color-text-light">
																{ [
																	...Array(
																		5
																	),
																].map(
																	(
																		_,
																		i
																	) => (
																		<div
																			key={
																				i
																			}
																			className="prad-d-flex prad-item-center prad-gap-12 prad-selection-search-product"
																		>
																			<div className="prad-selection-item prad-d-flex prad-item-center prad-gap-12 prad-cursor-pointer prad-w-fit">
																				<Skeleton
																					height="21px"
																					width="190px"
																				/>
																			</div>
																		</div>
																	)
																) }
															</div>
														) : (
															productSearchList.length >
																0 &&
															productSearchList.map(
																(
																	product,
																	productIndex
																) => (
																	<div
																		key={
																			product.id
																		}
																		title={
																			product.value
																		}
																		className={ `prad-pt-8 prad-pb-8 prad-w-full prad-cursor-pointer prad-ellipsis prad-border-bottom-${
																			productIndex ===
																			productSearchList.length -
																				1
																				? 'none'
																				: 'default'
																		}` }
																		onClick={ () => {
																			handleSelectionChange(
																				{
																					type: 'update',
																					position:
																						index,
																					item: {
																						...product,
																					},
																				}
																			);
																			setIsFocused(
																				null
																			);
																		} }
																	>
																		{
																			product.value
																		}
																	</div>
																)
															)
														) }
													</div>,
													document.body
												) }
											</div>
										) }
									</div>
									<VariationBox
										key={ item.id }
										item={ item }
										index={ index }
										mergeVariation={
											settings.mergeVariation
										}
										isOpen={ openVariationIndex }
										onToggle={ setOpenVariationIndex }
										isValidVariation={ isValidVariation }
										theProduct={ theProduct }
										handleSelectionChange={
											handleSelectionChange
										}
									/>
									<Button
										onlyIcon={ true }
										iconName="delete"
										background="base2"
										fontHeight="0"
										borderRadius="100"
										className="prad-btn-close"
										borderColor="transparent"
										onClick={ () => handleDelete( index ) }
									/>
								</div>
							);
						} )
					) }
				</div>
			</div>
			<div className="prad-plr-20 prad-mt-20">
				<Button
					value={ __( 'Add Product', 'product-addons' ) }
					iconName="plus_20"
					background="primary"
					onClick={ () => handleSelectionChange( { type: 'new' } ) }
				/>
			</div>
		</div>
	);
};

const VariationBox = ( {
	item,
	index,
	isOpen,
	theProduct,
	onToggle,
	isValidVariation,
	handleSelectionChange,
	mergeVariation,
} ) => {
	const variationBoxRef = useRef();
	const variationPortalRef = useRef();
	const [ variationPopPos, setVariationPopPos ] = useState( {
		top: 0,
		left: 0,
	} );

	useLayoutEffect( () => {
		const trackPositions = () => {
			if ( variationBoxRef.current ) {
				const rect = variationBoxRef.current.getBoundingClientRect();
				setVariationPopPos( {
					top: rect.bottom + window.scrollY,
					left: rect.left + window.scrollX,
				} );
			}
		};

		trackPositions();
		window.addEventListener( 'resize', trackPositions );
		window.addEventListener( 'scroll', trackPositions, true );

		return () => {
			window.removeEventListener( 'resize', trackPositions );
			window.removeEventListener( 'scroll', trackPositions, true );
		};
	}, [ isOpen ] );

	useEffect( () => {
		const abortControl = new AbortController();
		function handleClickOutside( event ) {
			if (
				variationBoxRef.current &&
				! variationBoxRef.current.contains( event.target ) &&
				variationPortalRef.current &&
				! variationPortalRef.current.contains( event.target )
			) {
				onToggle( null );
			}
		}
		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		return () => abortControl.abort();
	}, [] );

	const handleVariation = ( _var ) => {
		const productVariations = [ ...theProduct.variation ];
		const variationIndex = productVariations.indexOf( _var.id );
		if ( variationIndex > -1 ) {
			productVariations.splice( variationIndex, 1 );
		} else {
			productVariations.push( _var.id );
		}

		const newVars = [ ...item.variation ].filter( ( _itm ) => {
			return (
				isValidVariation( _itm.attributes ) &&
				productVariations.includes( _itm.id )
			);
		} );

		handleSelectionChange( {
			type: 'variation',
			_pId: theProduct?.id,
			_variations: newVars,
		} );
	};
	let validVariationCount = 0;

	return (
		<div className="prad-products-variation prad-pr-18">
			{ item.variation ? (
				<div className="prad-d-flex prad-gap-6 prad-item-center prad-justify-between">
					<div>
						{ mergeVariation
							? 'All'
							: theProduct?.variation?.length }{ ' ' }
						Variations
					</div>
					<div
						className={ `prad-relative ${
							mergeVariation ? 'prad-d-none' : ''
						}` }
						ref={ variationBoxRef }
					>
						<Button
							onlyIcon={ true }
							iconName="plus"
							color="text-medium"
							background="base2"
							borderRadius="round"
							borderColor="currentColor"
							padding="3px"
							onClick={ () =>
								onToggle( isOpen === index ? null : index )
							}
						/>

						{ isOpen === index &&
							ReactDOM.createPortal(
								<div
									ref={ variationPortalRef }
									className="prad-absolute prad-w-fit prad-bg-base1 prad-br-md prad-shadow-primary-dark prad-overflow-x-hidden prad-overflow-y-auto prad-scrollbar prad-width-250 prad-height-250"
									style={ {
										zIndex: 99999999,
										top: `${ variationPopPos.top }px`,
										left: `${ variationPopPos.left }px`,
									} }
								>
									<div className="prad-p-8-12 prad-bg-light prad-ellipsis prad-font-bold">
										{ __(
											'Select Variations',
											'product-addons'
										) }
									</div>
									{ item.variation.map( ( _var, _i ) => {
										if (
											! isValidVariation(
												_var?.attributes
											)
										) {
											return null;
										}
										const isActive =
											theProduct?.variation?.includes(
												_var.id
											);
										validVariationCount++;
										return (
											<div
												key={ _i }
												title={ _var.value }
												onMouseDown={ ( e ) =>
													e.stopPropagation()
												}
												onClick={ ( e ) => {
													e.stopPropagation();
													handleVariation( _var );
												} }
												className={ `prad-products-item-variation prad-p-8-12 prad-cursor-pointer prad-ellipsis prad-${
													isActive
														? 'active'
														: 'inactive'
												}` }
											>
												{ _var.value }
											</div>
										);
									} ) }
									{ validVariationCount === 0 && (
										<div
											className="prad-p-8-12 prad-d-flex prad-flex-column prad-gap-10"
											onClick={ ( e ) => {
												e.stopPropagation();
											} }
										>
											<div>
												{ __(
													'No valid variation available',
													'product-addons'
												) }
											</div>
											{ item.editLink && (
												<a
													href={ item.editLink }
													target="_blank"
													rel="noreferrer"
												>
													{ __(
														'Edit Variation',
														'product-addons'
													) }
												</a>
											) }
										</div>
									) }
								</div>,
								document.body
							) }
					</div>
				</div>
			) : (
				<div>N/A</div>
			) }
		</div>
	);
};
export default ProductsAdd;
