const { __ } = wp.i18n;
import { useLayoutEffect, useRef, useState } from 'react';
import { useNav } from '../../../context/NavContext';
import Toast from '../../../utils/toaster/Toast';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import Hellobar from './Hellobar';
import './style.scss';

function Header() {
	const [ openDrawer, setOpenDrawer ] = useState( false );

	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
	} );

	const menuRef = useRef( null );
	const linkRefs = useRef( [] );
	const [ exceedingIndex, setExceedingIndex ] = useState( 0 );
	const { currentNav, setCurrentNav } = useNav();

	useLayoutEffect( () => {
		const abortControl = new AbortController();
		let tempIndex = -1;
		const calculateWidths = () => {
			let totalLinkWidth = 0;
			if ( menuRef.current ) {
				const menuWidth = menuRef.current.offsetWidth;
				if ( linkRefs.current ) {
					for (
						let index = 0;
						index < linkRefs.current.length;
						index++
					) {
						const linkRef = linkRefs.current[ index ];
						if ( linkRef ) {
							totalLinkWidth += linkRef.offsetWidth + 0;

							if (
								( tempIndex === -1 &&
									totalLinkWidth > menuWidth ) ||
								( tempIndex !== -1 &&
									totalLinkWidth + 64 > menuWidth )
							) {
								tempIndex = index;
								setExceedingIndex( Math.max( index - 1, 1 ) );
								break;
							} else if (
								index + 1 ===
								linkRefs.current.length - 1
							) {
								tempIndex = -1;
								setExceedingIndex( 0 );
							}
						}
					}
				}
			}
		};

		calculateWidths();

		window.addEventListener( 'resize', calculateWidths, {
			signal: abortControl.signal,
		} );
		return () => abortControl.abort();
	}, [] );

	const menuItems = [
		{ to: 'dashboard', label: 'Overview' },
		{ to: 'lists', label: 'Option List' },
		{ to: 'analytics', label: 'Analytics' },
		{ to: 'settings', label: 'Settings' },
		{ to: 'fonts', label: 'Fonts' },
	];

	return (
		<>
			{ <Hellobar /> }
			<div className="prad-top-menu prad-bg-base1 prad-border-bottom-default prad-bc-border-secondary">
				<div className="prad-container prad-mlg-plr-16 prad-d-flex prad-item-center prad-gap-24 prad-plr-24 prad-relative">
					<div className="prad-header-logo prad-d-flex prad-item-center prad-gap-12 prad-shrink-0">
						<img
							className="prad-menu-logo"
							src={
								pradBackendData.url + 'assets/img/logo-sm.svg'
							}
							alt="menu logo"
						/>
						<div className="prad-version-container">
							{ pradBackendData.version }
						</div>
					</div>
					<div
						className="prad-menu-center prad-d-flex prad-item-center prad-w-full"
						// style={ { maxWidth: '652px' } }
						style={ { maxWidth: '100%' } }
					>
						<Button
							value={ __( 'Create Options', 'product-addons' ) }
							iconName="plus_24"
							background="primary"
							style={ { whiteSpace: 'nowrap' } }
							fontWeight="regular"
							padding="8px 20px"
							onClick={ () => {
								setCurrentNav( 'lists' );
								window.location.href =
									pradBackendData.db_url + 'lists/new';
							} }
						/>
						<div className="prad-menu" ref={ menuRef }>
							{ exceedingIndex !== 0 && (
								<>
									{ menuItems
										.slice( 0, exceedingIndex )
										.map( ( item, index ) => {
											return (
												<a
													ref={ ( el ) =>
														( linkRefs.current[
															index
														] = el )
													}
													key={ index }
													href={ '#' + item.to }
													onClick={ () =>
														setCurrentNav( item.to )
													}
													className={ `prad-menu-item prad-${
														currentNav === item.to
															? 'active'
															: 'inactive'
													}` }
												>
													{ item.label }
												</a>
											);
										} ) }
									<Dropdown
										title={ __(
											'More',
											'prodduct-addons'
										) }
										contentClass="prad-down-4 prad-pt-12 prad-pb-12"
										renderContent={ () => (
											<div className="prad-d-flex prad-flex-column prad-gap-12">
												{ menuItems
													.slice( exceedingIndex )
													.map( ( item, index ) => {
														return (
															<a
																ref={ ( el ) =>
																	( linkRefs.current[
																		exceedingIndex +
																			index
																	] = el )
																}
																key={ index }
																href={
																	'#' +
																	item.to
																}
																onClick={ () =>
																	setCurrentNav(
																		item.to
																	)
																}
																className={ `prad-menu-item prad-${
																	currentNav ===
																	item.to
																		? 'active'
																		: 'inactive'
																}` }
															>
																{ item.label }
															</a>
														);
													} ) }
											</div>
										) }
									/>
								</>
							) }
							{ exceedingIndex === 0 &&
								menuItems.map( ( item, index ) => (
									<a
										ref={ ( el ) =>
											( linkRefs.current[ index ] = el )
										}
										key={ index }
										href={ '#' + item.to }
										onClick={ () =>
											setCurrentNav( item.to )
										}
										className={ `prad-menu-item prad-${
											currentNav === item.to
												? 'active'
												: 'inactive'
										}` }
									>
										{ item.label }
									</a>
								) ) }
						</div>
					</div>
					<div className="prad-btn-group-header prad-d-flex prad-item-center prad-justify-between prad-gap-24 prad-space-nowrap">
						<Button
							onlyIcon={ true }
							iconName="menu_24"
							iconColor="text-dark"
							padding="8px"
							className="prad-btn-menu"
							iconRotation="half"
							onClick={ () => setOpenDrawer( ! openDrawer ) }
						/>
					</div>
				</div>
				<div
					className={ `prad-mobile-menu prad-drawer prad-drawer-menu prad-d-flex prad-flex-column prad-gap-8 prad-${
						openDrawer ? 'active' : 'inactive'
					}` }
				>
					<Button
						onlyIcon={ true }
						iconName="cross_20"
						iconColor="text-dark"
						borderColor="border-primary"
						padding="8px"
						className="prad-btn-menu prad-ml-auto"
						iconRotation="half"
						onClick={ () => setOpenDrawer( ! openDrawer ) }
					/>
					<div className="prad-menu-items prad-d-flex prad-flex-column prad-gap-8 prad-pb-24">
						{ menuItems.map( ( item, index ) => {
							return (
								<a
									ref={ ( el ) =>
										( linkRefs.current[ index ] = el )
									}
									key={ index }
									href={ '#' + item.to }
									onClick={ () => setCurrentNav( item.to ) }
									className={ `prad-menu-item prad-${
										currentNav === item.to
											? 'active'
											: 'inactive'
									}` }
								>
									{ item.label }
								</a>
							);
						} ) }
					</div>
				</div>
				{ toastMessages.state && (
					<Toast
						delay={ 2000 }
						toastMessages={ toastMessages }
						setToastMessages={ setToastMessages }
					/>
				) }
			</div>
		</>
	);
}

export default Header;
