import ToolBar from '../../../dashboard/toolbar/ToolBar';
const { __ } = wp.i18n;
import { useState } from 'react';
import { wowCountries } from './countries';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Telephone = ( props ) => {
	const { settings } = props;
	const [ isOpen, setIsOpen ] = useState( false );
	const [ searchKey, setSearchKey ] = useState( '' );
	const [ flagData, setFlagData ] = useState( {
		code: 'bd',
		dial: '880',
		pos: 288,
	} );

	const blockObject = useAbstractBlock( settings, { ...props } );
	const _showFlag = settings.flagStyle
		? settings.flagStyle !== 'number_only'
		: settings.showFlag;

	const _showFlagDial = settings.flagStyle
		? settings.flagStyle === 'number_flag_code'
		: settings.showFlag;

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-telephone prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-12">
					<div
						className={ `prad-tel-container prad-w-full prad-d-flex prad-item-center ${
							_showFlagDial ? 'prad-tel-flag-active' : ''
						}` }
					>
						{ _showFlag && (
							<div className="prad-tel-country-wrapper prad-relative">
								<div
									className="prad-tel-flag-handler prad-d-flex prad-item-center prad-gap-8"
									onClick={ () => setIsOpen( ! isOpen ) }
								>
									<div
										className="prad-tel-flag prad-flag-selected"
										style={ {
											backgroundPosition: `-${
												flagData.pos || 288
											}px 0`,
										} }
									></div>
									<div
										className={ `prad-flag-arrow ${
											isOpen
												? 'prad-flag-arrow-rotated'
												: ''
										}` }
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="8"
											fill="none"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="1.5"
												d="m1 1 6 6 6-6"
											/>
										</svg>
									</div>
								</div>
								<div
									className={ `prad-tel-country-list-container prad-absolute prad-bg-base2 ${
										isOpen
											? 'prad-flag-drop-visible'
											: 'prad-flag-drop-hidden'
									} ` }
								>
									<div className="prad-country-search">
										<input
											type="text"
											className="prad-country-search-input"
											placeholder={ __(
												'Search',
												'product-addons'
											) }
											onChange={ ( e ) => {
												setSearchKey( e.target.value );
											} }
										/>
									</div>
									<div className="prad-country-list prad-scrollbar">
										{ wowCountries.map(
											( country, index ) => {
												const { code, dial, pos } =
													country;
												if ( searchKey !== '' ) {
													if (
														! (
															country.name
																.toLowerCase()
																.includes(
																	searchKey.toLowerCase()
																) ||
															country.code
																.toLowerCase()
																.includes(
																	searchKey.toLowerCase()
																)
														)
													) {
														return null;
													}
												}
												return (
													<div
														key={ index }
														className={ `prad-country-item ${
															flagData.code ===
															code
																? 'prad-country-item-selected'
																: ''
														}` }
														onClick={ () => {
															setFlagData( {
																code,
																dial,
																pos,
															} );
															setIsOpen( false );
															setSearchKey( '' );
														} }
													>
														<div
															className="prad-tel-flag"
															style={ {
																backgroundPosition: `-${
																	pos || 0
																}px 0`,
															} }
														></div>
														<div className="prad-country-name">
															{ country.name }
														</div>
														<div className="prad-dial-code">
															+{ dial }
														</div>
													</div>
												);
											}
										) }
									</div>
								</div>
							</div>
						) }
						<div className="prad-tel-input-wrapper prad-d-flex prad-item-center prad-w-full">
							{ _showFlagDial && (
								<div className="prad-dial-code-show">
									+{ flagData.dial }
								</div>
							) }
							<input
								className="prad-w-full prad-block-input"
								placeholder={ settings.placeholder }
								type="tel"
								defaultValue={ settings.value }
							/>
						</div>
					</div>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Telephone;
