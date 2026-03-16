const { __ } = wp.i18n;
import { useEffect, useState } from 'react';
import DataChart from '../../components/others/graph/DataChart';
import Pagination from '../../utils/Pagination';
import Skeleton from '../../utils/Skeleton';
import './style.scss';

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

	getRandomOffsets( 4, 6 ).forEach( ( offset ) =>
		data.push( createEntry( offset ) )
	);
	getRandomOffsets( 5, 30, 7 ).forEach( ( offset ) =>
		data.push( createEntry( offset ) )
	);
	getRandomOffsets( 7, 365, 31 ).forEach( ( offset ) =>
		data.push( createEntry( offset ) )
	);

	return data;
};

const dummyTable = [
	{
		id: 1,
		title: 'Birthday Cake',
		click: '92',
		cart: '78',
		sales: '736.5',
		assigned: {
			aType: 'all_product',
			includes: [],
			excludes: [],
		},
	},
	{
		id: 2,
		title: 'Summer Collection',
		click: '70',
		cart: '60',
		sales: '1200.5',
		assigned: {
			aType: 'all_product',
			includes: [],
			excludes: [],
		},
	},
	{
		id: 3,
		title: 'Gift Box',
		click: '45',
		cart: '75',
		sales: '355.5',
		assigned: {
			aType: 'all_product',
			includes: [],
			excludes: [],
		},
	},
	{
		id: 4,
		title: 'Candy Collection',
		click: '60',
		cart: '79',
		sales: '266.5',
		assigned: {
			aType: 'all_product',
			includes: [],
			excludes: [],
		},
	},
	{
		id: 5,
		title: 'Clothing',
		click: '35',
		cart: '25',
		sales: '30.5',
		assigned: {
			aType: 'all_product',
			includes: [],
			excludes: [],
		},
	},
];

