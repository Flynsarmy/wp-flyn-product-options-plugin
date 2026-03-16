import { useCallback, useMemo } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useAddons } from '../../context/AddonsContext';
import icons from '../../utils/Icons';
const { __ } = wp.i18n;

const IncludeProducts = () => {
	const { updateDrawer } = useAddons();
	const { assignedData, setSelectProductData } = useEditor();

	const selectedLabel = useMemo( () => {
		const labelMap = {
			specific_category: __( 'Categories', 'product-addons' ),
			specific_tag: __( 'Tags', 'product-addons' ),
			specific_brand: __( 'Brands', 'product-addons' ),
		};
		return (
			labelMap[ assignedData.aType ] || __( 'Products', 'product-addons' )
		);
	}, [ assignedData.aType ] );

	const isAllProduct = useMemo( () => {
		return (
			assignedData.aType === 'all_product' || assignedData.aType === ''
		);
	}, [ assignedData.aType ] );

	const hasIncludes = useMemo( () => {
		return assignedData?.includes?.length > 0;
	}, [ assignedData?.includes ] );

	const handleSelectProducts = useCallback( () => {
		setSelectProductData( {
			incExc: 'includes',
		} );
		updateDrawer( {
			open: true,
			compo: 'assigned',
		} );
	}, [ setSelectProductData, updateDrawer ] );

	const handleKeyDown = useCallback(
		( e ) => {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				handleSelectProducts( 'keyboard' );
			}
		},
		[ handleSelectProducts ]
	);

	return (
		<div className="prad-assign-container">
			{ isAllProduct && (
				<div className="prad-assign-selector prad-cursor-default">
					<div className="prad-profile-text">
						{ __( 'All', 'product-addons' ) }
					</div>
					<div>{ __( 'All Product', 'product-addons' ) }</div>
				</div>
			) }
			{ ! isAllProduct && ! hasIncludes && (
				<div
					className="prad-assign-selector"
					onClick={ handleSelectProducts }
					role="button"
					tabIndex="0"
					onKeyDown={ handleKeyDown }
				>
					<div className="prad-lh-0">{ icons.add }</div>
					<div>
						{ __( 'Select', 'product-addons' ) } { selectedLabel }
					</div>
				</div>
			) }
			{ hasIncludes && (
				<div
					className="prad-assign-selector prad-relative"
					onClick={ handleSelectProducts }
					role="button"
					tabIndex="0"
					onKeyDown={ handleKeyDown }
				>
					<div className="prad-d-flex prad-item-center prad-gap-4">
						{ assignedData.includes.map(
							( product, index ) =>
								index < 4 && (
									<img
										key={ `profiler-${
											product.item_id || index
										}` }
										className="prad-profile-image"
										src={
											product.thumbnail ||
											pradBackendData.url +
												'assets/img/default-product.svg'
										}
										alt="profile"
									/>
								)
						) }
						<div className="prad-font-14">
							{ assignedData.includes.length > 4
								? `+${ assignedData.includes.length - 4 }`
								: `${ assignedData.includes.length }` }{ ' ' }
							{ selectedLabel }
						</div>
					</div>
					<div className="prad-lh-0 prad-absolute prad-right-10">
						{ icons.add }
					</div>
				</div>
			) }
		</div>
	);
};

export default IncludeProducts;
