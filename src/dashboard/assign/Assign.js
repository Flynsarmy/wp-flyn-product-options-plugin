import { useEffect, useState } from 'react';
import Select from '../../components/Select';
import { useEditor } from '../../context/EditorContext';
import Skeleton from '../../utils/Skeleton';
import ExcludeProducts from './ExcludeProducts';
import IncludeProducts from './IncludeProducts';
import ProductPreview from './ProductPreview';

const { __ } = wp.i18n;

const Assign = ( { optionId, setToastMessages } ) => {
	const [ loading, setLoading ] = useState( false );

	const {
		assignType,
		assignedData,
		setAssignedData,
		handleAssignedData,
		setAssignedProducts,
	} = useEditor();

	const getAssignedProducts = () => {
		setLoading( true );
		wp.apiFetch( {
			method: 'POST',
			path: '/prad/get_assign',
			data: {
				option_id: optionId,
			},
		} )
			.then( ( obj ) => {
				if ( obj.success && obj.assigned ) {
					if ( obj.assigned.aType === '' ) {
						setAssignedProducts( false );
					}
					setAssignedData( obj.assigned );
				}
			} )
			.catch( ( error ) => {
				setToastMessages( {
					status: 'error',
					messages: [ error.message ],
					state: true,
				} );
			} )
			.finally( () => {
				setLoading( false );
			} );
	};

	const handleSelectChange = ( option ) => {
		handleAssignedData( 'aType', option.value );
	};

	useEffect( () => {
		getAssignedProducts();
	}, [] );

	return (
		<>
			{ loading ? (
				<div className="prad-d-flex prad-item-center prad-gap-24 prad-pt-24 prad-pb-24 prad-w-full">
					<div>
						<div className="prad-d-flex prad-item-center prad-gap-8 .prad-bc-border-primary">
							<div
								className="prad-relative"
								style={ { minWidth: '170px' } }
							>
								<Skeleton height="36px" width="100%" />
							</div>
						</div>
					</div>
					<div className="prad-w-full">
						<div className="prad-w-full">
							<Skeleton height="36px" width="100%" />
						</div>
					</div>
				</div>
			) : (
				<div
					className="prad-container-builder-assign prad-d-flex prad-item-center prad-gap-24 prad-pt-24 prad-pb-24 prad-w-full"
					style={ { alignItems: 'end' } }
				>
					<div className="prad-w-full">
						<div className="prad-font-16 prad-font-bold prad-color-text-dark prad-mb-8">
							{ __( 'Product Selection', 'product-addons' ) }
						</div>
						<div className="prad-d-flex prad-item-center prad-gap-8">
							<Select
								options={ assignType }
								onChange={ ( val ) => {
									handleSelectChange( val );
								} }
								className="prad-space-nowrap"
								minWidth="170px"
								selectedOption={
									assignedData.aType || assignType[ 0 ].value
								}
							/>
							<IncludeProducts />
						</div>
					</div>
					{ assignedData.aType !== 'specific_product' && (
						<ExcludeProducts />
					) }
					<ProductPreview />
				</div>
			) }
		</>
	);
};

export default Assign;
