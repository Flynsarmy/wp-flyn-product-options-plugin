const { __ } = wp.i18n;
import { useEffect, useState } from 'react';
import { useNav } from '../../../context/NavContext';
import Skeleton from '../../../utils/Skeleton';
import Button from '../../Button';
import Select from '../../Select';
import Graph from './Graph';

const getDateRange = ( type ) => {
	const today = new Date();
	const last7Days = [];
	const last30Days = [];
	const last12Months = [];
	switch ( type ) {
		case 'last_7d':
			for ( let i = 0; i < 7; i++ ) {
				const date = new Date( today );
				date.setDate( today.getDate() - i );
				last7Days.push( date.toISOString().split( 'T' )[ 0 ] );
			}
			return last7Days.reverse();
		case 'last_30d':
			for ( let i = 0; i < 30; i++ ) {
				const date = new Date( today );
				date.setDate( today.getDate() - i );
				last30Days.push( date.toISOString().split( 'T' )[ 0 ] );
			}
			return last30Days.reverse();
		case 'last_12m':
			for ( let i = 0; i < 12; i++ ) {
				const previousMonth = new Date( today );
				previousMonth.setMonth( today.getMonth() - i );

				const formattedDate = `${ previousMonth.getFullYear() }-${ String(
					previousMonth.getMonth() + 1
				).padStart( 2, '0' ) }-01`;
				last12Months.push( formattedDate );
			}

			return last12Months.reverse();
		default:
			return [];
	}
};

const filterByDateRange = ( data, range ) => {
	const now = new Date();
	let startDate;

	switch ( range ) {
		case 'last_7d':
			startDate = new Date( now.getTime() - 7 * 24 * 60 * 60 * 1000 ); // Last 7 days
			break;
		case 'last_30d':
			startDate = new Date( now.getTime() - 30 * 24 * 60 * 60 * 1000 ); // Last 30 days
			break;
		case 'last_12m':
			startDate = new Date(
				now.getFullYear(),
				now.getMonth() - 12,
				now.getDate()
			);
			break;
		default:
			return [];
	}

	return data.filter( ( entry ) => {
		const entryDate = new Date( entry.date );
		return entryDate >= startDate;
	} );
};

const groupDataByMonth = ( data ) => {
	return data.reduce( ( acc, curr ) => {
		const [ year, month ] = curr.date.split( '-' ).map( Number );
		const monthKey = `${ year }-${ month }`;

		if ( ! acc[ monthKey ] ) {
			acc[ monthKey ] = {
				total_sales: 0,
				total_impression_count: 0,
				total_click_count: 0,
				total_add_to_cart_count: 0,
				total_order_count: 0,
				entries: [],
			};
		}

		acc[ monthKey ].entries.push( curr );
		acc[ monthKey ].total_sales += Number( curr.sales );
		acc[ monthKey ].total_impression_count += Number(
			curr.impression_count
		);
		acc[ monthKey ].total_click_count += Number( curr.click_count );
		acc[ monthKey ].total_add_to_cart_count += Number(
			curr.add_to_cart_count
		);
		acc[ monthKey ].total_order_count += Number( curr.order_count );

		return acc;
	}, {} );
};

const mergeDataByMonth = ( groupedData ) => {
	return Object.keys( groupedData ).map( ( monthKey ) => {
		const monthData = groupedData[ monthKey ];
		return {
			id: 1,
			date: `${ monthKey }-01`, // Set the date as the 13th of each month
			impression_count: String( monthData.total_impression_count ),
			click_count: String( monthData.total_click_count ),
			add_to_cart_count: String( monthData.total_add_to_cart_count ),
			order_count: String( monthData.total_order_count ),
			sales: String( monthData.total_sales ),
		};
	} );
};

