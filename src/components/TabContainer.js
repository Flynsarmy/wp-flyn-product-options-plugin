const TabContainer = ( {
	wrapperClass,
	className = '',
	tabItems = [],
	initialTabItem = '',
	onTabSelect,
	children,
	containerClass = '',
	type = 'primary',
	tabHeaderTitle,
	tabHeaderClass,
	tabHeaderWidth = 'full',
	tabHeaderSpaceBottom = '0',
	tabHeaderAlign = 'center',
	tabHeaderJustify = 'left',
	tabHeaderDirection = 'row',
	tabHeaderGap = '12',
	padding = '',
	style,
	containerStyle,
} ) => {
	const handleClick = ( tabItem ) => {
		if ( onTabSelect ) {
			onTabSelect( tabItem );
		}
	};

	const selectedTab = tabItems.find( ( tab ) => tab.key === initialTabItem );

	return (
		<>
			<div
				className={ `prad-mb-${ tabHeaderSpaceBottom } prad-d-flex prad-w-${ tabHeaderWidth } prad-gap-${ tabHeaderGap } prad-item-${ tabHeaderAlign } prad-justify-${ tabHeaderJustify } prad-flex-${ tabHeaderDirection } prad-tab-${ type } 
					${ wrapperClass ? wrapperClass : '' } ` }
			>
				{ tabHeaderTitle && (
					<div className={ tabHeaderClass }>{ tabHeaderTitle }</div>
				) }
				<div
					className={ `prad-tab-container prad-tab-container-${ type } ${
						className ? className : ''
					}` }
				>
					{ tabItems.map( ( tabItem, index ) => (
						<div
							className={ `prad-tab-item prad-${
								initialTabItem === tabItem.key
									? 'active'
									: 'inactive'
							}` }
							key={ index }
							onClick={ () => {
								if ( initialTabItem !== tabItem.key ) {
									handleClick( tabItem );
								}
							} }
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									if ( initialTabItem !== tabItem.key ) {
										handleClick( tabItem );
									}
								}
							} }
							style={ {
								padding,
								...style,
							} }
						>
							{ tabItem.label }
						</div>
					) ) }
				</div>
			</div>

			{ children && (
				<div
					className={ `prad-tab-content ${ containerClass }` }
					style={ { ...containerStyle } }
				>
					{ selectedTab && children( selectedTab ) }
				</div>
			) }
		</>
	);
};

export default TabContainer;
