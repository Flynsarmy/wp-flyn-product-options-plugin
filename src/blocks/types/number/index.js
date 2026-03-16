import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Number = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-number prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div className="prad-d-flex prad-item-center prad-gap-12 prad-mb-12">
					<input
						className="prad-w-full prad-block-input"
						placeholder={ settings.placeholder }
						min={ settings.min }
						max={ settings.max }
						step={ settings.step }
						type="number"
					/>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Number;
