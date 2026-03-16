import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useState, useEffect } from 'react';
import { getPriceHtml } from '../../../utils/Utils';
import Icons from '../../../utils/Icons';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';
const { __ } = wp.i18n;

const Select = ( props ) => {
	const { settings } = props;
	const [ isOpen, setIsOpen ] = useState( false );

	const generateLabel = ( item ) => {
		return (
			<div className="prad-d-flex prad-item-center prad-gap-8">
				<div className="prad-block-content prad-d-flex prad-item-center">
					{ item?.img && (
						<img
							className="prad-block-item-img"
							src={ item?.img }
							alt="Item"
						/>
					) }
					<div className="prad-ellipsis-2" title={ item?.value }>
						{ item?.value }
					</div>
				</div>
				{ item?.type !== 'no_cost' && (
					<div className="prad-block-price prad-text-upper">
						{ getPriceHtml( {
							regular: item?.regular,
							sale: item?.sale,
							type: item?.type,
						} ) }
					</div>
				) }
			</div>
		);
	};
	const [ selected, setSelected ] = useState(
		settings.defval &&
			( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
			? generateLabel( settings._options[ settings.defval[ 0 ] ] )
			: __( 'Select an option', 'product-addons' )
	);

	useEffect( () => {
		setSelected(
			settings.defval &&
				( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
				? generateLabel( settings._options[ settings.defval[ 0 ] ] )
				: __( 'Select an option', 'product-addons' )
		);
	}, [ settings.defval, settings._options ] );

	const blockObject = useAbstractBlock( settings, { ...props } );
	const blockItemImgClass =
		'prad-block-item-img-parent prad-block-img-' +
		( settings.imgStyle || 'normal' );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-select prad-w-full prad-block-${ settings.blockid } ${ settings.class } ${ blockItemImgClass }` }
			>
				{ blockObject.renderTitleDescriptionNoPrice() }
				<div className="prad-custom-select prad-w-full">
					<div
						className={ `prad-select-box prad-block-input prad-block-content prad-select-${
							isOpen ? 'open' : 'close'
						}` }
						onClick={ () => setIsOpen( ! isOpen ) }
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								setIsOpen( ! isOpen );
							}
						} }
					>
						{ selected }
						<div className="prad-icon">{ Icons.angleDown }</div>
					</div>
					<div
						className="prad-select-options"
						style={ { display: isOpen ? 'block' : 'none' } }
					>
						{ settings._options.map( ( item, i ) => (
							<div
								key={ i }
								className="prad-select-option"
								onClick={ () => {
									setIsOpen( ! isOpen );
									setSelected( generateLabel( item ) );
								} }
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										setIsOpen( ! isOpen );
									}
								} }
							>
								{ generateLabel( item ) }
							</div>
						) ) }
					</div>
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Select;
