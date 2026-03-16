import { useCallback, useMemo } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useAddons } from '../../context/AddonsContext';
import icons from '../../utils/Icons';
const { __ } = wp.i18n;

const ExcludeProducts = () => {
	const { assignedData, setSelectProductData } = useEditor();

	const { updateDrawer } = useAddons();

	const handleSelectProducts = useCallback( () => {
		setSelectProductData( {
			incExc: 'excludes',
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

	const hasExcludes = useMemo( () => {
		return assignedData?.excludes?.length > 0;
	}, [ assignedData?.excludes ] );

	return (
		<div className="prad-w-full">
			<div className="prad-font-16 prad-font-bold prad-color-text-dark prad-mb-8">
				{ __( 'Exclude Specific Products', 'product-addons' ) }
			</div>
			<div className="prad-assign-container">
				{ ! hasExcludes && (
					<div
						className="prad-assign-selector"
						onClick={ handleSelectProducts }
						role="button"
						tabIndex="0"
						onKeyDown={ handleKeyDown }
					>
						<div className="prad-lh-0">{ icons.add_20 }</div>
						<div>{ __( 'Select Products', 'product-addons' ) }</div>
					</div>
				) }
				{ hasExcludes && (
					<div
						className="prad-assign-selector prad-relative"
						onClick={ handleSelectProducts }
						role="button"
						tabIndex="0"
						onKeyDown={ handleKeyDown }
					>
						<div className="prad-d-flex prad-item-center prad-gap-4">
							{ assignedData.excludes.map(
								( product, index ) =>
									index < 4 && (
										<img
											key={ `profiler-${ product.item_id }` }
											className="prad-profile-image"
											src={
												product.thumbnail ||
												pradBackendData.url +
													'assets/img/default-product.svg'
											}
											alt="Profile"
										/>
									)
							) }
							<div className="prad-font-14">
								{ assignedData.excludes.length > 4
									? `+${ assignedData.excludes.length - 4 }`
									: `${ assignedData.excludes.length }` }{ ' ' }
								{ __( 'Products', 'product-addons' ) }
							</div>
						</div>
						<div className="prad-lh-0 prad-absolute prad-right-10">
							{ icons.add }
						</div>
					</div>
				) }
			</div>
		</div>
	);
};

export default ExcludeProducts;
