import icons from '../../utils/Icons';

const OptionActions = ( props ) => {
	const {
		option,
		exportAddon,
		duplicateOption,
		handleDeleteClick,
	} = props;
	const editLink = `${ pradBackendData.db_url }lists/${ option.id }`;

	return (
		<div className="prad-d-flex prad-item-center prad-gap-8">
			<a
				href={ editLink }
				className="prad-btn-action prad-lh-0"
			>
				{ icons.edit }
			</a>
			<span
				className="prad-btn-action prad-lh-0"
				onClick={ () => exportAddon( [ option.id ] ) }
				role="button"
				tabIndex="-1"
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' ) {
						exportAddon( [ option.id ] );
					}
				} }
			>
				{ icons.export }
			</span>
			<span
				className="prad-btn-action prad-lh-0"
				onClick={ () => duplicateOption( option.id ) }
				role="button"
				tabIndex="-1"
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' ) {
						duplicateOption( option.id );
					}
				} }
			>
				{ icons.copy }
			</span>
			<span
				className="prad-btn-action prad-lh-0"
				onClick={ () => handleDeleteClick( option.id ) }
				role="button"
				tabIndex="-1"
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' ) {
						handleDeleteClick( option.id );
					}
				} }
			>
				{ icons.delete }
			</span>
		</div>
	);
};

export default OptionActions;
