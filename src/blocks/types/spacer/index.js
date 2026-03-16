import ToolBar from '../../../dashboard/toolbar/ToolBar';

const Spacer = ( props ) => {
	const { settings } = props;
	return (
		<>
			<ToolBar disableTab={ true } { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-spacer prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				<div
					style={ {
						backgroundColor: 'transparent',
						height: `${ settings.height?.val }${ settings.height?.unit }`,
						width: '100%',
					} }
				/>
			</div>
		</>
	);
};

export default Spacer;
