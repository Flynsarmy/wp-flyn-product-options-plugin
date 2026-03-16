import Icons from '../utils/Icons';

function OptionController( { id, onDelete, children, className = '' } ) {
	const handleDelete = ( i ) => {
		if ( onDelete ) {
			onDelete( i );
		}
	};

	return (
		<div
			key={ id }
			className={ `prad-drag-wrapper prad-relative ${ className }` }
			id={ id }
		>
			<div className="prad-block-option-controller">
				<div
					className="prad-option-delete prad-icon prad-cursor-pointer"
					onClick={ () => handleDelete( id ) }
					role="button"
					tabIndex="-1"
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' ) {
							handleDelete( id );
						}
					} }
				>
					{ Icons.delete }
				</div>
			</div>
			{ children }
		</div>
	);
}

export default OptionController;
