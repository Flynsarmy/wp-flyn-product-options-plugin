import Icons from '../utils/Icons';

const Search = ( {
	onChange,
	onFocus,
	maxWidth,
	maxHeight,
	noIcon = false,
	iconPosition = 'after',
	iconBorder = true,
	style,
} ) => {
	const position = iconPosition === 'after' || iconPosition === 'left';
	return (
		<div
			className="prad-search-block prad-font-14 prad-d-flex prad-item-center"
			style={ { maxWidth, maxHeight, ...style } }
		>
			{ ! noIcon && ! position && (
				<div
					className={ `prad-search-icon prad-search-icon-right ${
						! iconBorder && 'prad-border-right-none'
					}` }
				>
					{ Icons.search }
				</div>
			) }
			<input
				className="prad-input prad-bg-transparent prad-border-none"
				type="text"
				placeholder="Search..."
				onChange={ ( e ) => onChange( e.target.value ) }
				onFocus={ () => {
					onFocus && onFocus();
				} }
			/>
			{ ! noIcon && position && (
				<div
					className={ `prad-search-icon prad-search-icon-left ${
						! iconBorder && 'prad-border-left-none'
					}` }
				>
					{ Icons.search }
				</div>
			) }
		</div>
	);
};

export default Search;