const DataChart = ( { chartData, isLoading, isOverview } ) => {
	const totalValue = {
		sales: 0,
		order_count: 0,
		click_count: 0,
		add_to_cart_count: 0,
	};
	const chartRangeType = [
		{ value: 'last_7d', label: 'Last 7 Days' },
		{ value: 'last_30d', label: 'Last 30 Days' },
		{ value: 'last_12m', label: 'Last 12 Months' },
	];
	const [ activeTab, setActiveTab ] = useState( 'sales' );
	const [ chartRange, setChartRange ] = useState(
		isOverview ? 'last_12m' : 'last_7d'
	);
	const [ chartFiltered, setChartFiltered ] = useState(
		filterByDateRange( chartData, isOverview ? 'last_12m' : 'last_7d' )
	);

	const { setCurrentNav } = useNav();

	useEffect( () => {
		setChartFiltered( filterByDateRange( chartData, chartRange ) );
	}, [ chartRange, chartData ] );

	chartFiltered.forEach( ( item ) => {
		totalValue.sales = totalValue.sales + Number( item.sales );
		totalValue.order_count =
			totalValue.order_count + Number( item.order_count );
		totalValue.click_count =
			totalValue.click_count + Number( item.click_count );
		totalValue.add_to_cart_count =
			totalValue.add_to_cart_count + Number( item.add_to_cart_count );
	} );

	const allTabs = {
		sales: { color: '#86A62C', label: 'Total Sales (Addons)' },
		order_count: { color: '#86A62C', label: 'Total Orders (Addons)' },
		click_count: { color: '#86A62C', label: 'Clicks Count' },
		add_to_cart_count: { color: '#86A62C', label: 'Add to Cart Count' },
	};

	return (
		<div
			className={ `prad-card prad-mlg-p-16 prad-bg-base1 prad-p-${
				isOverview ? '20' : '32'
			} ${ isLoading ? 'prad-disable' : '' }` }
		>
			{ isOverview ? (
				<div className="prad-performance-chart-header">
					<div>
						<div className="prad-font-20 prad-font-bold prad-mb-8">
							{ __( 'Addons Analytics', 'product-addons' ) }
						</div>
						<div className="prad-font-14">
							{ __(
								'Track Sales, Orders, Clicks, and Add-to-Cart Rate.',
								'product-addons'
							) }
						</div>
					</div>
					<Button
						value={ __( 'All Analytics', 'product-addons' ) }
						iconName="arrowRight"
						iconPosition="after"
						color="primary"
						padding="0"
						onClick={ () => setCurrentNav( 'analytics' ) }
					/>
				</div>
			) : (
				<div className="prad-performance-chart-header">
					<div className="prad-font-24 prad-font-semi">
						{ __( 'Performance Insights', 'product-addons' ) }
					</div>
					<Select
						options={ chartRangeType }
						onChange={ ( option ) => {
							setChartRange( option.value );
						} }
						minWidth="170px"
						selectedOption={ chartRange }
						borderRadius="md"
						padding="9px 10px 9px 20px"
					/>
				</div>
			) }
			<div className="prad-performance-chart-wrapper">
				<div className="prad-performance-chart-legend prad-scrollbar">
					{ Object.entries( allTabs ).map( ( [ key ] ) => (
						<div
							key={ key }
							className={ `prad-performance-chart-filter-item prad-w-full prad-${
								activeTab === key ? 'active' : 'inactive'
							}` }
							onClick={ () => setActiveTab( key ) }
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									setActiveTab( key );
								}
							} }
						>
							<div className="prad-w-full">
								<div className="prad-performance-chart-legend-title prad-font-14 prad-mb-8">
									{ allTabs[ key ]?.label || '' }
								</div>
								<div className="prad-performance-chart-legend-value prad-font-24 prad-font-bold">
									{ isLoading ? (
										<Skeleton height="18px" width="100px" />
									) : (
										<>
											{ key === 'sales'
												? `${ totalValue[ key ] }${ pradBackendData.currencySymbol }`
												: totalValue[ key ] }
										</>
									) }
								</div>
							</div>
						</div>
					) ) }
				</div>
				{ isLoading ? (
					<Skeleton height="450px" />
				) : (
					<Graph
						type={ activeTab }
						chartRange={ chartRange }
						data={
							chartRange === 'last_12m'
								? mergeDataByMonth(
										groupDataByMonth( chartFiltered )
								  )
								: chartFiltered
						}
						xAxisDates={ getDateRange( chartRange ) }
					/>
				) }
			</div>
		</div>
	);
};

export default DataChart;
