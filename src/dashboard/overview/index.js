const { __ } = wp.i18n;
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import DataChart from '../../components/others/graph/DataChart';
import { useNav } from '../../context/NavContext';
import Icons from '../../utils/Icons';
import UTMLinkGenerator from '../../utils/utm_link';

const generateDummyData = () => {
	const now = new Date();
	const data = [];

	const createEntry = ( daysAgo ) => {
		const date = new Date( now );
		date.setDate( now.getDate() - daysAgo );
		return {
			id: Math.floor( Math.random() * 100 ) + 1,
			date: date.toISOString().split( 'T' )[ 0 ],
			impression_count: Math.floor( Math.random() * 2 ),
			click_count: Math.floor( Math.random() * 6 ),
			add_to_cart_count: Math.floor( Math.random() * 5 ),
			order_count: Math.floor( Math.random() * 3 ),
			sales: Math.floor( Math.random() * 51 ),
		};
	};

	const getRandomOffsets = ( count, maxDaysAgo, minDaysAgo = 0 ) => {
		const offsets = new Set();
		while ( offsets.size < count ) {
			const offset =
				Math.floor( Math.random() * ( maxDaysAgo - minDaysAgo + 1 ) ) +
				minDaysAgo;
			offsets.add( offset );
		}
		return [ ...offsets ];
	};

	// Add 4 within last 7 days
	getRandomOffsets( 4, 6 ).forEach( ( offset ) =>
		data.push( createEntry( offset ) )
	);

	// Add 5 within last 30 days (excluding last 7)
	getRandomOffsets( 5, 30, 7 ).forEach( ( offset ) =>
		data.push( createEntry( offset ) )
	);

	// Add 7 within last 365 days (excluding last 30)
	getRandomOffsets( 7, 365, 31 ).forEach( ( offset ) =>
		data.push( createEntry( offset ) )
	);

	return data;
};

