import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { _setFieldData } from '../../../utils/Utils';
import Button from '../../../components/Button';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

// Convert RGBA to HEX
const rgbaToHex = ( rgba ) => {
	const [ r, g, b, a ] = rgba
		.replace( /^rgba?\(|\s+|\)$/g, '' ) // Remove unnecessary characters
		.split( ',' ) // Split into array
		.map( Number ); // Convert to numbers
	const hex = ( x ) => x.toString( 16 ).padStart( 2, '0' ); // Convert to hex and pad
	if ( a === 1 ) {
		return `#${ hex( r ) }${ hex( g ) }${ hex( b ) }`; // Return 6-digit hex if alpha is 1
	}
	return `#${ hex( r ) }${ hex( g ) }${ hex( b ) }${ hex(
		Math.round( a * 255 )
	) }`;
};

const Color = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-color-picker prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div
					className={ `prad-d-flex prad-item-center prad-gap-12 prad-w-full prad-justify-${
						settings.pricePosition === 'with_option'
							? 'left'
							: 'between'
					}` }
				>
					<div className="prad-block-input prad-color-picker-container prad-d-flex prad-item-center prad-gap-8 prad-w-full">
						<input
							type="color"
							value={ settings.defaultColor }
							onChange={ ( e ) => {
								_setFieldData(
									props.setFieldData,
									props.fieldData,
									settings,
									props.position,
									'defaultColor',
									e.target.value
								);
							} }
							className="prad-input"
						/>
						<div className="prad-input-wrapper prad-d-flex prad-item-center prad-justify-between prad-gap-24 prad-w-full">
							<input
								type="text"
								value={
									settings.defaultColor.startsWith( 'rgba' )
										? rgbaToHex( settings.defaultColor )
										: settings.defaultColor
								}
								onChange={ ( e ) =>
									_setFieldData(
										props.setFieldData,
										props.fieldData,
										settings,
										props.position,
										'defaultColor',
										e.target.value
									)
								}
								className="prad-input prad-w-90"
							/>
							<Button
								onlyIcon={ true }
								iconName="cross_20"
								color="text-medium"
								className="prad-color-picker-resetter"
								padding="0px"
								onClick={ () => {
									_setFieldData(
										props.setFieldData,
										props.fieldData,
										settings,
										props.position,
										'defaultColor',
										''
									);
								} }
							/>
						</div>
					</div>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Color;
