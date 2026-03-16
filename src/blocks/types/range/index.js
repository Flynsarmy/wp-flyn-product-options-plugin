import { useState } from 'react';
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Range = ( props ) => {
	const { settings } = props;
	const [ rangeVal, setRangeVal ] = useState( settings.value || 0 );

	const rangePercentage =
		( ( rangeVal - settings.min || 0 ) /
			( settings.max || 100 - settings.min || 0 ) ) *
		100;

	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-range prad-w-full ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div className="prad-range-input-container">
					<input
						className="prad-block-range-input prad-input"
						min={ settings.min }
						max={ settings.max }
						type="range"
						step={ settings.step }
						onChange={ ( e ) => {
							setRangeVal( e.target.value );
						} }
						value={ rangeVal }
						style={ { '--range-value': `${ rangePercentage }%` } }
					/>
					<input
						min={ settings.min }
						max={ settings.max }
						type="number"
						step={ settings.step }
						onChange={ ( e ) => {
							setRangeVal( e.target.value );
						} }
						value={ rangeVal }
						className="prad-block-input prad-input"
					/>
					{ settings.enablePostfix && settings.postFixText && (
						<div className="prad-range-postfix">
							{ settings.postFixText }
						</div>
					) }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Range;
