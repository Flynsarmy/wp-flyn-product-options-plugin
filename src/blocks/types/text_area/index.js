import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const TextArea = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-textarea prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<textarea
					style={ {
						textTransform: settings.textTransform || 'none',
					} }
					className="prad-block-input prad-w-full"
					defaultValue={ settings.value }
					placeholder={ settings.placeholder }
					minLength={ settings.min }
					maxLength={ settings.max }
					rows={ settings.step }
				/>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default TextArea;