const Overview = () => {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ statsGraph, setStatsGraph ] = useState( [] );

	const { setCurrentNav } = useNav();

	const [ installStatus, setInstallStatus ] = useState( {} );
	const [ installed, setInstalled ] = useState(
		pradBackendData.products || {}
	);
	const [ actives, setActives ] = useState(
		pradBackendData.products_active || {}
	);

	const handleInstall = ( key ) => {
		setInstallStatus( ( prevState ) => ( {
			...prevState,
			[ key ]: 'ing..',
		} ) );

		const formData = new FormData();
		formData.append( 'action', 'prad_install_plugin' );
		formData.append( 'wpnonce', pradBackendData.nonce );
		formData.append( 'plugin', key );

		fetch( pradBackendData.ajax, {
			method: 'POST',
			body: formData,
		} )
			.then( ( response ) => response.json() )
			// .then( () => {} )
			.catch( () => {} )
			.finally( () => {
				setInstallStatus( ( prevState ) => ( {
					...prevState,
					[ key ]: false,
				} ) );
				setInstalled( ( prevState ) => ( {
					...prevState,
					[ key ]: true,
				} ) );
				setActives( ( prevState ) => ( {
					...prevState,
					[ key ]: true,
				} ) );
			} );
	};

	useEffect( () => {
		setIsLoading( true );
		wp.apiFetch( {
			method: 'GET',
			path: '/prad/get_analytics',
		} ).then( ( obj ) => {
			setIsLoading( false );
			if ( obj.success ) {
				setStatsGraph( obj.stats_graph );
			}
		} );
	}, [] );

	const PluginCard = ( { id, icon, title, description } ) => {
		return (
			<div className="prad-card prad-shadow-none prad-p-16 prad-mb-16">
				<div className="prad-d-flex prad-gap-12 prad-item-center prad-justify-between prad-mb-8">
					<div className="prad-d-flex prad-item-center prad-gap-12">
						{ icon }
						<div className="prad-font-14 prad-font-semi">
							{ title }
						</div>
					</div>
					{ ( ! installed[ id ] || ! actives[ id ] ) && (
						<Button
							value={
								! installed[ id ]
									? __( 'Install', 'product-addons' )
									: __( 'Activate', 'product-addons' )
							}
							loading={ installStatus[ id ] }
							color="primary"
							padding="0"
							fontSize="12"
							onClick={ () => handleInstall( id ) }
						/>
					) }
					{ installed[ id ] && actives[ id ] && (
						<div className="prad-bg-light prad-br-smd prad-btn-bordered prad-color-primary prad-font-12 prad-font-semi prad-lh-btn prad-p-12">
							{ __( 'Activated', 'product-addons' ) }
						</div>
					) }
				</div>
				<div className="prad-font-12 prad-ellipsis prad-width-text-14">
					{ description }
				</div>
			</div>
		);
	};

	const renderHeroContent = () => (
		<div className="prad-card prad-mlg-p-16 prad-bg-base1 prad-overview-hero prad-mb-32">
			<div className="prad-w-full">
				<div className="prad-lh-0 prad-mb-16">
					<img
						style={ { maxWidth: '150px' } }
						src={ pradBackendData.url + 'assets/img/main-logo.svg' }
						alt="main logo"
					/>
				</div>
				<div className="prad-font-24 prad-font-extra prad-mb-16">
					{ __(
						'Unlock Customizations without Boundaries',
						'product-addons'
					) }
				</div>
				<div className="prad-font-16 prad-mb-24">
					{ __(
						'Effortlessly add custom product options—text fields, images, swatches, and more!',
						'product-addons'
					) }
				</div>
				<Button
					value={ __( 'Create Options' ) }
					background="primary"
					padding="12px 20px"
					fontSize="18"
					onClick={ () => {
						setCurrentNav( 'lists' );
						window.location.href =
							pradBackendData.db_url + 'lists/new';
					} }
				/>
			</div>
			<div className="prad-lh-0 prad-center-horizontal prad-relative">
				<img
					className="prad-overview-hero-image"
					src={ pradBackendData.url + 'assets/img/overview-hero.png' }
					alt="WowOptions Hero"
				/>
				<img
					className="prad-overview-hero-badge-image"
					src={
						pradBackendData.url +
						'assets/img/overview-hero-badge.svg'
					}
					alt="WowOptions Badge"
				/>
			</div>
		</div>
	);

	const renderTips = () => (
		<div className="prad-card prad-mlg-p-16 prad-bg-base1 prad-p-20 prad-mb-32">
			<div className="prad-d-flex prad-gap-12 prad-item-center prad-justify-between prad-mb-20 prad-font-16 prad-font-bold">
				{ __( 'Resources', 'product-addons' ) }
			</div>
			<div className="prad-card prad-shadow-none prad-p-16 prad-mb-12 prad-d-flex prad-gap-12 prad-item-center prad-justify-between">
				<div>
					<div className="prad-font-14 prad-font-bold">
						{ __( 'Documentation', 'product-addons' ) }
					</div>
				</div>
				<Button
					value={ __( 'Read Now', 'product-addons' ) }
					color="text-dark"
					padding="0"
					fontSize="12"
					textTransform="underline"
					buttonLink={ UTMLinkGenerator( {
						url: 'https://wpxpo.com/docs/wowaddons/',
						utmKey: 'db_doc',
					} ) }
				/>
			</div>
			<div className="prad-card prad-mlg-p-16 prad-shadow-none prad-p-16 prad-mb-12 prad-d-flex prad-gap-12 prad-item-center prad-justify-between">
				<div>
					<div className="prad-font-14 prad-font-bold">
						{ __( 'Beginner Tutorials', 'product-addons' ) }
					</div>
				</div>
				<Button
					value={ __( 'Watch Video', 'product-addons' ) }
					color="text-dark"
					padding="0"
					fontSize="12"
					textTransform="underline"
					buttonLink="https://www.youtube.com/playlist?list=PLPidnGLSR4qfFfyjdTCYIEMdy05U5cLob"
				/>
			</div>
			<div className="prad-card prad-mlg-p-16 prad-shadow-none prad-p-16 prad-mb-12 prad-d-flex prad-gap-12 prad-item-center prad-justify-between">
				<div>
					<div className="prad-font-14 prad-font-bold">
						{ __( 'Feature Requests', 'product-addons' ) }
					</div>
				</div>
				<Button
					value={ __( 'Request a Feature', 'product-addons' ) }
					color="text-dark"
					padding="0"
					fontSize="12"
					textTransform="underline"
					buttonLink="https://www.wpxpo.com/product-addons-for-woocommerce/roadmap/"
				/>
			</div>
		</div>
	);

	return (
		<div className="flynpo-dashboard prad-mlg-plr-16 prad-container prad-plr-32 prad-mt-40">
			<div className="flynpo-dashboard-container-left">
				{ renderHeroContent() }
				{ statsGraph.length < 1 && ! isLoading ? (
					<div className="prad-version-container prad-w-fit prad-mb-10">
						{ __( 'This is Dummy Data', 'product-addons' ) }
					</div>
				) : (
					''
				) }
				<DataChart
					isLoading={ isLoading }
					isOverview={ true }
					chartData={
						statsGraph.length > 0 ? statsGraph : generateDummyData()
					}
				/>
			</div>

			<div className="flynpo-dashboard-container-right">
				{ renderTips() }
			</div>
		</div>
	);
};

export default Overview;
