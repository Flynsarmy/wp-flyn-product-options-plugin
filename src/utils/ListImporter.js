const { __ } = wp.i18n;
import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Popup from '../components/Popup';
import Toast from './toaster/Toast';

const ListImporter = ( props ) => {
	const { handleChange } = props;
	const fileInputRef = useRef( null );
	const [ exportData, setExportData ] = useState( [] );
	const [ bulkIds, setBulkIds ] = useState( [] );
	const [ progress, setProgress ] = useState( 0 );
	const [ isUploading, setIsUploading ] = useState( false );
	const [ showTmEpoModal, setShowTmEpoModal ] = useState( false );
	const [ isMigrating, setIsMigrating ] = useState( false );
	const [ migrationOutput, setMigrationOutput ] = useState( [] );
	const [ migrationSummary, setMigrationSummary ] = useState( '' );

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
		if ( fileInputRef.current ) {
			fileInputRef.current.value = ''; // Reset file input
		}
	};

	const openFileImport = () => {
		if ( fileInputRef.current ) {
			fileInputRef.current.click();
		}
	};

	const openTmEpoMigration = () => {
		setMigrationOutput( [] );
		setMigrationSummary( '' );
		setShowTmEpoModal( true );
	};

	const runTmEpoMigration = async () => {
		setIsMigrating( true );
		setMigrationOutput( [] );
		setMigrationSummary( '' );

		try {
			const response = await wp.apiFetch( {
				method: 'POST',
				path: '/prad/migrate_tm_epo',
				data: {
					wpnonce: pradBackendData.nonce,
					delete_existing: true,
				},
			} );

			const logs = Array.isArray( response?.logs )
				? response.logs.map( ( item ) => {
					const level = item?.type
						? `[${ String( item.type ).toUpperCase() }] `
						: '';
					return `${ level }${ item?.message || '' }`;
				} )
				: [];

			setMigrationOutput( logs );
			setMigrationSummary(
				response?.message ||
				__( 'TM EPO migration completed.', 'product-addons' )
			);

			if ( response?.success ) {
				setToastMessages( {
					status: 'success',
					messages: [
						response?.message ||
							__(
								'TM EPO migration completed.',
								'product-addons'
							),
					],
					state: true,
				} );
				handleChange();
			} else {
				setToastMessages( {
					status: 'error',
					messages: [
						response?.message ||
							__(
								'TM EPO migration failed.',
								'product-addons'
							),
					],
					state: true,
				} );
			}
		} catch ( error ) {
			setMigrationOutput( [
				error?.message ||
					__(
						'Unexpected error while running TM EPO migration.',
						'product-addons'
					),
			] );
			setMigrationSummary(
				__( 'TM EPO migration failed.', 'product-addons' )
			);
			setToastMessages( {
				status: 'error',
				messages: [
					error?.message ||
						__( 'TM EPO migration failed.', 'product-addons' ),
				],
				state: true,
			} );
		} finally {
			setIsMigrating( false );
		}
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
					const file = e.target.files?.[ 0 ];
					if ( ! file ) {
						return;
					}

					const reader = new FileReader();
					reader.onload = function ( event ) {
						try {
							const jsonObj = JSON.parse(
								event.target.result
							);
							if ( Array.isArray( jsonObj ) ) {
								setExportData( jsonObj );
								return;
							}

							setToastMessages( {
								status: 'error',
								messages: [
									__(
										'Invalid import file format.',
										'product-addons'
									),
								],
								state: true,
							} );
						} catch ( error ) {
							setToastMessages( {
								status: 'error',
								messages: [
									error?.message ||
										__(
											'Unable to parse the selected JSON file.',
											'product-addons'
										),
								],
								state: true,
							} );
						}
					};
					reader.readAsText( file );
				} }
			/>
			<Dropdown
				title={ __( 'Import', 'product-addons' ) }
				iconName="import"
				iconPosition="before"
				className="prad-btn prad-btn-bordered prad-color-text-dark prad-border-default prad-bc-border-secondary prad-font-14 prad-font-semi prad-lh-btn prad-text-center prad-text-none prad-br-smd prad-gap-8"
				labelClassName="prad-mb-0 prad-color-text-dark"
				contentClass="prad-p-8"
				renderContent={ () => (
					<div className="prad-d-flex prad-flex-column prad-gap-4">
						<div
							className="prad-p-8 prad-cursor-pointer prad-br-smd prad-font-14 prad-color-text-dark"
							onClick={ openFileImport }
							role="button"
							tabIndex="0"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									openFileImport();
								}
							} }
						>
							{ __( 'Import from File', 'product-addons' ) }
						</div>
						<div
							className="prad-p-8 prad-cursor-pointer prad-br-smd prad-font-14 prad-color-text-dark"
							onClick={ openTmEpoMigration }
							role="button"
							tabIndex="0"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									openTmEpoMigration();
								}
							} }
						>
							{ __( 'Import from TM EPO', 'product-addons' ) }
						</div>
					</div>
				) }
			/>

			{ showTmEpoModal && (
				<Popup
					className="prad-w-95 prad-width-530"
					title={ __( 'Import from TM EPO', 'product-addons' ) }
					onClose={ () => {
						if ( ! isMigrating ) {
							setShowTmEpoModal( false );
						}
					} }
					footerChildren={
						<div className="prad-d-flex prad-item-center prad-gap-12 prad-ml-auto">
							<Button
								value={ __( 'Close', 'product-addons' ) }
								onlyText={ true }
								onClick={ () => {
									if ( ! isMigrating ) {
										setShowTmEpoModal( false );
									}
								} }
								disable={ isMigrating }
							/>
							<Button
								value={
									isMigrating
										? __( 'Running...', 'product-addons' )
										: __(
											'Run Migration',
											'product-addons'
									  )
								}
								smallButton={ true }
								background="primary"
								onClick={ runTmEpoMigration }
								disable={ isMigrating }
							/>
						</div>
					}
				>
					<div className="prad-font-14 prad-mb-12">
						{ __(
							'Migrate TM Extra Product Options global forms into Product Addons lists.',
							'product-addons'
						) }
					</div>

					{ migrationSummary && (
						<div className="prad-font-13 prad-font-semi prad-mb-12">
							{ migrationSummary }
						</div>
					) }

					<div
						className="prad-bg-base2 prad-br-smd prad-p-12 prad-overflow-auto prad-scrollbar"
						style={ { maxHeight: '36vh' } }
					>
						<pre
							className="prad-font-12 prad-color-text-dark"
							style={ {
								margin: 0,
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
							} }
						>
							{ migrationOutput.length > 0
								? migrationOutput.join( '\n' )
								: __(
									'Click "Run Migration" to start and view output here.',
									'product-addons'
								  ) }
						</pre>
					</div>
				</Popup>
			) }
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
