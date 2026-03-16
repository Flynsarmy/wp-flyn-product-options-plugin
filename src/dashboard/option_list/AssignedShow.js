import { useState, useMemo, useRef } from 'react';
import Button from '../../components/Button';
import Portal from '../../components/portal/Portal';
const { __ } = wp.i18n;
const AssignedShow = ( props ) => {
	const [ isHover, setIsHover ] = useState( false );
	const popUpRef = useRef();

	const { option } = props;

	const selectedLabel = useMemo( () => {
		const labelMap = {
			specific_category: __( 'Categories', 'product-addons' ),
			specific_tag: __( 'Tags', 'product-addons' ),
			specific_brand: __( 'Brands', 'product-addons' ),
		};
		return (
			labelMap[ option?.assigned?.aType ] ||
			__( 'Products', 'product-addons' )
		);
	}, [ option?.assigned?.aType ] );

	const tooltipStyle = useMemo( () => {
		return {
			position: 'absolute',
			zIndex: 20,
			background: '#fff',
			border: '1px solid #ddd',
			borderRadius: 6,
			boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
			padding: 16,
			top: '100%',
			left: 0,
			marginTop: 0,
			minWidth: 260,
			transform: 'translateY(4px)',
			transition: 'opacity 0.2s ease, transform 0.2s ease',
		};
	}, [ isHover, option ] );

	return (
		<div>
			{ option?.assigned?.aType === 'all_product' ? (
				<div className="prad-assign-selector">
					<div className="prad-profile-text">All</div>
					<div>All Product</div>
				</div>
			) : (
				<div
					className="prad-relative"
					onMouseEnter={ () => setIsHover( true ) }
					onMouseLeave={ () => {
						setIsHover( false );
					} }
				>
					<div className="prad-d-flex prad-item-center prad-gap-8 prad-color-active">
						{ option.assigned?.includes
							.slice( 0, 4 )
							.map( ( item, i ) => (
								<img
									className="prad-br-100 prad-overlap-item prad-bordered"
									key={ i }
									src={
										item.thumbnail ||
										pradBackendData.url +
											'assets/img/default-product.svg'
									}
									alt="Assign Product"
								/>
							) ) }
						{ option.assigned.includes.length > 4 ? ' +' : ' ' }
						{ option.assigned.includes.length > 4
							? option.assigned.includes.length - 4
							: option.assigned.includes.length }{ ' ' }
						{ selectedLabel }
					</div>
					<div
						style={ { height: 0, width: 0 } }
						ref={ popUpRef }
					></div>
					<Portal
						hasTransition={ true }
						isOpen={ isHover }
						anchorRef={ popUpRef }
						onClickOutside={ () => setIsHover( false ) }
					>
						<div style={ tooltipStyle }>
							<div
								style={ {
									position: 'absolute',
									height: '4px',
									width: '100%',
									left: '0',
									top: '-4px',
								} }
								onMouseEnter={ () => setIsHover( true ) }
							></div>
							<div
								className="prad-scrollbar prad-overflow-y-auto prad-overflow-x-hidden prad-d-flex prad-flex-column prad-gap-10"
								style={ {
									maxHeight: '360px',
									paddingRight: 10,
								} }
							>
								{ option.assigned.includes?.map(
									( product, index ) => (
										<div
											key={ `prad-product-${ index }` }
											className={ `prad-d-flex prad-item-center prad-gap-12 ` }
										>
											<div className="prad-d-flex prad-item-center prad-gap-8">
												<img
													key={ `profiler-${ product.item_id }` }
													style={ {
														height: 42,
														width: 42,
														borderRadius: 4,
													} }
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
									)
								) }
							</div>
						</div>
					</Portal>
				</div>
			) }
		</div>
	);
};

export default AssignedShow;
