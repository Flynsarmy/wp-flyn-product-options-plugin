import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Url = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-url prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-12">
					<input
						className="prad-w-full prad-block-input"
						placeholder={ settings.placeholder }
						type="url"
						value={ settings.value }
					/>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Url;
