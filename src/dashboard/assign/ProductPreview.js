import { useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import icons from '../../utils/Icons';
const { __ } = wp.i18n;

const ProductPreview = () => {
	const { assignedData, optionId } = useEditor();
	const [ productLink, setProductLink ] = useState( '' );

	useEffect( () => {
		setProductLink( '' );
		const controller = new AbortController();

		wp.apiFetch( {
			path: '/prad/product_link',
			method: 'POST',
			data: { assignedData, optionId },
			signal: controller.signal,
		} )
			.then( ( response ) => {
				if ( response.success && response.published ) {
					if ( assignedData?.aType === 'specific_product' ) {
						const includes = assignedData.includes || [];
						setProductLink( includes[ 0 ]?.url || '' );
					} else {
						setProductLink( response.productLink || '' );
					}
				}
			} )
			.catch( () => {
				setProductLink( '' );
			} );

		return () => controller.abort();
	}, [ assignedData ] );

	if ( ! productLink ) {
		return null;
	}

	return (
		<div>
			<a
				href={ productLink }
				className={ `prad-text-none prad-backend-preview-btn prad-color-primary prad-br-smd prad-bg-light ${
					productLink ? '' : 'prad-disable prad-cursor-not-allowed'
				}` }
				target="_blank"
				rel="noreferrer"
				style={ {
					display: 'flex',
					alignItems: 'center',
					// gap: '4px',
					padding: '0px 10px',
					height: '38px',
				} }
			>
				<span>{ __( 'Preview', 'product-addons' ) }</span>
				{ icons.eye }
			</a>
		</div>
	);
};

export default ProductPreview;
