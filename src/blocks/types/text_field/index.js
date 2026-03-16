import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const TextField = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-textfield prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div
					className={ `prad-d-flex prad-item-center prad-gap-12 prad-w-full` }
				>
					<input
						style={ {
							textTransform: settings.textTransform || 'none',
						} }
						className="prad-block-input prad-w-full"
						type="text"
						placeholder={ settings.placeholder }
						minLength={ settings.minChar }
						maxLength={ settings.maxChar }
					/>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default TextField;
