import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { getPriceHtml } from '../../../utils/Utils';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const CustomFormula = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar disableTab={ true } { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-custom-formula prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				<div className="prad-d-flex prad-item-center prad-gap-16 prad-mb-12">
					{ blockObject.renderBlockTitleWithRequired() }
					{ blockObject.renderDescriptionTooltip() }
					<div className="prad-block-price prad-text-upper">
						{ getPriceHtml( {
							regular: 123,
							sale: '',
							type: 'fixes',
						} ) }
					</div>
				</div>
				{ blockObject.renderDescriptionBelowTitle() }
			</div>
		</>
	);
};

export default CustomFormula;
