import icons from './Icons';

const Pagination = ( { currentPage, totalPages, onPageChange } ) => {
	const goToPage = ( page ) => {
		if ( page >= 1 && page <= totalPages ) {
			onPageChange( page );
		}
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];

		if ( totalPages <= 7 ) {
			for ( let i = 1; i <= totalPages; i++ ) {
				pageNumbers.push(
					<Button
						key={ i }
						onClick={ () => goToPage( i ) }
						active={ currentPage === i }
					>
						{ i }
					</Button>
				);
			}
		} else {
			const showLeftEllipsis = currentPage > 4;
			const showRightEllipsis = currentPage < totalPages - 3;

			pageNumbers.push(
				<Button
					key={ 1 }
					onClick={ () => goToPage( 1 ) }
					active={ currentPage === 1 }
				>
					1
				</Button>
			);

			if ( showLeftEllipsis ) {
				pageNumbers.push(
					<Button key={ '...1' } onClick={ () => goToPage( 2 ) }>
						...
					</Button>
				);
			}

			const startPage = Math.max( 2, currentPage - 2 );
			const endPage = Math.min( totalPages - 1, currentPage + 2 );

			for ( let i = startPage; i <= endPage; i++ ) {
				pageNumbers.push(
					<Button
						key={ i }
						onClick={ () => goToPage( i ) }
						active={ currentPage === i }
					>
						{ i }
					</Button>
				);
			}

			if ( showRightEllipsis ) {
				pageNumbers.push(
					<Button
						key={ '...2' }
						onClick={ () => goToPage( totalPages - 1 ) }
					>
						...
					</Button>
				);
			}

			pageNumbers.push(
				<Button
					key={ 'last' }
					onClick={ () => goToPage( totalPages ) }
					active={ currentPage === totalPages }
				>
					{ totalPages }
				</Button>
			);
		}

		return pageNumbers;
	};

	return (
		<div className="prad-pagination">
			<Button
				onClick={ () => goToPage( currentPage - 1 ) }
				disabled={ currentPage === 1 }
			>
				{ icons.leftAngle }
			</Button>

			{ renderPageNumbers() }

			<Button
				onClick={ () => goToPage( currentPage + 1 ) }
				disabled={ currentPage === totalPages }
				classes={ 'prad-mirror-horizontal' }
			>
				{ icons.leftAngle }
			</Button>
		</div>
	);
};

function Button( {
	children,
	onClick,
	disabled = false,
	active = false,
	classes,
} ) {
	const activeClassName = `${ classes } ${ active ? 'prad-active' : '' } ${
		disabled ? 'prad-disable' : ''
	}`.trim();
	return (
		<div
			type="button"
			className={ `prad-pagination-item ${ classes } ${ activeClassName }` }
			onClick={ onClick }
			role="button"
			tabIndex="-1"
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					onClick;
				}
			} }
		>
			{ children }
		</div>
	);
}

export default Pagination;
