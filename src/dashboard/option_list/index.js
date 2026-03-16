import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Search from '../../components/Search';
import Select from '../../components/Select';
import { useNav } from '../../context/NavContext';
import icons from '../../utils/Icons';
import ListImporter from '../../utils/ListImporter';
import Pagination from '../../utils/Pagination';
import Skeleton from '../../utils/Skeleton';
import { updateOptionBlockIds } from '../../utils/Utils';
import ConfirmModal from '../../utils/modal';
import Toast from '../../utils/toaster/Toast';
import AssignedShow from './AssignedShow';
import OptionActions from './OptionActions';
import './style.scss';

const { __ } = wp.i18n;

const OptionList = ( { setOptionId, setIsListing } ) => {
	const { setCurrentNav } = useNav();
	const [ optionList, setOptionList ] = useState( [] );
	const [ optionListBlocks, setOptionListBlocks ] = useState( {} );
	const [ totalNav, setTotalNav ] = useState( 0 );
	const [ currentNav, setCurrent ] = useState( 1 );
	const [ bulkIds, setBulkIds ] = useState( [] );
	const [ bulkAction, setBulkAction ] = useState( '' );
	const [ searchKey, setSearchKey ] = useState( '' );
	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
	} );

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ modalMessage, setModalMessage ] = useState( '' );
	const [ confirmAction, setConfirmAction ] = useState( () => () => {} );

	const [ isLoading, setIsLoading ] = useState( true );
	const [ isUpdating, setIsUpdating ] = useState( false );

	const [ activeTab, setActiveTab ] = useState( 'latest' );
	const [ perPage, setPerPage ] = useState(
		localStorage.getItem( 'prad-perpage' ) || '5'
	);
	const bulkActionList = [
		{ value: '', label: 'Bulk Action' },
		{ value: 'delete', label: 'Delete' },
		{ value: 'active', label: 'Active' },
		{ value: 'deactive', label: 'Deactive' },
		{ value: 'export', label: 'Export' },
	];
	const fetchData = useCallback(
		async ( datas ) => {
			const {
				page,
				search,
				order = activeTab,
				isLoad,
				toasts,
			} = datas || {};
			if ( isLoad ) {
				setIsLoading( true );
			}
			setIsUpdating( true );
			try {
				const obj = await wp.apiFetch( {
					method: 'POST',
					path: '/prad/option_list',
					data: {
						wpnonce: pradBackendData.nonce,
						search: search || searchKey,
						page: page || currentNav,
						per_page: perPage,
						order: order === 'oldest' ? 'ASC' : 'DESC',
					},
				} );

				if ( obj.success ) {
					setBulkIds( [] );
					setBulkAction( '' );
					setOptionList( obj.posts );
					setOptionListBlocks( obj.all_blocks );
					setTotalNav( parseInt( obj.page ) );
					setIsLoading( false );
					setIsUpdating( false );
					if ( toasts ) {
						setToastMessages( toasts );
					}
				}
			} catch ( error ) {
				setToastMessages( {
					status: 'error',
					messages: [ error ],
					state: true,
				} );
				setIsLoading( false );
				setIsUpdating( false );
			}
		},
		[ currentNav, activeTab, perPage, searchKey ]
	);
	useEffect( () => {
		fetchData( { isLoad: true } );
	}, [ fetchData ] );

	const debounceRef = useRef( null );
	const handleSearchChange = ( value ) => {
		if ( debounceRef.current ) {
			clearTimeout( debounceRef.current );
		}
		debounceRef.current = setTimeout( () => {
			setCurrent( 1 );
			setSearchKey( value );
		}, 500 );
	};

	const exportAddon = ( ids ) => {
		const exportData = [];
		ids.forEach( ( id ) => {
			const exportBlock = {
				id,
				title:
					optionList.find( ( item ) => item.id === id )?.title ||
					'Untitled',

				blocks: optionListBlocks[ id ]
					? updateOptionBlockIds( optionListBlocks[ id ], true )
					: [],
			};
			exportData.push( exportBlock );
		} );

		const blob = new Blob( [ JSON.stringify( exportData, null, 2 ) ], {
			type: 'application/json',
		} );
		const url = URL.createObjectURL( blob );
		const a = document.createElement( 'a' );
		a.href = url;
		const today = new Date().toISOString().split( 'T' )[ 0 ];
		a.download = `WowAddons-Lists-${ today }.json`;
		a.click();
		URL.revokeObjectURL( url );
	};

	const duplicateOption = async ( id ) => {
		await wp
			.apiFetch( {
				method: 'POST',
				path: '/prad/list_duplicate',
				data: {
					wpnonce: pradBackendData.nonce,
					id,
					content: updateOptionBlockIds(
						optionListBlocks[ id ] || [],
						true
					),
				},
			} )
			.then( ( obj ) => {
				if ( obj.success ) {
					fetchData( {
						page: 1,
						toasts: {
							status: 'success',
							messages: [ 'Option Duplicated' ],
							state: true,
						},
					} );
					setCurrent( 1 );
				}
			} )
			.catch( () => {
				setToastMessages( {
					status: 'error',
					messages: [
						__(
							'You are not allowed to do this',
							'product-addons'
						),
					],
					state: true,
				} );
			} );
	};

	const handleDeleteClick = ( deleteBulkIds ) => {
		setModalMessage(
			__(
				'Are you sure you want to delete this option?',
				'product-addons'
			)
		);
		setConfirmAction( () => () => deleteOption( deleteBulkIds ) );
		setIsModalOpen( true );
	};
	const deleteOption = async ( deleteBulkIds ) => {
		setIsModalOpen( false );
		await wp
			.apiFetch( {
				method: 'POST',
				path: '/prad/list_delete',
				data: {
					wpnonce: pradBackendData.nonce,
					ids: deleteBulkIds,
				},
			} )
			.then( ( obj ) => {
				if ( obj.success ) {
					fetchData( {
						toasts: {
							status: 'success',
							messages: [ 'Option Deleted' ],
							state: true,
						},
					} );
				}
			} )
			.catch( () => {
				setToastMessages( {
					status: 'error',
					messages: [
						__(
							'You are not allowed to do this',
							'product-addons'
						),
					],
					state: true,
				} );
			} );
	};
	const updateOption = async ( action, updateBulkIds ) => {
		let idArray = [];
		if ( typeof updateBulkIds === 'string' ) {
			idArray = updateBulkIds
				.split( ',' )
				.map( ( id ) => Number( id.trim() ) );
		} else if ( typeof updateBulkIds === 'number' ) {
			idArray = [ updateBulkIds ];
		} else if ( Array.isArray( updateBulkIds ) ) {
			idArray = updateBulkIds.map( Number );
		}

		let clonedOptionList = [ ...optionList ];
		clonedOptionList = clonedOptionList.map( ( item ) =>
			idArray.includes( item.id )
				? { ...item, status: action === 'active' ? true : false }
				: item
		);

		setOptionList( clonedOptionList );
		setIsUpdating( true );

		await wp
			.apiFetch( {
				method: 'POST',
				path: '/prad/list_update',
				data: {
					wpnonce: pradBackendData.nonce,
					status: action,
					ids: updateBulkIds,
				},
			} )
			.then( ( obj ) => {
				if ( obj.success ) {
					setIsUpdating( false );
					setToastMessages( {
						status: 'success',
						messages: [
							__( 'Option Status Updated', 'product-addons' ),
						],
						state: true,
					} );
					// fetchData( {
					// 	toasts: {
					// 		status: 'success',
					// 		messages: [ 'Option Status Updated' ],
					// 		state: true,
					// 	},
					// } );
				}
			} )
			.catch( () => {
				setIsUpdating( false );
				setToastMessages( {
					status: 'error',
					messages: [
						__(
							'You are not allowed to do this',
							'product-addons'
						),
					],
					state: true,
				} );
			} );
	};

	const setBulk = ( isSelect = true ) => {
		if ( isSelect === true ) {
			setBulkIds(
				optionList.map( ( option ) => {
					return option.id;
				} )
			);
		} else {
			setBulkIds( [] );
		}
	};

	const setSingle = ( isSelect = true, id = '' ) => {
		if ( isSelect === true ) {
			setBulkIds( [ ...bulkIds, id ] );
		} else {
			const _ids = [ ...bulkIds ];
			_ids.splice( _ids.indexOf( id ), 1 );
			setBulkIds( _ids );
		}
	};

	return (
		<div className="prad-bg-base2">
			{ toastMessages.state && (
				<Toast
					delay={ 2000 }
					toastMessages={ toastMessages }
					setToastMessages={ setToastMessages }
				/>
			) }
			{ isModalOpen && (
				<ConfirmModal
					cancel={ __( 'No', 'product-addons' ) }
					confirm={ __( 'Yes, Delete', 'product-addons' ) }
					message={ modalMessage }
					onConfirm={ confirmAction }
					onCancel={ () => setIsModalOpen( false ) }
				/>
			) }
			<div
				className={ `prad-container prad-mlg-plr-16 prad-plr-60 prad-mt-40 ${
					isLoading || isUpdating ? 'prad-disable' : ''
				}` }
			>
				{ /* ########## Sub Menu 2 ########## */ }
				<div className="prad-pb-24 prad-d-flex prad-md-flex-wrap prad-gap-12 prad-item-center prad-justify-between">
					<div className="prad-btn-group prad-w-full prad-md-justify-center">
						<div className="prad-list-action prad-btn-group prad-flex-nowrap">
							<Select
								className="prad-list-action-select"
								options={ bulkActionList }
								onChange={ ( val ) => {
									setBulkAction( val.value );
								} }
								minWidth="170px"
								selectedOption={ bulkAction }
								backgroundColor="transparent"
							/>
							<Button
								value="Apply"
								onClick={ () => {
									if ( bulkAction !== '' ) {
										if ( bulkAction === 'export' ) {
											const exportData = [];

											bulkIds.forEach( ( id ) => {
												const exportBlock = {
													id,
													title:
														optionList.find(
															( item ) =>
																item.id === id
														)?.title || 'Untitled',

													blocks: optionListBlocks[
														id
													]
														? updateOptionBlockIds(
																optionListBlocks[
																	id
																],
																true
														  )
														: [],
												};
												exportData.push( exportBlock );
											} );

											const blob = new Blob(
												[
													JSON.stringify(
														exportData,
														null,
														2
													),
												],
												{
													type: 'application/json',
												}
											);
											const url =
												URL.createObjectURL( blob );
											const a =
												document.createElement( 'a' );
											a.href = url;
											a.download = `WowAddons-Lists.json`;
											a.click();
											URL.revokeObjectURL( url );
										} else if ( bulkAction === 'delete' ) {
											handleDeleteClick(
												bulkIds.join( ',' )
											);
										} else {
											updateOption(
												bulkAction,
												bulkIds.join( ',' )
											);
										}
									}
								} }
								background="primary"
							/>
							<Button
								value={ __( 'Create Options' ) }
								background="primary"
								className="prad-list-action-create-button"
								onClick={ () => {
									setCurrentNav( 'lists' );
									window.location.href =
										pradBackendData.db_url + 'lists/new';
								} }
							/>
						</div>
					</div>
					<div className="prad-list-action-filter prad-btn-group prad-gap-16 prad-justify-end prad-md-justify-center prad-w-full">
						<ListImporter
							handleChange={ () => {
								fetchData( { isLoad: true, page: 1 } );
							} }
						/>
						<Search
							onChange={ ( value ) => {
								handleSearchChange( value );
							} }
							maxWidth="308px"
						/>
					</div>
				</div>

				<div className="prad-list-table prad-scrollbar prad-br-slg">
					{ /* ########## List Header ########## */ }
					<div className="prad-list-row prad-border-bottom-none prad-bg-base3-soft prad-font-16 prad-font-semi">
						<label
							htmlFor="listing_all_input"
							className="prad-cursor-pointer prad-w-fit"
							aria-label="listing_all_input"
						>
							<input
								className="prad-input-hidden"
								type="checkbox"
								id="listing_all_input"
								name="listing_all_input"
								checked={
									bulkIds.length === 0 ||
									bulkIds.length !== optionList.length
										? false
										: true
								}
								onChange={ ( e ) =>
									setBulk( e.target.checked )
								}
							/>
							<div className="prad-checkbox-custom prad-checkbox-md prad-bg-transparent"></div>
						</label>
						<div className="prad-d-flex  prad-gap-10">
							{ __( 'ID', 'product-addons' ) }
							<div
								className="prad-d-flex prad-flex-column prad-gap-4"
								onClick={ () => {
									setActiveTab(
										activeTab === 'oldest'
											? 'latest'
											: 'oldest'
									);
								} }
								role="button"
								tabIndex="-1"
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										setActiveTab(
											activeTab === 'oldest'
												? 'latest'
												: 'oldest'
										);
									}
								} }
							>
								<div
									className="prad-d-flex prad-cursor-pointer"
									style={ {
										color:
											activeTab === 'oldest'
												? '#070707'
												: '#a09b9b',
									} }
								>
									{ icons.up }
								</div>
								<div
									className="prad-d-flex prad-cursor-pointer"
									style={ {
										color:
											activeTab === 'latest'
												? '#070707'
												: '#a09b9b',
									} }
								>
									{ icons.down }
								</div>
							</div>
						</div>
						<div>{ __( 'Title', 'product-addons' ) }</div>
						<div>{ __( 'Status', 'product-addons' ) }</div>
						<div>
							{ __( 'Assigned Product', 'product-addons' ) }
						</div>
						<div>{ __( 'Options Applied', 'product-addons' ) }</div>
						<div>{ __( 'Action', 'product-addons' ) }</div>
					</div>
					{ isLoading ? (
						<div className="prad-list-body">
							{ Array( Number( perPage ) || 5 )
								.fill( 1 )
								.map( ( val, k ) => {
									return (
										<div
											key={ k }
											className="prad-list-row prad-font-16"
										>
											<Skeleton
												height="16px"
												width="16px"
											/>
											<Skeleton
												height="18px"
												width="70px"
											/>
											<Skeleton
												height="18px"
												width="150px"
											/>
											<Skeleton
												height="18px"
												width="44px"
											/>
											<Skeleton
												height="18px"
												width="170px"
											/>
											<Skeleton
												height="18px"
												width="100px"
											/>
											<div className="prad-d-flex prad-item-center prad-gap-8">
												{ Array( 3 )
													.fill( 1 )
													.map( ( v, i ) => {
														return (
															<Skeleton
																key={ i }
																height="24px"
																width="32px"
															/>
														);
													} ) }
											</div>
										</div>
									);
								} ) }
						</div>
					) : (
						<>
							{ optionList.length > 0 ? (
								<div className="prad-list-body">
									{ optionList.map( ( option, k ) => {
										return (
											<div
												key={ k }
												className="prad-list-row prad-font-16"
											>
												<label
													htmlFor={ option.id }
													className="prad-cursor-pointer prad-w-fit"
													aria-label={ `listing_${ option.id }_input` }
												>
													<input
														className="prad-input-hidden"
														type="checkbox"
														id={ option.id }
														name={ option.id }
														onChange={ ( e ) =>
															setSingle(
																e.target
																	.checked,
																option.id
															)
														}
														checked={ bulkIds.includes(
															option.id
														) }
													/>
													<div className="prad-checkbox-custom prad-checkbox-md prad-bg-transparent"></div>
												</label>
												<div
													className="prad-color-primary prad-cursor-pointer"
													onClick={ () => {
														const url = new URL(
															window.location.href
														);
														const newHash = `#lists/${ option.id }`;
														const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
														window.history.pushState(
															{},
															'',
															newUrl
														);
														setOptionId(
															option.id
														);
														setIsListing( false );
													} }
													role="button"
													tabIndex="-1"
													onKeyDown={ ( e ) => {
														if (
															e.key === 'Enter'
														) {
															const url = new URL(
																window.location.href
															);
															const newHash = `#lists/${ option.id }`;
															const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
															window.history.pushState(
																{},
																'',
																newUrl
															);
															setOptionId(
																option.id
															);
															setIsListing(
																false
															);
														}
													} }
												>
													#{ option.id }
												</div>
												<div
													className="prad-ellipsis prad-list-title prad-cursor-pointer"
													onClick={ () => {
														const url = new URL(
															window.location.href
														);
														const newHash = `#lists/${ option.id }`;
														const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
														window.history.pushState(
															{},
															'',
															newUrl
														);
														setOptionId(
															option.id
														);
														setIsListing( false );
													} }
													role="button"
													tabIndex="-1"
													title={ option.title }
													onKeyDown={ ( e ) => {
														if (
															e.key === 'Enter'
														) {
															const url = new URL(
																window.location.href
															);
															const newHash = `#lists/${ option.id }`;
															const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
															window.history.pushState(
																{},
																'',
																newUrl
															);
															setOptionId(
																option.id
															);
															setIsListing(
																false
															);
														}
													} }
												>
													{ option.title }
												</div>
												<div className="prad-relative">
													<input
														type="checkbox"
														className="prad-input-hide prad-absolute prad-z-9"
														id="prad-option-status"
														checked={
															option.status
														}
														onChange={ () =>
															updateOption(
																option.status
																	? 'deactive'
																	: 'active',
																option.id
															)
														}
													/>
													<label
														htmlFor="prad-option-status"
														className="prad-btn-slider"
														aria-label='Toggle "Active" status'
													></label>
												</div>
												<AssignedShow
													option={ option }
												/>
												<div>
													{ option.options } Options
												</div>
												<OptionActions
													option={ option }
													setOptionId={ setOptionId }
													setIsListing={
														setIsListing
													}
													exportAddon={ exportAddon }
													duplicateOption={
														duplicateOption
													}
													handleDeleteClick={
														handleDeleteClick
													}
												/>
											</div>
										);
									} ) }
								</div>
							) : (
								<div className="prad-text-center prad-pt-10 prad-pb-100">
									<img
										className="prad-mb-24 prad-mt-24"
										src={
											pradBackendData.url +
											'assets/img/empty-cart.png'
										}
										alt="empty cart"
									/>
									<div className="prad-font-32 prad-font-semi prad-mb-16">
										Your First Option is Almost Here!
									</div>
									<div className="prad-font-18 prad-width-650 prad-mb-40">
										Create your first option with ease,
										using our user-friendly interface
										designed for seamless customization.
									</div>
									<div
										className="prad-btn prad-bg-primary prad-d-flex prad-item-center prad-gap-8 prad-center-horizontal prad-br-smd prad-m-auto prad-mt-40"
										onClick={ () => {
											setOptionId( 'new' );
											setIsListing( false );
										} }
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												setOptionId( 'new' );
												setIsListing( false );
											}
										} }
									>
										{ icons.plus_20 }
										{ __(
											'Add New Option',
											'product-addons'
										) }
									</div>
								</div>
							) }
						</>
					) }
				</div>
				<div
					className={ `prad-pt-32 prad-pb-32 prad-d-flex prad-item-center prad-justify-${
						totalNav > 1 ? 'between' : 'end'
					} prad-msm-justify-left prad-msm-flex-wrap prad-gap-8` }
				>
					{ totalNav > 1 && (
						<Pagination
							currentPage={ currentNav }
							totalPages={ totalNav }
							onPageChange={ ( page ) => {
								setCurrent( parseInt( page ) );
							} }
						/>
					) }
					{ optionList.length > 0 && (
						<div className="prad-d-flex prad-item-center prad-gap-8">
							<div className="prad-font-14">Show Result:</div>
							<Select
								options={ [
									{ value: '5', label: '5' },
									{ value: '10', label: '10' },
									{ value: '20', label: '20' },
									{ value: '30', label: '30' },
									{ value: '50', label: '50' },
								] }
								onChange={ ( val ) => {
									setPerPage( val.value );
									localStorage.setItem(
										'prad-perpage',
										val.value
									);
								} }
								width="62px"
								selectedOption={ perPage }
								fontWeight="semi"
								borderRadius="md"
								padding="6px 12px"
							/>
						</div>
					) }
				</div>
			</div>
		</div>
	);
};

export default OptionList;
