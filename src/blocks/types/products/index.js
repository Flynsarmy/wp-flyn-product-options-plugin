import { useState, useEffect } from 'react';
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useEditor } from '../../../context/EditorContext';
import icons from '../../../utils/Icons';
import { getPriceHtml } from '../../../utils/Utils';
import Skeleton from '../../../utils/Skeleton';
import { generateBlockCss } from './blockCss';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const renderSwatchContent = ( index, item, settings, states, setStates ) => {
	return (
		<div
			className={ `prad-d-flex prad-flex-column prad-item-center prad-gap-2 prad-text-center prad-mt-8 prad-block-content-wrapper prad-effect-container` }
		>
			<div>
				<div
					className="prad-block-content prad-ellipsis-2"
					title={ item?.value }
				>
					{ item?.value }
				</div>
				<div className="prad-block-price prad-text-upper">
					{ getPriceHtml( {
						regular: item?.regular,
						sale: item?.sale,
						type: item?.type,
					} ) }
				</div>
			</div>
			{ settings.layout === '_default' &&
				renderVariationSelect( {
					item,
					valid: settings.mergeVariation,
					states,
					setStates,
				} ) }
			{ settings.enableCount === true && (
				<input
					id={ `id_quantity_${ settings.blockid }_${ index }` }
					name={ `id__quantity_${ settings.blockid }_${ index }` }
					type="number"
					placeholder="1"
					min={ settings.min }
					max={ settings.max }
					className={ `prad-block-input prad-quantity-input prad-input prad-w-full prad-mt-6` }
				/>
			) }
		</div>
	);
};

