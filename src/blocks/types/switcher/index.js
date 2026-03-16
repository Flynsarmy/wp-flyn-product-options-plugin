import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useState, useEffect } from 'react';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Switcher = ( props ) => {
	const { settings, position } = props;
	const item = settings._options[ 0 ];
	const _id = Math.floor( Math.random() * 1000 );
	const [ defaultVal, setDefaultVal ] = useState(
		settings.defval ? settings.defval : []
	);
	useEffect( () => {
		setDefaultVal( settings.defval ? settings.defval : [] );
	}, [ settings.defval ] );

	const blockObject = useAbstractBlock( settings, { ...props } );
	const blockItemImgClass =
		'prad-block-item-img-parent prad-block-img-' +
		( settings.imgStyle || 'normal' );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-switch prad-w-full prad-block-${ settings.blockid } ${ settings.class } ${ blockItemImgClass }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div
					key={ `${ item?.value }` }
					className={ `prad-d-flex prad-item-center prad-gap-12 prad-w-full prad-justify-${
						settings.pricePosition === 'with_option'
							? 'left'
							: 'between'
					}` }
				>
					<div className="prad-switch-item">
						<input
							className="prad-input-hidden"
							name={ `name-` + position }
							type="checkbox"
							id={ `id-` + _id }
							checked={ defaultVal.includes( 0 ) }
							onChange={ () => {
								if ( defaultVal.includes( 0 ) ) {
									setDefaultVal( [] );
								} else {
									setDefaultVal( [ 0 ] );
								}
							} }
						/>
						<label
							htmlFor={ `id-` + _id }
							className="prad-d-flex prad-item-center prad-gap-10"
						>
							<div className="prad-switch-body prad-shrink-0 prad-selection-none">
								<div className="prad-switch-thumb"></div>
							</div>
							<div className="prad-block-content prad-d-flex prad-item-center">
								{ item?.img && (
									<img
										className="prad-block-item-img"
										src={ item?.img }
										alt="Item"
									/>
								) }
								<div
									className="prad-ellipsis-2"
									title={ item?.value }
								>
									{ item?.value }
								</div>
							</div>
						</label>
					</div>
					{ ( ( settings.pricePosition !== 'with_title' &&
						item?.type !== 'no_cost' ) ||
						settings.enableCount === true ) && (
						<div
							className={ `prad-d-flex prad-item-center prad-gap-12` }
						>
							{ blockObject.renderPriceWithOption() }
							{ settings.enableCount === true && (
								<input
									id={ `id__quantity_${ settings.blockid }` }
									name={ `id__quantity_${ settings.blockid }` }
									type="number"
									placeholder={ settings.min }
									min={ settings.min }
									max={ settings.max }
									className={ `prad-block-input prad-quantity-input prad-input` }
								/>
							) }
						</div>
					) }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Switcher;
