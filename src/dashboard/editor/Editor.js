const { __ } = wp.i18n;
import { useEffect, useState, useCallback } from 'react';
import Button from '../../components/Button';
import EditableTitle from '../../components/EditableTitle';
import TabContainer from '../../components/TabContainer';
import { useAddons } from '../../context/AddonsContext';
import { useEditor } from '../../context/EditorContext';
import Skeleton from '../../utils/Skeleton';
import AlertModal from '../../utils/alert';
import ConfirmModal from '../../utils/modal';
import Toast from '../../utils/toaster/Toast';
import Assign from '../assign/Assign';
import Builder from './Builder';
import './editor.scss';
import FontStyles from '../fonts/components/FontStyles';

const Editor = ( props ) => {
	const { optionId, setIsListing, setOptionId } = props;
	const [ saving, setSaving ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ postData, setPostData ] = useState( {} );
	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
	} );

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ isAlertOpen, setIsAlertOpen ] = useState( false );
	const [ modalMessage, setModalMessage ] = useState( '' );
	const [ confirmAction, setConfirmAction ] = useState( () => () => {} );

	const {
		fieldData,
		setFieldData,
		setEditHistory,
		updateDrawer,
		setHasUnsavedChanges,
		hasUnsavedChanges,
		setDrawer,
		setSelectedBlock,
	} = useAddons();

	const {
		setAssignedProducts,
		currentPostCss,
		assignedData,
		saveGlobalStyles,
		globalStyles,
		setSelectProductData,
		customFonts,
		setCustomFonts,
	} = useEditor();

	useEffect( () => {
		// Get elements
		const rootElement = document.documentElement;
		rootElement.classList.add( 'prad-editor-page' );

		// Cleanup function to restore styles on unmount
		return () => {
			rootElement.classList.remove( 'prad-editor-page' );
		};
	}, [] );

	const fetchFonts = useCallback( () => {
		wp.apiFetch( {
			path: '/prad/get_fonts',
			method: 'GET',
		} ).then( ( obj ) => {
			if ( obj.success && obj.data ) {
				setCustomFonts( obj.data );
			}
		} );
	}, [] );

	useEffect( () => {
		fetchFonts();
		if ( optionId !== 'new' ) {
			getOptionData();
		} else if ( optionId === 'new' ) {
			setPostData( {} );
			setFieldData( [] );
			currentPostCss.current = '';
			setIsLoading( false );
		}
	}, [ optionId, fetchFonts ] );

	useEffect( () => {
		const abortControl = new AbortController();
		const handleKeyDown = ( event ) => {
			if (
				( event.ctrlKey || event.metaKey ) &&
				[ 's', 'S' ].includes( event.key )
			) {
				event.preventDefault();
				setOptionData( postData?.status );
			}
		};

		document.addEventListener( 'keydown', handleKeyDown, {
			signal: abortControl.signal,
		} );
		return () => {
			abortControl.abort();
		};
	}, [ postData, fieldData, assignedData, globalStyles ] );

	const getOptionData = () => {
		setIsLoading( true );
		wp.apiFetch( {
			method: 'POST',
			path: '/prad/get_option',
			data: {
				id: optionId,
			},
		} )
			.then( ( obj ) => {
				setIsLoading( false );
				if ( obj.success && obj.post ) {
					setPostData( obj.post );
					if (
						obj.post.content &&
						typeof obj.post.content === 'object'
					) {
						setFieldData( obj.post.content );
					}
				}
			} )
			.catch( ( error ) => {
				setToastMessages( {
					status: 'error',
					messages: [ error.message ],
					state: true,
				} );
			} );
	};

	const setOptionData = ( status = 'draft', initData ) => {
		if (
			assignedData.aType === 'specific_product' &&
			assignedData.includes.length === 0 &&
			status !== 'draft'
		) {
			setIsAlertOpen( true );
			return;
		}
		settingPostData( 'status', status );
		setSaving( true );
		const joinedString = currentPostCss.current
			? Object.values( currentPostCss.current ).join( '' )
			: '';
		localStorage.setItem( 'prad_css', JSON.stringify( joinedString ) );
		setAssignedProducts();
		saveGlobalStyles();
		setHasUnsavedChanges( false );
		wp.apiFetch( {
			method: 'POST',
			path: '/prad/set_option',
			data: {
				id: optionId,
				status,
				title: postData.title || 'Untitled',
				content: initData || fieldData,
				css: joinedString,
			},
		} )
			.then( ( obj ) => {
				setSaving( false );
				if ( obj.id ) {
					setOptionId( obj.id );
					const url = new URL( window.location.href );
					const newHash = `#lists/${ obj.id }`;
					const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
					window.history.pushState( {}, '', newUrl );
					setAssignedProducts( { id: obj.id, type: 'newforce' } );
				}
				if ( obj.message ) {
					setToastMessages( {
						status: 'success',
						messages: [ obj.message ],
						state: obj.success,
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
				setSaving( false );
			} );
	};

	const settingPostData = ( type, value ) => {
		setHasUnsavedChanges( true );
		const _data = { ...postData, [ type ]: value };
		setPostData( _data );
	};

	const handleTabSelection = ( tabItem ) => {
		settingPostData( 'status', tabItem.key );
	};

	const onChange = ( e, title ) => {
		settingPostData( 'title', title );
	};

	const approachExit = () => {
		setIsModalOpen( false );
		setHasUnsavedChanges( false );
		setIsListing( true );
		setDrawer( {} );
		setSelectedBlock( '' );
		setEditHistory( {
			undoStack: [],
			redoStack: [],
		} );

		const url = new URL( window.location.href );
		const newHash = `#lists`;
		const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
		window.history.pushState( {}, '', newUrl );
	};
	const handleExit = () => {
		if ( hasUnsavedChanges ) {
			setModalMessage(
				__(
					'You have unsaved changes. Save Before leave',
					'product-addons'
				)
			);
			setConfirmAction( () => () => {
				setOptionData( postData?.status );
				approachExit();
			} );
			setIsModalOpen( true );
		} else {
			approachExit();
		}
	};

	return (
		<>
			<div
				className={ `prad-bg-base2 ${ saving ? 'prad-disable' : '' }` }
			>
				{ isAlertOpen && (
					<AlertModal
						proceedText={ __( 'Proceed', 'product-addons' ) }
						message={ __(
							'Please choose at least one product.',
							'product-addons'
						) }
						onProceed={ () => {
							setIsAlertOpen( false );
							setSelectProductData( {
								incExc: 'includes',
							} );
							updateDrawer( {
								open: true,
								compo: 'assigned',
							} );
						} }
					/>
				) }
				{ isModalOpen && (
					<ConfirmModal
						cancel={ __( 'Save & Exit', 'product-addons' ) }
						confirm={ __( 'Discard', 'product-addons' ) }
						message={ modalMessage }
						swap={ true }
						onCancel={ confirmAction }
						onConfirm={ () => {
							approachExit();
						} }
					/>
				) }
				{ /* ########## Large Screen Subheader ########## */ }
				<div
					className="prad-editor-large-subheader prad-border-bottom-default prad-bc-border-secondary prad-w-full prad-selection-none"
					style={ {
						position: 'sticky',
						top: '0px',
						backgroundColor: '#f0f0f1',
						zIndex: '999',
					} }
				>
					<div className="prad-editor-large-subheader-content prad-d-flex prad-item-center prad-plr-24">
						<div className="prad-editor-large-subheader-logo prad-header-logo prad-lh-0 prad-border-right-default prad-bc-border-secondary prad-pr-24 prad-pt-10 prad-pb-10">
							<img
								role="button"
								tabIndex="-1"
								className="prad-menu-logo prad-cursor-pointer"
								src={
									pradBackendData.url +
									'assets/img/logo-sm.svg'
								}
								alt="menu logo"
								onClick={ () => {
									handleExit();
								} }
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										handleExit();
									}
								} }
							/>
						</div>
						<div className="prad-editor-large-subheader-button-add prad-border-right-default prad-bc-border-secondary prad-pr-24 prad-pl-24 prad-pt-12 prad-pb-12">
							<Button
								onlyIcon={ true }
								iconName="plus_24"
								background="text-dark"
								padding="6px"
								onClick={ () =>
									updateDrawer( ( prevDrawer ) => ( {
										...prevDrawer,
										open:
											prevDrawer.compo !== 'blockList' ||
											! prevDrawer.open,
										compo: 'blockList',
										sectionid: '',
									} ) )
								}
							/>
						</div>
						{ /* extra button for responsive */ }
						<div className="prad-editor-large-subheader-button-exit prad-border-right-default prad-bc-border-secondary prad-pr-24 prad-pl-24 prad-pt-12 prad-pb-12">
							<Button
								value="Exit"
								iconName="exit"
								background="light"
								color="primary"
								padding="8px"
								onClick={ () => {
									handleExit();
								} }
							/>
						</div>
						<div className="prad-editor-large-subheader-options prad-d-flex prad-item-center prad-justify-between prad-w-full prad-pl-24">
							<div className="prad-editor-large-subheader-options-left prad-d-flex prad-item-center prad-gap-24">
								<Button
									className="prad-mlg-d-none"
									value="Exit"
									iconName="exit"
									color="text-dark"
									padding="6px"
									onClick={ () => {
										handleExit();
									} }
								/>
								{ isLoading ? (
									<div className="prad-border-default prad-br-smd">
										<Skeleton height="30px" width="240px" />
									</div>
								) : (
									<EditableTitle
										className="prad-editor-large-subheader-title"
										initialTitle={
											postData.title || 'Untitled Option'
										}
										onChange={ onChange }
										width="240px"
									/>
								) }
							</div>
							<div className="prad-editor-large-subheader-options-right prad-d-flex prad-item-center prad-gap-24">
								<Button
									value="Global Style"
									iconName="settings"
									onClick={ () =>
										updateDrawer( ( prevDrawer ) => ( {
											open:
												prevDrawer.compo !== 'global' ||
												! prevDrawer.open,
											compo: 'global',
										} ) )
									}
									borderBtn={ true }
									background="light"
									color="primary"
									iconGap="8"
									className="prad-editor-large-subheader-button-global"
								/>
								<div className="prad-btn-group prad-editor-large-subheader-button-status-group">
									{ isLoading ? (
										<div className="prad-border-default prad-br-smd">
											<Skeleton
												height="36px"
												width="152px"
											/>
										</div>
									) : (
										<TabContainer
											tabItems={ [
												{
													key: 'publish',
													label: 'Publish',
												},
												{
													key: 'draft',
													label: 'Draft',
												},
											] }
											initialTabItem={
												postData?.status || 'draft'
											}
											onTabSelect={ ( tab ) =>
												handleTabSelection( tab )
											}
											tabHeaderWidth="auto"
										/>
									) }
									<div
										className={ `${
											saving ? 'disable' : ''
										} prad-editor-large-subheader-button-save prad-bg-primary prad-br-smd prad-btn prad-font-14 prad-font-semi prad-gap-8 prad-lh-btn prad-text-center prad-text-none` }
										onClick={ () =>
											setOptionData(
												postData?.status || 'draft'
											)
										}
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												setOptionData(
													postData?.status || 'draft'
												);
											}
										} }
									>
										{ saving && (
											<div className="prad-d-flex prad-item-center prad-gap-8">
												<div
													key={ 'asd' }
													className="prad-spinner"
												></div>
												Saving
											</div>
										) }
										{ ! saving && (
											<div className="prad-d-flex prad-item-center prad-gap-8">
												{ hasUnsavedChanges ? (
													'Save'
												) : (
													<>
														<svg
															width="16"
															height="16"
															viewBox="0 0 16 16"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M13 5L6.6667 11.3333L4 8.6667"
																stroke="currentColor"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
														Saved
													</>
												) }
											</div>
										) }
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="prad-bg-base1 prad-border-bottom-default prad-bc-border-secondary prad-w-full">
					<div className="prad-container-builder prad-mlg-plr-16 prad-plr-32 ">
						<Assign
							optionId={ optionId }
							setToastMessages={ setToastMessages }
						/>
					</div>
				</div>
				{ /* ########## Builder ########## */ }
				<FontStyles fonts={ customFonts } />
				<div
					className={ `prad-container-builder prad-mlg-plr-16 prad-mlg-pt-16 prad-plr-32 prad-pt-40` }
				>
					<Builder isLoading={ isLoading } />
				</div>
			</div>
			{ toastMessages.state && (
				<Toast
					delay={ 2000 }
					toastMessages={ toastMessages }
					setToastMessages={ setToastMessages }
				/>
			) }
		</>
	);
};

export default Editor;