const renderVariationSelect = ( { item, valid, states, setStates } ) => {
	return valid && item.variation && item.variation.length ? (
		<div className="prad-product-block-variation-select prad-mt-10">
			<div className="prad-custom-select prad-w-full prad-product-variation-select-comp">
				<div
					className="prad-select-box prad-block-input prad-block-content"
					onClick={ () =>
						setStates( {
							...states,
							isOpen: ! states.isOpen,
							openIndex: item.id,
						} )
					}
				>
					<div
						style={ {
							maxWidth: '120px',
							textTransform: 'capitalize',
						} }
						className="prad-select-box-item prad-mr-12 prad-ellipsis"
					>
						{ states.selected }
					</div>{ ' ' }
					<div className="prad-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="8"
							fill="none"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="m1 1 6 6 6-6"
							></path>
						</svg>
					</div>
				</div>
				<div
					className="prad-select-options"
					style={ {
						display:
							states.isOpen && item.id === states.openIndex
								? 'block'
								: 'none',
					} }
				>
					{ item.variation.map( ( opt, k ) => {
						let label = '';
						let validAttr = true;
						let indx = 0;
						Object.entries( opt?.attributes || {} ).forEach(
							( [ key, value ] ) => {
								if ( value ) {
									label +=
										( indx > 0 ? ' , ' : '' ) +
										key
											.replace( 'attribute_pa_', '' )
											.replace( /_/g, ' ' ) +
										' ' +
										value;
									++indx;
								} else {
									validAttr = false;
								}
							}
						);
						if ( validAttr ) {
							return (
								<div
									key={ k }
									style={ { textTransform: 'capitalize' } }
									className="prad-select-option"
									onClick={ () => {
										setStates( {
											...states,
											isOpen: false,
											selected: label,
										} );
									} }
								>
									{ label }
								</div>
							);
						}
						return null;
					} ) }
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

const dummyOptions = [
	{
		value: 'Dummy Product #1',
		img: pradBackendData.url + 'assets/img/default-product.svg',
		type: 'fixed',
		regular: '9',
		sale: '',
	},
	{
		value: 'Dummy Product #2',
		img: pradBackendData.url + 'assets/img/default-product.svg',
		type: 'fixed',
		regular: '6',
		sale: '',
	},
	{
		value: 'Dummy Product #3',
		img: pradBackendData.url + 'assets/img/default-product.svg',
		type: 'fixed',
		regular: '4',
		sale: '',
	},
];

const Products = ( props ) => {
	const { settings, position } = props;
	const [ selectedIndex, setSelectedIndex ] = useState(
		settings.blockType === '_radios'
			? settings.defval &&
			  ( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
				? settings.defval[ 0 ]
				: ''
			: settings.defval
			? settings.defval
			: []
	);

	const [ selectedItems, setSelectedItems ] = useState(
		settings.defval ? settings.defval : []
	);
	const [ states, setStates ] = useState( {
		isOpen: false,
		selected: 'Select Variation',
		openIndex: null,
	} );
	const [ defaultVal, setDefaultVal ] = useState(
		settings.defval &&
			( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
			? settings.defval[ 0 ]
			: ''
	);

	const { currentPostCss, globalStyles } = useEditor();

	const blockCss = generateBlockCss( { settings, globalStyles } );
	currentPostCss.current = {
		...( currentPostCss.current || {} ),
		[ settings.blockid ]: blockCss,
	};

	let inputType = 'checkbox';
	let hoverClass = 'always';
	let columnClass = '1';

	if ( settings.blockType === '_swatches' ) {
		inputType = settings.multiple ? 'checkbox' : 'radio';
		if ( settings.layoutVisibility === 'hover_show' ) {
			hoverClass = 'show';
		} else if ( settings.layoutVisibility === 'hover_hide' ) {
			hoverClass = 'hide';
		}
	} else {
		inputType = settings.blockType === '_radios' ? 'radio' : 'checkbox';
		if ( settings.columns == '2' ) {
			columnClass = '2';
		} else if ( settings.columns == '3' ) {
			columnClass = '3';
		}
	}

	const handleSelection = ( index ) => {
		if ( settings.multiple ) {
			setSelectedItems(
				( prev ) =>
					prev.includes( index )
						? prev.filter( ( item ) => item !== index ) // Remove if already selected
						: [ ...prev, index ] // Add if not selected
			);
		} else {
			// For single selection (radio buttons), toggle the selection
			const newSelectedIndex = selectedIndex === index ? null : index;
			setSelectedIndex( newSelectedIndex ); // Select new item
		}
	};

	const [ loading, setLoading ] = useState( true );
	const [ blockProducts, setBlockProducts ] = useState( [] );

	useEffect( () => {
		setLoading( true );
		const _productIds = [];
		settings.manualProducts?.forEach( ( product ) => {
			if ( product.variation ) {
				if ( settings.mergeVariation ) {
					_productIds.push( { id: product.id } );
				} else {
					product.variation.forEach( ( vId ) => {
						_productIds.push( { id: vId } );
					} );
				}
			} else {
				_productIds.push( { id: product.id } );
			}
		} );

		wp.apiFetch( {
			method: 'POST',
			path: '/prad/products_details',
			data: {
				items: _productIds || [],
			},
		} )
			.then( ( response ) => {
				setBlockProducts( response.length ? response : dummyOptions );
			} )
			.catch( () => {
				setBlockProducts(
					blockProducts.length ? blockProducts : dummyOptions
				);
			} )
			.finally( () => setLoading( false ) );
	}, [ setLoading, settings.manualProducts, settings.mergeVariation ] );

	const blockObject = useAbstractBlock( settings, { ...props } );
	const blockItemImgClass =
		settings.blockType === '_swatches'
			? ''
			: 'prad-block-item-img-parent prad-block-img-' +
			  ( settings.imgStyle || 'normal' );

	return (
		<>
			<ToolBar disableTab={ true } { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-type${
					settings.blockType === '_swatches'
						? settings.blockType
						: '-' + inputType
				}-input prad-block-products prad-switcher-count prad-block-${
					settings.blockid
				} prad-swatch-layout${ settings.layout } prad-w-full ${
					settings.class
				} ${ blockItemImgClass }` }
			>
				{ blockCss && <style>{ blockCss }</style> }
				{ blockObject.renderTitleDescriptionNoPrice() }
				{ loading ? (
					<div>
						<Skeleton height="120px" width="100%" />
					</div>
				) : (
					<div
						className={
							settings.blockType === '_swatches'
								? 'prad-swatch-wrapper'
								: `prad-input-container prad-column-${ columnClass }`
						}
					>
						{ blockProducts?.length !== 0 &&
							blockProducts?.map( ( item, index ) => {
								let isActive = false;
								if (
									[ '_checkbox', '_radios' ].includes(
										settings.blockType
									) &&
									defaultVal
								) {
									isActive =
										inputType === 'checkbox'
											? defaultVal?.includes( index )
											: defaultVal === index;
								} else {
									isActive = settings.multiple
										? selectedItems?.includes( index )
										: selectedIndex === index;
								}

								return (
									<div
										key={ index }
										className={ `${
											[ '_checkbox', '_radios' ].includes(
												settings.blockType
											)
												? `prad-d-flex ${
														settings.mergeVariation &&
														item.variation
															? 'prad-item-start'
															: 'prad-item-center'
												  } prad-gap-8 prad-relative`
												: 'prad-swatch-item-wrapper prad-relative prad-d-flex prad-flex-column prad-h-full'
										}` }
									>
										{ settings.blockType === '_swatches' ? (
											<>
												<div
													className={ `prad-swatch-container prad-p-2 prad-w-fit prad-relative prad-hover-${ hoverClass }-bottom prad-${
														isActive
															? 'active'
															: 'inactive'
													}` }
													key={ index }
												>
													<input
														className="prad-input-hidden"
														defaultValue={
															item?.value
														}
														id={ `id_${ settings.blockid }_${ index }` }
														onClick={ () =>
															handleSelection(
																index
															)
														}
														name={ `prad-swatch-${ settings.blockid }` }
														type={ inputType }
													/>
													<label
														className="prad-lh-0 prad-mb-0"
														htmlFor={ `id_${ settings.blockid }_${ index }` }
													>
														<img
															className="prad-swatch-item"
															src={
																item?.img ||
																pradBackendData.url +
																	'assets/img/default-product.svg'
															}
															alt="swatch item"
															draggable={ false }
														/>
													</label>
													<div
														className={ `prad-swatch-mark-image prad-absolute prad-${
															isActive
																? 'active'
																: 'inactive'
														}` }
													>
														{ icons.checkMark }
													</div>
													{ settings.layout ===
														'_overlay' &&
														renderSwatchContent(
															index,
															item,
															settings,
															states,
															setStates
														) }
												</div>
												{ settings.layout ===
													'_default' &&
													renderSwatchContent(
														index,
														item,
														settings,
														states,
														setStates
													) }
												{ settings.enableCount ===
													true &&
													settings.layout ===
														'_img' && (
														<input
															id={ `id_quantity_${ settings.blockid }_${ index }` }
															name={ `id__quantity_${ settings.blockid }_${ index }` }
															type="number"
															placeholder="1"
															min={ settings.min }
															max={ settings.max }
															className={ `prad-block-input prad-quantity-input prad-input prad-w-full prad-mt-6` }
														/>
													) }
												{ ( settings.layout ===
													'_img' ||
													settings.layout ===
														'_overlay' ) &&
													renderVariationSelect( {
														item,
														valid: settings.mergeVariation,
														states,
														setStates,
													} ) }
											</>
										) : (
											<>
												<div
													className={ `prad-d-flex prad-item-center prad-gap-8` }
												>
													<div
														key={ index }
														className={ `prad-${ inputType }-item` }
													>
														<input
															className="prad-input-hidden"
															name={
																`name-` +
																position
															}
															type={ inputType }
															id={ `id_${ settings.blockid }_${ index }` }
															checked={
																inputType ===
																'checkbox'
																	? defaultVal.includes(
																			index
																	  )
																	: defaultVal ===
																	  index
															}
															onChange={ () => {
																if (
																	inputType ===
																	'checkbox'
																) {
																	if (
																		! defaultVal.includes(
																			index
																		)
																	) {
																		setDefaultVal(
																			[
																				...defaultVal,
																				index,
																			]
																		);
																	} else {
																		setDefaultVal(
																			defaultVal.filter(
																				(
																					_val
																				) =>
																					_val !==
																					index
																			)
																		);
																	}
																} else {
																	setDefaultVal(
																		index
																	);
																}
															} }
														/>
														<label
															htmlFor={ `id_${ settings.blockid }_${ index }` }
															className="prad-d-flex prad-item-center prad-gap-10"
														>
															{ inputType ===
															'radio' ? (
																<div className="prad-radio-mark prad-realtive prad-br-round prad-selection-none"></div>
															) : (
																<div className="prad-checkbox-mark prad-selection-none">
																	{
																		icons.tickMark_12
																	}
																</div>
															) }
															<div className="prad-block-content prad-d-flex prad-item-center">
																{ item?.img && (
																	<img
																		className="prad-block-item-img"
																		src={
																			item?.img
																		}
																		alt="Item"
																	/>
																) }
																{ item.variation &&
																settings.mergeVariation ? (
																	<div>
																		<div
																			className="prad-ellipsis-2"
																			title={
																				item?.value
																			}
																		>
																			{
																				item?.value
																			}
																		</div>
																		{ renderVariationSelect(
																			{
																				item,
																				valid: settings.mergeVariation,
																				states,
																				setStates,
																			}
																		) }
																	</div>
																) : (
																	<div
																		className="prad-ellipsis-2"
																		title={
																			item?.value
																		}
																	>
																		{
																			item?.value
																		}
																	</div>
																) }
															</div>
														</label>
													</div>
													<div className="prad-d-flex prad-item-center prad-gap-12">
														<div className="prad-block-price prad-text-upper">
															{ getPriceHtml( {
																regular:
																	item?.regular,
																sale: item?.sale,
																type: item?.type,
															} ) }
														</div>
														{ settings.enableCount ===
															true && (
															<input
																id={ `id__quantity_${ settings.blockid }_${ index }` }
																name={ `id__quantity_${ settings.blockid }_${ index }` }
																type="number"
																placeholder="1"
																min={
																	settings.min
																}
																max={
																	settings.max
																}
																className={ `prad-block-input prad-quantity-input` }
															/>
														) }
													</div>
												</div>
											</>
										) }
									</div>
								);
							} ) }
					</div>
				) }
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Products;
