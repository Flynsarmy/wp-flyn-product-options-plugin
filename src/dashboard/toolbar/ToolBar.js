import Icons from '../../utils/Icons';
import {
	getSelectedAfterRemoved,
	handleBlockAction,
	updateBlockAttr,
} from '../../utils/Utils';
import { useAddons } from '../../context/AddonsContext';
import { useEditor } from '../../context/EditorContext';

const ToolBar = ( props ) => {
	const { setFieldData, settings, fieldData, position } = props;
	const { updateDraggData, updateDrawer, upDateSelectedBlock } = useAddons();
	const { setUpdateProductImageData } = useEditor();

	const toolbarSetData = ( type, val ) => {
		setFieldData( ( prevState ) => {
			let final = [ ...prevState ];
			if ( settings.sectionid ) {
				final = updateBlockAttr( {
					allBlocks: [ ...final ],
					blockid: settings.blockid,
					objKey: type,
					objValue: val,
				} );
			} else {
				const _val = { ...settings, [ type ]: val };
				final.splice( position, 1, _val );
			}
			return final;
		} );
	};

	const handleDragStart = ( e, block ) => {
		updateDraggData( { type: 'blocks', id: block.blockid } );

		e.dataTransfer.setData( 'pradBlock', JSON.stringify( block ) );
		e.dataTransfer.setData( 'pradAction', 'existing' );
		e.dataTransfer.effectAllowed = 'copyMove';

		const dragImage = document.createElement( 'div' );
		dragImage.innerHTML = `<strong>${
			block.label || block.type
		} Block</strong>`;
		dragImage.style.position = 'absolute';
		dragImage.style.textTransform = 'capitalize';
		dragImage.style.padding = '10px 15px';
		dragImage.style.background = 'rgba(0, 0, 0, 1)';
		dragImage.style.color = '#fff';
		dragImage.style.fontSize = '14px';
		dragImage.style.borderRadius = '6px';
		dragImage.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.2)';
		dragImage.style.pointerEvents = 'none';
		dragImage.style.zIndex = '1000';

		document.body.appendChild( dragImage );
		document.body.offsetHeight;
		e.dataTransfer.setDragImage( dragImage, 10, 10 );
		setTimeout( () => document.body.removeChild( dragImage ), 0 );
	};

	return (
		props?.isSelected && (
			<div className="prad-toolbar-container">
				<div className="prad-toolbar-item">
					<div
						className="prad-icon"
						style={ { cursor: 'move' } }
						draggable
						onDragStart={ ( e ) => handleDragStart( e, settings ) }
						onDragEnd={ ( e ) => {
							e.preventDefault();
							updateDraggData( { type: 'blocks', id: '' } );
						} }
					>
						{ Icons.drag }
					</div>
				</div>
				{ ( [ 'radio', 'checkbox' ].includes( settings.type ) ||
					( settings.type === 'products' &&
						settings.blockType !== '_swatches' ) ) && (
					<div className="prad-toolbar-item">
						<div
							className="prad-icon"
							onClick={ () =>
								toolbarSetData(
									'columns',
									settings.columns === '1' ? '2' : '1'
								)
							}
							role="button"
							tabIndex="-1"
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' ) {
									toolbarSetData(
										'columns',
										settings.columns === '1' ? '2' : '1'
									);
								}
							} }
						>
							{ settings.columns === '1'
								? Icons.column1
								: Icons.column2 }
						</div>
					</div>
				) }

				<div className="prad-toolbar-item">
					<div
						className="prad-icon"
						onClick={ () =>
							handleBlockAction( 'duplicate', {
								allBlocks: fieldData,
								blockid: settings.blockid,
								setFieldData,
							} )
						}
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								handleBlockAction( 'duplicate', {
									allBlocks: fieldData,
									blockid: settings.blockid,
									setFieldData,
								} );
							}
						} }
					>
						{ Icons.copy }
					</div>
				</div>

				<div className="prad-toolbar-item">
					<div
						className="prad-icon"
						onClick={ ( e ) => {
							e.stopPropagation();
							if ( settings.type === 'img_switch' ) {
								setUpdateProductImageData( ( prevState ) => {
									const newObj = { ...prevState };
									delete newObj[ settings.blockid ];
									return newObj;
								} );
							}
							upDateSelectedBlock(
								getSelectedAfterRemoved(
									fieldData,
									settings.blockid
								)
							);
							handleBlockAction( 'remove', {
								allBlocks: fieldData,
								blockid: settings.blockid,
								setFieldData,
							} );
							updateDrawer( ( prevDrawer ) => ( {
								open:
									prevDrawer.compo === 'blockSettingsDrawer'
										? true
										: prevDrawer.open,
								compo: prevDrawer.compo,
							} ) );
						} }
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								e.stopPropagation();
								upDateSelectedBlock(
									getSelectedAfterRemoved(
										fieldData,
										settings.blockid
									)
								);
								handleBlockAction( 'remove', {
									allBlocks: fieldData,
									blockid: settings.blockid,
									setFieldData,
								} );
								updateDrawer( ( prevDrawer ) => ( {
									open:
										prevDrawer.compo ===
										'blockSettingsDrawer'
											? true
											: prevDrawer.open,
									compo: prevDrawer.compo,
								} ) );
							}
						} }
					>
						{ Icons.delete }
					</div>
				</div>
			</div>
		)
	);
};

export default ToolBar;
