import React, { useCallback, useEffect, useState } from 'react';
import FieldToggle from '../../blocks/settings/common/FieldToggle';
import NumberField from '../../components/number_field';
import TextField from '../../components/text_field';
import Skeleton from '../../utils/Skeleton';
import Toast from '../../utils/toaster/Toast';

const { __ } = wp.i18n;

const Settings = () => {
	const [ loading, setLoading ] = useState( false );
	const [ saving, setSaving ] = useState( false );
	const [ settings, setSettings ] = useState( {} );
	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
	} );

	useEffect( () => {
		setLoading( true );
		wp.apiFetch( {
			path: '/prad/get_settings',
			method: 'GET',
		} )
			.then( ( obj ) => {
				if ( obj.success && obj.response ) {
					setSettings( obj.response );
				}
			} )
			.catch( () => {
				// setMessage( __( 'Failed to load settings', 'product-addons' ) );
				setToastMessages( {
					status: 'error',
					messages: [
						__( 'Failed to load settings', 'product-addons' ),
					],
					state: true,
				} );
			} )
			.finally( () => setLoading( false ) );
	}, [] );

	const handleSave = useCallback( () => {
		setSaving( true );
		wp.apiFetch( {
			path: '/prad/set_settings',
			method: 'POST',
			data: { settings: settings },
		} )
			.then( () => {
				setToastMessages( {
					status: 'success',
					messages: [
						__( 'Settings saved successfully!', 'product-addons' ),
					],
					state: true,
				} );
			} )
			.catch( () => {
				setToastMessages( {
					status: 'error',
					messages: [ __( 'Save failed', 'product-addons' ) ],
					state: true,
				} );
			} )
			.finally( () => setSaving( false ) );
	}, [ settings ] );

	const handleChange = useCallback( ( key, value ) => {
		setSettings( ( prev ) => ( {
			...prev,
			[ key ]: value,
		} ) );
	}, [] );

	const sanitizeNumber = ( value ) => {
		const num = Number( value );
		return num < 0 ? 0 : num;
	};

	return (
		<>
			<div className="prad-container prad-plr-32 prad-d-flex prad-justify-between prad-item-center prad-mb-24 prad-mt-32">
				<div className="prad-font-24 prad-font-semi">
					{ __( 'Settings', 'product-addons' ) }
				</div>
			</div>

			<div className="prad-settings-page flynpo-dashboard prad-container prad-mlg-plr-16 prad-plr-32 prad-mt-40">
				<div
					className="prad-card prad-mlg-p-16 prad-bg-base1 prad-p-32 prad-w-full"
					style={ {
						borderRadius: '12px',
					} }
				>
					<div>
						{ loading ? (
							<div className="prad-d-grid prad-msm-d-flex prad-msm-flex-column prad-column-2 prad-mlg-column-1 prad-gap-24">
								<div>
									{ [ ...Array( 5 ) ].map( ( _, i ) => (
										<Skeleton
											height={ 40 }
											width={ 560 }
											key={ i }
										/>
									) ) }
								</div>
								<div>
									{ [ ...Array( 5 ) ].map( ( _, i ) => (
										<Skeleton
											height={ 40 }
											width={ 560 }
											key={ i }
										/>
									) ) }
								</div>
							</div>
						) : (
							<div className="prad-d-grid prad-msm-d-flex prad-msm-flex-column prad-column-2 prad-mlg-column-1 prad-gap-24">
								<div
									className="prad-bg-base2"
									style={ { borderRadius: '8px' } }
								>
									<div className="prad-p-16 prad-font-16 prad-font-bold prad-border-bottom-default">
										{ __(
											'Cleanup Upload Field Files',
											'product-addons'
										) }
									</div>
									<div className="prad-p-16 prad-d-flex prad-flex-column prad-gap-24">
										<div>
											<div className="prad-font-semi">
												{ __(
													'Files that are uploaded but not placed in order',
													'product-addons'
												) }
											</div>
											<div>
												<NumberField
													className="prad-mt-8"
													name={ 'uploadTempRemove' }
													value={
														settings.uploadTempRemove ??
														''
													}
													onChange={ ( value ) =>
														handleChange(
															'uploadTempRemove',
															sanitizeNumber(
																value
															)
														)
													}
													min={ 0 }
												/>
												<div className="prad-help-message">
													{ __(
														'Removes after a specified number of days.',
														'product-addons'
													) }
												</div>
											</div>
										</div>
										<div>
											<div className="prad-font-semi">
												{ __(
													'Files that are uploaded and placed in order',
													'product-addons'
												) }
											</div>
											<div>
												<NumberField
													className="prad-mt-8"
													name={
														'uploadOrderPlacedRemove'
													}
													value={
														settings.uploadOrderPlacedRemove ??
														''
													}
													onChange={ ( value ) =>
														handleChange(
															'uploadOrderPlacedRemove',
															sanitizeNumber(
																value
															)
														)
													}
													min={ 0 }
												/>
												<div className="prad-help-message">
													{ __(
														'Removes after a specified number of days.',
														'product-addons'
													) }
												</div>
											</div>
										</div>
										<div>
											<div className="prad-font-semi">
												{ __(
													'Files that are uploaded and completed in order',
													'product-addons'
												) }
											</div>
											<div>
												<NumberField
													className="prad-mt-8"
													name={ `uploadOrderCompletedRemove` }
													value={
														settings.uploadOrderCompletedRemove ??
														''
													}
													onChange={ ( value ) =>
														handleChange(
															'uploadOrderCompletedRemove',
															sanitizeNumber(
																value
															)
														)
													}
													min={ 0 }
												/>
												<div className="prad-help-message">
													{ __(
														'Removes after a specified number of days.',
														'product-addons'
													) }
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className="prad-bg-base2"
									style={ { borderRadius: '8px' } }
								>
									<div className="prad-p-16 prad-font-16 prad-font-bold prad-border-bottom-default">
										{ __(
											'Other Settings',
											'product-addons'
										) }
									</div>

									<div className="prad-p-16 prad-d-flex prad-flex-column prad-gap-24">
										<div>
											<FieldToggle
												fieldKey={
													'enableAddonsPriceText'
												}
												checked={
													settings.enableAddonsPriceText ??
													true
												}
												label={
													'Enable Addons Price Text In Product Page'
												}
												handleChange={ ( value ) =>
													handleChange(
														'enableAddonsPriceText',
														value
													)
												}
											/>
											{ ( settings.enableAddonsPriceText ??
												true ) && (
												<div>
													<TextField
														// inline={ true }
														name={
															'addonsPriceText'
														}
														value={
															settings.addonsPriceText ??
															'Addons Price'
														}
														onChange={ ( value ) =>
															handleChange(
																'addonsPriceText',
																value
															)
														}
														min={ 0 }
														className="prad-mt-8"
													/>
													<div className="prad-help-message">
														{ __(
															'Change your Addon Price text here.',
															'product-addons'
														) }
													</div>
												</div>
											) }
										</div>
										<div>
											<FieldToggle
												fieldKey={
													'enableAddonsPriceTotalText'
												}
												checked={
													settings.enableAddonsPriceTotalText ??
													true
												}
												label={
													'Enable Addons Price Total Text In Product Page'
												}
												handleChange={ ( value ) =>
													handleChange(
														'enableAddonsPriceTotalText',
														value
													)
												}
											/>
											{ ( settings.enableAddonsPriceTotalText ??
												true ) && (
												<div>
													<TextField
														// inline={ true }
														name={
															'totalPriceText'
														}
														value={
															settings.totalPriceText ??
															'Total Price'
														}
														onChange={ ( value ) =>
															handleChange(
																'totalPriceText',
																value
															)
														}
														min={ 0 }
														className="prad-mt-8"
													/>
													<div className="prad-help-message">
														{ __(
															'Change your Total Price text here.',
															'product-addons'
														) }
													</div>
												</div>
											) }
										</div>
										<div>
											<FieldToggle
												fieldKey={
													'enableSelectOptionInShop'
												}
												checked={
													settings.enableSelectOptionInShop ??
													true
												}
												label={
													'Enable Select Options In Shop Page Products'
												}
												handleChange={ ( value ) =>
													handleChange(
														'enableSelectOptionInShop',
														value
													)
												}
											/>
											{ ( settings.enableSelectOptionInShop ??
												true ) && (
												<div>
													<TextField
														// inline={ true }
														name={
															'shopAddToCartText'
														}
														value={
															settings.shopAddToCartText ??
															'Select Options'
														}
														onChange={ ( value ) =>
															handleChange(
																'shopAddToCartText',
																value
															)
														}
														min={ 0 }
														className="prad-mt-8"
													/>
													<div className="prad-help-message">
														{ __(
															'Change your shop page Add to Cart text here.',
															'product-addons'
														) }
													</div>
												</div>
											) }
										</div>
									</div>
								</div>
							</div>
						) }
					</div>

					<div
						className={ `prad-btn prad-bg-primary prad-font-14 prad-font-regular prad-text-center prad-text-none prad-br-smd prad-mt-24 ${
							saving || loading
								? 'prad-opacity-50 prad-cursor-not-allowed'
								: 'prad-cursor-pointer'
						}` }
						onClick={ () => {
							if ( ! saving && ! loading ) {
								handleSave();
							}
						} }
					>
						{ saving
							? __( 'Saving…', 'product-addons' )
							: __( 'Save Settings', 'product-addons' ) }
					</div>

					{ toastMessages.state && (
						<Toast
							delay={ 2000 }
							toastMessages={ toastMessages }
							setToastMessages={ setToastMessages }
						/>
					) }
				</div>
			</div>
		</>
	);
};

export default React.memo( Settings );
