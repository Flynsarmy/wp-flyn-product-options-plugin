import { useEffect, useState, useCallback, useRef } from 'react';
import Button from './Button';
import Search from './Search';
import { useEditor } from '../context/EditorContext';
import { useAddons } from '../context/AddonsContext';
import Skeleton from '../utils/Skeleton';

const SelectProduct = () => {
	const { assignType, assignedData, handleAssignedData, selectProductData } =
		useEditor();
	const { updateDrawer, setHasUnsavedChanges } = useAddons();

	const selectedOption =
		assignType.find( function ( item ) {
			return item.value === assignedData.aType;
		} )?.label || 'Value not found';
	const selectedProducts = assignedData[ selectProductData.incExc ] || [];
	let searchType = 'products';
	if ( selectProductData.incExc === 'includes' ) {
		if ( assignedData.aType === 'specific_category' ) {
			searchType = 'cat';
		} else if ( assignedData.aType === 'specific_tag' ) {
			searchType = 'tag';
		} else if ( assignedData.aType === 'specific_brand' ) {
			searchType = 'brand';
		}
	}

	const [ searchKey, setSearchKey ] = useState( '' );
	const [ productSearchList, setProductSearchList ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ selection, setSelection ] = useState( [ ...selectedProducts ] );

	const onClose = () => {
		updateDrawer( {
			open: false,
			compo: '',
		} );
	};

	const handleSearchAndSelection = useCallback(
		( product = null ) => {
			setLoading( true );

			wp.apiFetch( {
				method: 'POST',
				path: '/prad/assign_search',
				data: {
					term: searchKey,
					type: searchType || 'products',
				},
			} )
				.then( ( obj ) => {
					setProductSearchList( obj.data );

					if ( product ) {
						setSelection( ( prev ) =>
							prev.some(
								( item ) => item.item_id === product.item_id
							)
								? prev.filter(
										( item ) =>
											item.item_id !== product.item_id
								  )
								: [ ...prev, product ]
						);
					}
				} )
				.finally( () => {
					setLoading( false );
				} );
		},
		[ searchKey, searchType ]
	);

	const fetchSearchItems = useCallback( async () => {
		handleSearchAndSelection();
	}, [ handleSearchAndSelection ] );

	useEffect( () => {
		const delayDebounce = setTimeout( () => fetchSearchItems(), 500 );
		return () => clearTimeout( delayDebounce );
	}, [ searchKey, fetchSearchItems ] );

	const handleSelection = ( product ) => {
		setSelection( ( prev ) => {
			const data = prev.some(
				( item ) => item.item_id === product.item_id
			)
				? prev.filter( ( item ) => item.item_id !== product.item_id )
				: [ ...prev, product ];
			return data;
		} );
	};

	const isFirstRender = useRef( true );
	useEffect( () => {
		if ( isFirstRender.current ) {
			isFirstRender.current = false;
			return;
		}
		handleAssignedData( selectProductData.incExc, selection );
		setHasUnsavedChanges( true );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ selection ] );

	return (
		<div className="prad-item-start">
			<div className="">
				<div className="prad-d-flex prad-item-center prad-justify-between prad-text-color prad-mb-12">
					<div className="prad-font-16 prad-font-semi">
						{ selectProductData?.incExc === 'includes'
							? `Include ${ selectedOption || '' }`
							: 'Exclude Specific Product' }
					</div>
					<Button
						onlyIcon={ true }
						iconName="cross_24"
						borderBtn={ true }
						color="dark"
						padding="3.2px"
						className="prad-btn-close"
						onClick={ () => onClose() }
					/>
				</div>
				<Search onChange={ ( value ) => setSearchKey( value ) } />
				<div className="">
					{ selection.length !== 0 && (
						<div
							style={ { maxHeight: 90 } }
							className="prad-selection-product prad-scrollbar prad-overflow-x-hidden prad-overflow-y-auto prad-mt-10 prad-d-flex prad-item-center prad-flex-wrap prad-gap-4 prad-pt-16 prad-pb-16 prad-border-bottom-default prad-bc-border-secondary"
						>
							{ selection.map( ( product, index ) => (
								<div
									key={ `prad-product-${ index }` }
									className="prad-selection-item prad-d-flex prad-item-center prad-gap-16 prad-bg-base2 prad-p-4 prad-br-100"
								>
									<div className="prad-d-flex prad-item-center prad-gap-8">
										<img
											key={ `profiler-${ product.item_id }` }
											className="prad-product-image"
											src={
												product.thumbnail ||
												pradBackendData.url +
													'assets/img/default-product.svg'
											}
											alt="product"
										/>
										<div className="prad-font-12 prad-ellipsis">
											{ product.item_name }
										</div>
									</div>
									{ product.url && (
										<Button
											onlyIcon={ true }
											iconName="eye"
											padding="0px"
											color="primary"
											buttonLink={ product.url }
										/>
									) }
									<Button
										onlyIcon={ true }
										iconName="cross"
										background="base1"
										fontHeight="0"
										borderRadius="100"
										className="prad-btn-close"
										borderColor="transparent"
										onClick={ () =>
											handleSelection( product )
										}
									/>
								</div>
							) ) }
						</div>
					) }
					{ loading ? (
						<div className="prad-selection-search prad-scrollbar prad-mt-24">
							{ [ ...Array( 5 ) ].map( ( _, i ) => (
								<div
									key={ i }
									className="prad-d-flex prad-item-center prad-gap-12 prad-selection-search-product"
								>
									<div className="prad-selection-item prad-d-flex prad-item-center prad-gap-12 prad-cursor-pointer prad-w-fit">
										<Skeleton height="18px" width="18px" />
										<Skeleton height="40px" width="40px" />
									</div>
									<div>
										<Skeleton height="20px" width="100px" />
									</div>
									<div>
										<Skeleton height="20px" width="20px" />
									</div>
								</div>
							) ) }
						</div>
					) : (
						<div className="prad-selection-search prad-scrollbar prad-mt-24">
							{ productSearchList.map( ( product, index ) => (
								<div
									key={ `prad-product-${ index }` }
									className={ `prad-d-flex prad-item-center prad-gap-12 prad-selection-search-product` }
								>
									<label
										className="prad-selection-item prad-d-flex prad-item-center prad-gap-12 prad-cursor-pointer prad-w-fit"
										htmlFor={ `prad-product-${ product.item_id }` }
									>
										<input
											className="prad-input-hidden"
											type="checkbox"
											id={ `prad-product-${ product.item_id }` }
											checked={ selection.some(
												( item ) =>
													item.item_id ===
													product.item_id
											) }
											onChange={ () => {
												handleSelection( product );
											} }
										/>
										<div className="prad-checkbox-custom prad-checkbox-md"></div>
										<div className="prad-d-flex prad-item-center prad-gap-8">
											<img
												key={ `profiler-${ product.item_id }` }
												className="prad-product-image"
												src={
													product.thumbnail ||
													pradBackendData.url +
														'assets/img/default-product.svg'
												}
												alt="product"
											/>
											<div className="prad-font-12">
												{ product.item_name }
											</div>
										</div>
									</label>
									{ product.url && (
										<Button
											onlyIcon={ true }
											iconName="eye"
											padding="0px"
											color="primary"
											buttonLink={ product.url }
										/>
									) }
								</div>
							) ) }
						</div>
					) }
				</div>
			</div>
		</div>
	);
};

export default SelectProduct;
