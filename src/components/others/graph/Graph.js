import { useEffect, useMemo, useRef } from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const normalizeDateString = ( dateStr ) => {
	// Ensure the date is in YYYY-MM-DD format
	const parts = dateStr.split( '-' );
	if ( parts.length === 3 ) {
		const year = parts[ 0 ];
		const month = parts[ 1 ].padStart( 2, '0' ); // Ensure two-digit month
		const day = parts[ 2 ].padStart( 2, '0' ); // Ensure two-digit day
		return `${ year }-${ month }-${ day }`;
	}
	return dateStr;
};

const formatDate = ( dateString, chartRange ) => {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	const [ year, month, day ] = dateString.split( '-' );
	return chartRange === 'last_12m'
		? `${ months[ parseInt( month ) - 1 ] }${ year.slice( 2 ) }`
		: `${ parseInt( day ) }-${ months[ parseInt( month ) - 1 ] }`;
};

const allTabs = {
	sales: 'Sales',
	order_count: 'Orders',
	click_count: 'Clicks',
	add_to_cart_count: 'Add to Cart',
};

const Graph = ( { data, xAxisDates, type, chartRange } ) => {
	const graphRef = useRef( null );
	useEffect( () => {
		if ( graphRef.current ) {
			graphRef.current.style.setProperty(
				'padding',
				'8px 24px',
				'important'
			);
		}
	}, [] );
	const processedData = useMemo( () => {
		const toMatch = xAxisDates;
		return toMatch.map( ( date ) => {
			const matchingData = data.find( ( item ) => {
				return (
					new Date( normalizeDateString( item.date ) )
						.toISOString()
						.split( 'T' )[ 0 ] ===
					new Date( normalizeDateString( date ) )
						.toISOString()
						.split( 'T' )[ 0 ]
				);
			} );
			return {
				date,
				value: matchingData ? parseInt( matchingData[ type ] ) : 0,
			};
		} );
	}, [ data, xAxisDates ] );

	const CustomTooltip = ( { active, payload, label } ) => {
		if ( active && payload && payload.length ) {
			return (
				<div
					ref={ graphRef }
					style={ {
						background: '#ffffff',
						border: '1px solid black',
						borderRadius: '4px',
					} }
					className="prad-d-flex prad-item-center prad-gap-4 prad-flex-column"
				>
					<div className="">{ formatDate( label, chartRange ) }</div>
					<div className="">
						{ allTabs[ type ] }:{ ' ' }
						{ payload[ 0 ].value.toLocaleString() }
						{ type === 'sales'
							? pradBackendData.currencySymbol
							: ' ' }
					</div>
				</div>
			);
		}
		return null;
	};
	return (
		<div className="flynpo-dashboard-graph" style={ { height: '458px' } }>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={ processedData }>
					<defs>
						<linearGradient
							id="colorSales"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="5%"
								stopColor="#86a62c"
								stopOpacity={ 0.2 }
							/>
							<stop
								offset="95%"
								stopColor="#86a62c"
								stopOpacity={ 0 }
							/>
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" vertical={ false } />
					<XAxis
						dataKey="date"
						tickFormatter={ ( date ) =>
							formatDate( date, chartRange )
						}
						interval="preserveStartEnd"
					/>
					<YAxis />
					<Tooltip content={ <CustomTooltip /> } />
					<Area
						type="monotone"
						dataKey="value"
						stroke="#86a62c"
						fillOpacity={ 1 }
						fill="url(#colorSales)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default Graph;
