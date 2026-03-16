import ToolBar from '../../../dashboard/toolbar/ToolBar';

const Content = ( props ) => {
	const { settings } = props;

	return (
		<>
			<ToolBar disableTab={ true } { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-content prad-w-full ${ settings.class }` }
			>
				<div
					className="prad-block-content-wrapper"
					dangerouslySetInnerHTML={ {
						__html: settings.previewContent || '',
					} }
				></div>
			</div>
		</>
	);
};

export default Content;
