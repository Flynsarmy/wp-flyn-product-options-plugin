import ToolBar from '../../../dashboard/toolbar/ToolBar';

const Separator = ( props ) => {
	const { settings } = props;

	return (
		<>
			<ToolBar disableTab={ true } { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-separator prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				<div
					className="prad-separator-item"
					style={ {
						height: `${ settings.height?.val || 0 }${
							settings.height?.unit ?? 'px'
						}`,
						width: `${ settings.width?.val || 100 }%`,
					} }
				/>
			</div>
		</>
	);
};

export default Separator;
