import { useCallback, useState } from 'react';
import Button from '../../../components/Button';
import Search from '../../../components/Search';
import { useAddons } from '../../../context/AddonsContext';
import { pradAllBlocks } from '../../../utils/common_data/commonData';
import { _getnerateBlockid } from '../../../utils/Utils';
const _registeredBlocks = pradAllBlocks;

const BlockList = () => {
	const { fieldData, upDateSelectedBlock, updateFieldData } = useAddons();

	const { updateDraggData, drawer, updateDrawer } = useAddons();
	const [ searchQuery, setSearchQuery ] = useState( '' );

	const handleSearchChange = ( value ) => {
		setSearchQuery( value );
	};

	const addNestedBlock = ( datas, newSectionId, newBlock ) => {
		return datas.map( ( item ) => {
			if ( item.blockid === newSectionId && item.innerBlocks ) {
				return {
					...item,
					innerBlocks: [ ...item.innerBlocks, newBlock ],
				};
			}
			if ( item.innerBlocks ) {
				return {
					...item,
					innerBlocks: addNestedBlock(
						item.innerBlocks,
						newSectionId,
						newBlock
					),
				};
			}
			return item;
		} );
	};

	const handleBlockAction = useCallback(
		( el ) => {
			const bid = _getnerateBlockid();
			upDateSelectedBlock( bid );
			let newFieldData = [ ...fieldData ];
			if ( drawer.sectionid ) {
				const newBlock = {
					type: el,
					blockid: bid,
					sectionid: drawer.sectionid,
					..._registeredBlocks[ el ].def,
				};
				newFieldData = addNestedBlock(
					newFieldData,
					drawer.sectionid,
					newBlock
				);
			} else {
				newFieldData = [
					...newFieldData,
					{
						type: el,
						blockid: bid,
						..._registeredBlocks[ el ].def,
					},
				];
			}
			updateFieldData( newFieldData );
		},
		[ fieldData, drawer.sectionid, upDateSelectedBlock, updateFieldData ]
	);

	const handleDragStart = ( e, block ) => {
		updateDraggData( { type: 'blockList', id: '' } );
		e.dataTransfer.setData( 'pradBlock', block );
		e.dataTransfer.setData( 'pradAction', 'addNew' );
		e.dataTransfer.effectAllowed = 'copy';

		const dragImage = document.createElement( 'div' );
		dragImage.innerHTML = `<strong>${ block } Block</strong>`;
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
		<div className="prad-w-full">
			<div className="prad-mb-24">
				<div className="prad-d-flex prad-item-center prad-justify-between prad-text-color prad-mb-12">
					<div className="prad-font-16 prad-font-semi">
						Browse Elements
					</div>
					<Button
						onlyIcon={ true }
						iconName="cross_24"
						borderBtn={ true }
						color="dark"
						padding="3.2px"
						className="prad-btn-close"
						onClick={ () =>
							updateDrawer( ( prevDrawer ) => ( {
								...prevDrawer,
								open: ! prevDrawer.open,
								compo: 'blockList',
								sectionid: '',
							} ) )
						}
					/>
				</div>
				<Search
					onChange={ ( value ) => {
						handleSearchChange( value );
					} }
					noIcon={ true }
				/>
			</div>
			<div
				className="prad-scrollbar prad-pr-8"
				style={ {
					overflow: 'auto',
					height: '80vh',
				} }
			>
				<div className="prad-thumbnail-container prad-text-center prad-scrollbar">
					{ Object.keys( _registeredBlocks ).map( ( el, i ) => {
						if ( _registeredBlocks[ el ].deprecated ) {
							return null;
						}

						// Enhanced search function that checks both name and keywords
						const matchesSearch = () => {
							if ( ! searchQuery ) {
								return true;
							}

							const query = searchQuery.toLowerCase();
							const blockName =
								_registeredBlocks[ el ].name?.toLowerCase() ||
								'';
							const keyWords =
								_registeredBlocks[ el ].keyWords || [];

							// Check if name matches
							if ( blockName.includes( query ) ) {
								return true;
							}

							// Check if any keyword matches
							return keyWords.some( ( keyword ) =>
								keyword.toLowerCase().includes( query )
							);
						};

						return (
							matchesSearch() && (
								<div
									key={ i }
									className="prad-thumbnail-item"
									style={ { cursor: 'move' } }
									draggable
									onDragStart={ ( e ) =>
										handleDragStart( e, el )
									}
									onClick={ () => handleBlockAction( el ) }
									role="button"
									tabIndex="-1"
									onKeyDown={ ( e ) => {
										if ( e.key === 'Enter' ) {
											handleBlockAction( el );
										}
									} }
								>
									<div className="prad-media-content prad-lh-0 prad-center-horizontal prad-mb-8">
										{ _registeredBlocks[ el ].icon }
									</div>

									<div
										title={ _registeredBlocks[ el ].name }
										className="prad-text-content prad-font-12 prad-mt-4 prad-ellipsis"
									>
										{ _registeredBlocks[ el ].name }
									</div>
								</div>
							)
						);
					} ) }
				</div>
			</div>
		</div>
	);
};

export default BlockList;
