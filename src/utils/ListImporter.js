const { __ } = wp.i18n;
import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import Popup from '../components/Popup';
import Toast from './toaster/Toast';

const ListImporter = ( props ) => {
	const { handleChange } = props;
	const fileInputRef = useRef( null );
	const [ exportData, setExportData ] = useState( [] );
	const [ bulkIds, setBulkIds ] = useState( [] );
	const [ progress, setProgress ] = useState( 0 );
	const [ isUploading, setIsUploading ] = useState( false );

	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
	} );

	useEffect( () => {
		setBulkIds( exportData.map( ( item ) => item.id ) );
	}, [ exportData ] );

	const handleBulkSelection = ( itemId ) => {
		setBulkIds( ( prev ) =>
			prev.includes( itemId )
				? prev.filter( ( id ) => id !== itemId )
				: [ ...prev, itemId ]
		);
	};

	const handleImport = async () => {
		try {
			const totalRequests = bulkIds.length;
			setIsUploading( true );
			let successfulRequests = 0;

			const promises = bulkIds.map( ( id ) => {
				const targetList = exportData.find(
					( item ) => item.id === id
				);
				return wp
					.apiFetch( {
						method: 'POST',
						path: '/prad/list_import',
						data: {
							wpnonce: pradBackendData.nonce,
							title: targetList?.title,
							content: targetList?.blocks,
						},
					} )
					.then( ( obj ) => {
						if ( obj.success ) {
							successfulRequests++;
						}
						setProgress(
							Math.round(
								( successfulRequests / totalRequests ) * 100
							)
						);
						if (
							Math.round(
								( successfulRequests / totalRequests ) * 100
							) === 100
						) {
							setToastMessages( {
								status: 'success',
								messages: [ obj.message ],
								state: obj.success,
							} );
						}
					} )
					.catch( ( error ) => {
						setToastMessages( {
							status: 'error',
							messages: [ error.message ],
							state: true,
						} );
						setProgress( 0 );
					} );
			} );

			await Promise.all( promises );
			setTimeout( () => {
				handleChange();
				onClose();
			}, 600 );
		} catch ( error ) {
			setToastMessages( {
				status: 'error',
				messages: [ error.message ],
				state: true,
			} );
			setProgress( 0 );
		} finally {
			setIsUploading( false );
		}
	};

	const onClose = () => {
		setExportData( [] );
		setProgress( 0 );
		fileInputRef.current.value = ''; // Reset file input
	};

	return (
		<div>
			{ exportData.length > 0 && (
				<div>
					<Popup
						className="prad-w-95 prad-width-530"
						title={ __( 'Import Lists', 'product-addons' ) }
						onClose={ onClose }
						footerChildren={
							<Button
								value="Save"
								smallButton={ true }
								background="primary"
								className={ `prad-ml-auto ${
									progress !== 0 ? 'prad-disable' : ''
								}` }
								disable={ progress !== 0 }
								onClick={ () => {
									bulkIds.length > 0
										? handleImport()
										: setToastMessages( {
												status: 'error',
												messages: [
													__(
														'Select at least item from the list',
														'product-addons'
													),
												],
												state: true,
										  } );
								} }
							/>
						}
					>
						<div
							className="prad-overflow-auto prad-scrollbar"
							style={ { maxHeight: '30vh' } }
						>
							{ exportData.map( ( item, i ) => {
								return (
									<label
										key={ i }
										htmlFor={ `prad_import_item_${ item.id }` }
										aria-label="prad import item"
										className={ `prad-w-full prad-d-flex prad-item-center prad-gap-12 prad-cursor-pointer prad-pb-20 prad-pt-20 prad-border-bottom-default` }
									>
										<input
											className="prad-input-hidden"
											type="checkbox"
											id={ `prad_import_item_${ item.id }` }
											checked={ bulkIds.includes(
												item.id
											) }
											onChange={ () => {
												handleBulkSelection( item.id );
												setProgress( 0 );
											} }
										/>
										<div className="prad-checkbox-custom"></div>
										<div className="prad-lh-0">
											<img
												style={ {
													width: '46px',
													height: '46px',
													filter: 'grayscale(1)',
												} }
												src={
													pradBackendData.url +
													'assets/img/logo-sm.svg'
												}
												alt="option logo"
											/>
										</div>
										<div>
											<div className="prad-font-12">
												Id: { item.id }
											</div>
											<div className="prad-font-12 prad-font-semi prad-mb-4">
												Title: { item.title + '' }
											</div>
											<div className="prad-font-12">
												Total: { item.blocks.length }{ ' ' }
												Option
												{ item.blocks.length > 1
													? 's'
													: '' }
											</div>
										</div>
									</label>
								);
							} ) }
						</div>

						{ isUploading && (
							<div className="prad-mb-32 prad-mt-32">
								<div>
									{ __( 'Uploading:', 'product-addons' ) }{ ' ' }
									{ progress }%
								</div>
								<progress
									className="prad-progress-custom"
									style={ {
										height: '10px',
										borderRadius:
											'var(--prad-border-radius-md)',
									} }
									value={ progress }
									max="100"
								/>
							</div>
						) }
					</Popup>
				</div>
			) }
			<input
				type="file"
				className="prad-d-none prad-input"
				accept="application/json"
				ref={ fileInputRef }
				onChange={ ( e ) => {
					const reader = new FileReader();
					reader.onload = function ( event ) {
						const jsonObj = JSON.parse( event.target.result );
						if ( Array.isArray( jsonObj ) ) {
							setExportData( jsonObj );
						}
					};
					reader?.readAsText( e.target.files[ 0 ] );
				} }
			/>
			<Button
				value="Import"
				iconName="import"
				onClick={ () => {
					fileInputRef.current.click();
				} }
				borderBtn={ true }
				color="text-dark"
				borderColor="border-secondary"
			/>
			{ toastMessages.state && (
				<Toast
					delay={ 2000 }
					toastMessages={ toastMessages }
					setToastMessages={ setToastMessages }
				/>
			) }
		</div>
	);
};

export default ListImporter;