const Analytics = () => {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ statsTable, setStatsTable ] = useState( [] );
	const [ statsGraph, setStatsGraph ] = useState( [] );
	const [ currentNav, setCurrent ] = useState( 1 );
	const [ tableData, setTableData ] = useState( [] );

	const itemsPerPage = 8;
	const totalNav = Math.ceil( statsTable.length / itemsPerPage );

	useEffect( () => {
		setIsLoading( true );
		wp.apiFetch( {
			method: 'GET',
			path: '/prad/get_analytics',
		} ).then( ( obj ) => {
			setIsLoading( false );
			if ( obj.success ) {
				setStatsTable( obj.stats_table );
				setStatsGraph( obj.stats_graph );
			}
		} );
	}, [] );

	useEffect( () => {
		const startIndex = ( currentNav - 1 ) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		setTableData( statsTable.slice( startIndex, endIndex ) );
	}, [ currentNav, statsTable ] );

	const renderTable = () => {
		return (
			<div className="prad-card prad-bg-base1">
				<div className="prad-list-table prad-scrollbar">
					{ /* ########## List Header ########## */ }
					<div className="prad-list-row prad-list-row2 prad-bg-base3-soft prad-font-16 prad-font-semi">
						<div>{ __( 'ID', 'product-addons' ) }</div>
						<div>{ __( 'Name', 'product-addons' ) }</div>
						<div>
							{ __( 'Applied to (Product)', 'product-addons' ) }
						</div>
						<div>{ __( 'Click Rate', 'product-addons' ) }</div>
						<div>
							{ __( 'Add to Cart Rate', 'product-addons' ) }
						</div>
						<div>{ __( 'Sales', 'product-addons' ) }</div>
					</div>
					{ isLoading ? (
						<div className="prad-list-body">
							{ Array( itemsPerPage )
								.fill( 1 )
								.map( ( val, k ) => {
									return (
										<div
											key={ k }
											className="prad-list-row prad-list-row2 prad-font-16"
										>
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
												width="70px"
											/>
											<Skeleton
												height="18px"
												width="70px"
											/>
											<Skeleton
												height="18px"
												width="70px"
											/>
											<Skeleton
												height="18px"
												width="100px"
											/>
										</div>
									);
								} ) }
						</div>
					) : (
						<div className="prad-list-body">
							{ ( tableData.length > 0
								? tableData
								: dummyTable
							).map( ( option, k ) => {
								let selectedLabel = __(
									'Products',
									'product-addons'
								);
								if (
									option?.assigned?.aType ===
									'specific_category'
								) {
									selectedLabel = __(
										'Categories',
										'product-addons'
									);
								} else if (
									option?.assigned?.aType === 'specific_tag'
								) {
									selectedLabel = __(
										'Tags',
										'product-addons'
									);
								} else if (
									option?.assigned?.aType === 'specific_brand'
								) {
									selectedLabel = __(
										'Brands',
										'product-addons'
									);
								}
								return (
									<div
										key={ k }
										className="prad-list-row prad-list-row2 prad-font-16"
									>
										<div className="prad-color-primary prad-cursor-pointer">
											{ option.id }
										</div>
										<div className="prad-ellipsis prad-list-title">
											{ option.title }
										</div>
										{ option?.assigned?.aType ===
										'all_product' ? (
											<div className="prad-assign-selector">
												<div className="prad-profile-text">
													{ __(
														'All',
														'product-addons'
													) }
												</div>
												<div>
													{ __(
														'All Product',
														'product-addons'
													) }
												</div>
											</div>
										) : (
											<div className="prad-d-flex prad-item-center prad-gap-8 prad-color-active">
												{ option.assigned.includes
													.slice( 0, 4 )
													.map( ( item, i ) => (
														<img
															className="prad-br-100 prad-overlap-item prad-bordered"
															key={ i }
															src={
																item.thumbnail ||
																pradBackendData.url +
																	'assets/img/default-product.svg'
															}
															alt="Assign Product"
														/>
													) ) }
												{ option.assigned.includes
													.length > 4
													? ' +'
													: ' ' }
												{ option.assigned.includes
													.length > 4
													? option.assigned.includes
															.length - 4
													: option.assigned.includes
															.length }{ ' ' }
												{ selectedLabel }
											</div>
										) }
										<div>
											{ option.click > 99
												? 100
												: option.click }
											%
										</div>
										<div>
											{ option.cart > 99
												? 100
												: option.cart }
											%
										</div>
										<div>
											{ option.sales }
											{ pradBackendData.currencySymbol }
										</div>
									</div>
								);
							} ) }
						</div>
					) }
				</div>
				{ totalNav > 1 && (
					<div
						className={ `prad-list-footer prad-d-flex prad-item-center prad-justify-${
							totalNav > 1 ? 'between' : 'end'
						} prad-msm-justify-center prad-msm-flex-wrap prad-gap-8` }
					>
						<Pagination
							currentPage={ currentNav }
							totalPages={ totalNav }
							onPageChange={ ( page ) => {
								setCurrent( parseInt( page ) );
							} }
						/>
					</div>
				) }
			</div>
		);
	};
	const dashboardCard = ( card, k ) => {
		return (
			<div key={ k } className={ `${ card.className }` }>
				<div className="prad-font-18 prad-font-bold prad-color-text-dark prad-mb-16">
					<span>{ card.title }</span>{ ' ' }
					<span className="prad-color-primary">
						{ card?.subTitle }
					</span>
				</div>
				<div className="prad-color-text-light prad-mb-32">
					{ card.content }
				</div>
				{ card.button && <div className="">{ card.button }</div> }
			</div>
		);
	};

	return (
		<div className="flynpo-dashboard prad-container prad-mlg-plr-16 prad-plr-32 prad-mt-40">
			<div className="prad-w-full">
				<div className="prad-mb-40">
					{ statsGraph.length < 1 && ! isLoading ? (
						<div className="prad-version-container prad-w-fit prad-mb-10">
							{ __( 'This is Dummy Data', 'product-addons' ) }
						</div>
					) : (
						''
					) }
					<DataChart
						isLoading={ isLoading }
						chartData={
							statsGraph.length > 0
								? statsGraph
								: generateDummyData()
						}
					/>
				</div>
				{ statsTable.length < 1 && (
					<div className="prad-version-container prad-w-fit prad-mb-10">
						{ __( 'This is Dummy Data', 'product-addons' ) }
					</div>
				) }
				{ renderTable() }
			</div>
		</div>
	);
};

export default Analytics;
