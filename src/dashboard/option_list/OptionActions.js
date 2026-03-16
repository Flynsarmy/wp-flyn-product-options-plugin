import icons from '../../utils/Icons';

const OptionActions = ( props ) => {
	const {
		option,
		setOptionId,
		setIsListing,
		exportAddon,
		duplicateOption,
		handleDeleteClick,
	} = props;

	return (
		<div className="prad-d-flex prad-item-center prad-gap-8">
			<span
				className="prad-btn-action prad-lh-0"
				onClick={ () => {
					const url = new URL( window.location.href );
					const newHash = `#lists/${ option.id }`;
					const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
					window.history.pushState( {}, '', newUrl );
					setOptionId( option.id );
					setIsListing( false );
				} }
				role="button"
				tabIndex="-1"
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' ) {
						const url = new URL( window.location.href );
						const newHash = `#lists/${ option.id }`;
						const newUrl = `${ url.pathname }${ url.search }${ newHash }`;
						window.history.pushState( {}, '', newUrl );
						setOptionId( option.id );
						setIsListing( false );
					}
				} }
			>
				{ icons.edit }
			</span>
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
