import { Fragment, useRef, useState } from 'react';
import Button from '../../../components/Button';
import { useAddons } from '../../../context/AddonsContext';
import Skeleton from '../../../utils/Skeleton';
import {
	_getnerateBlockid,
	getPriceHtml,
	removeBlock,
} from '../../../utils/Utils';
import { pradAllBlocks } from '../../../utils/common_data/commonData';
import BlocksPreview from './BlocksPreview';
import DropZone from './DropZone';

const BlockCanvas = ( { shift = false, isLoading } ) => {
	const selectedBlockRef = useRef( null );
	const {
		fieldData,
		updateFieldData,
		selectedBlock,
		upDateSelectedBlock,
		draggData,
		updateDraggData,
		updateDrawer,
	} = useAddons();

	const [ dragOverIndex, setDragOverIndex ] = useState( null );
	const [ appendDragOver, setAppendDragOver ] = useState( '' );

	const handleDragOver = ( index ) => {
		setDragOverIndex( index );
	};

	const handleDragLeave = () => {
		setDragOverIndex( null );
	};
	const addNestedBlock = ( datas, newSectionId, newBlock, targetIndex ) => {
		return datas.map( ( item ) => {
			if ( item.blockid === newSectionId && item.innerBlocks ) {
				const innerItems = [ ...item.innerBlocks ];
				innerItems.splice( targetIndex, 0, newBlock );
				return {
					...item,
					innerBlocks: innerItems,
				};
			}
			if ( item.innerBlocks ) {
				return {
					...item,
					innerBlocks: addNestedBlock(
						item.innerBlocks,
						newSectionId,
						newBlock,
						targetIndex
					),
				};
			}
			return item;
		} );
	};

	const handleDrop = ( dropData ) => {
		const { e, targetIndex, sectionId } = dropData;
		e.preventDefault();
		e.stopPropagation();
		const pradBlock = e.dataTransfer.getData( 'pradBlock' );
		const actionType = e.dataTransfer.getData( 'pradAction' );

		if ( actionType === 'addNew' && pradBlock ) {
			const bid = _getnerateBlockid();
			upDateSelectedBlock( bid );
			let newFieldData = [ ...fieldData ];
			if ( sectionId ) {
				const newBlock = {
					type: pradBlock,
					blockid: bid,
					sectionid: sectionId,
					...pradAllBlocks[ pradBlock ].def,
				};
				newFieldData = addNestedBlock(
					newFieldData,
					sectionId,
					newBlock,
					targetIndex
				);
			} else {
				newFieldData.splice( targetIndex, 0, {
					type: pradBlock,
					blockid: bid,
					...pradAllBlocks[ pradBlock ].def,
				} );
			}
			updateFieldData( newFieldData );
		} else if ( actionType === 'existing' ) {
			if ( e.dataTransfer.getData( 'pradBlock' ) ) {
				const transferedData = e.dataTransfer.getData( 'pradBlock' );

				let block;
				try {
					block = JSON.parse( transferedData );
				} catch ( err ) {
					resetDragState();
					return;
				}

				if ( ! block?.blockid ) {
					resetDragState();
					return;
				}

				if ( sectionId ) {
					const child = document.querySelector(
						'.prad-block-' + sectionId
					);
					const parent = child.closest(
						'.prad-block-' + block.blockid
					);
					if ( parent || block.blockid === sectionId ) {
						resetDragState();
						return;
					}
				}

				let newFieldData = removeBlock( {
					allBlocks: [ ...fieldData ],
					blockid: block.blockid,
				} );

				if ( sectionId ) {
					block.sectionid = sectionId;
					newFieldData = addNestedBlock(
						newFieldData,
						sectionId,
						block,
						targetIndex
					);
				} else {
					delete block.sectionid;
					newFieldData.splice( targetIndex, 0, block );
				}
				updateFieldData( newFieldData );
			}
		}
		resetDragState();
	};

	const resetDragState = () => {
		setDragOverIndex( null );
		updateDraggData( { type: '', id: '' } );
	};

	return (
		<div
			className="prad-d-flex prad-justify-center prad-gap-40"
			style={ {
				transform: `translateX(${
					window.innerWidth > 1024 && shift ? '126px' : '0'
				})`,
				transition: 'all var(--prad-transition-smd)',
			} }
		>
			<div className="prad-builder-img">
				<img
					className="prad-sticky-content"
					src={
						pradBackendData.url +
						'assets/img/builder-placeholder.png'
					}
					alt="default builder gallery"
				/>
			</div>
			{ isLoading ? (
				<div className="prad-builder-fields prad-grow-1 prad-bg-base1 prad-mlg-p-12 prad-p-32">
					<div className="prad-mb-32 prad-selection-none">
						<div
							className="prad-bg-border-light prad-br-md prad-mb-16"
							style={ { width: '80%', height: '16px' } }
						/>
						<div className="prad-d-flex prad-item-center prad-gap-12">
							<div
								className="prad-bg-border-light prad-br-md"
								style={ { width: '20%', height: '16px' } }
							/>
							<div
								className="prad-bg-border-light prad-br-md"
								style={ { width: '20%', height: '16px' } }
							/>
						</div>
					</div>
					<div className="prad-mb-20">
						<Skeleton height="25px" width="180px" />
						<Skeleton height="60px" width="100%" />
					</div>
					<div className="prad-mb-20">
						<Skeleton height="25px" width="180px" />
						<Skeleton height="60px" width="100%" />
					</div>
					<div className="prad-mb-20">
						<Skeleton height="25px" width="180px" />
						<Skeleton height="60px" width="100%" />
					</div>
					<div className="prad-mb-20">
						<Skeleton height="25px" width="180px" />
						<Skeleton height="60px" width="100%" />
					</div>
					<div className="prad-mb-20">
						<Skeleton height="25px" width="180px" />
						<Skeleton height="60px" width="100%" />
					</div>
				</div>
			) : (
				<div
					ref={ selectedBlockRef }
					className="prad-builder-fields prad-grow-1 prad-bg-base1 prad-mlg-p-12 prad-p-32"
				>
					<div className="prad-mb-32 prad-selection-none prad-d-flex prad-justify-between prad-item-start">
						<div>
							<div className="prad-font-18 prad-font-bold prad-mb-12">
								WowAddon Product (Dummy Product)
							</div>
							<div className="prad-font-16 prad-font-bold">
								{ getPriceHtml( {
									regular: 20,
									type: 'fixed',
								} ) }
							</div>
						</div>
					</div>
					{ draggData.type === 'blockList' && (
						<div
							style={ { height: '6px' } }
							className="prad-relative prad-builder-drag-drop"
						>
							<DropZone
								onDrop={ ( e, index ) =>
									handleDrop( { e, targetIndex: index } )
								}
								onDragOver={ () => handleDragOver( 0 ) }
								onDragLeave={ handleDragLeave }
								index={ 0 }
								isOver={ dragOverIndex === 0 }
							/>
						</div>
					) }
					<div className="prad-builder-fields-container">
						{ fieldData?.map( ( el, i ) => {
							const onTargetIndex =
								draggData.type === 'blocks'
									? i === 0
										? i
										: i - 1
									: i + 1;
							return (
								<Fragment key={ el.blockid }>
									<div
										key={ el.blockid }
										className={ `prad-relative prad-cw${
											el.blockWidth || '_100'
										}` }
										onClick={ () => {
											upDateSelectedBlock(
												el.blockid || ''
											);
										} }
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												upDateSelectedBlock(
													el.blockid || ''
												);
											}
										} }
									>
										{ draggData.type === 'blocks' && (
											<div
												className={ `prad-relative prad-builder-drag-drop prad-drop-blocks inside` }
											>
												<DropZone
													onDrop={ ( e, index ) =>
														handleDrop( {
															e,
															targetIndex: index,
														} )
													}
													onDragOver={ () =>
														handleDragOver(
															el.blockid
														)
													}
													onDragLeave={
														handleDragLeave
													}
													index={
														i === 0 ? i : i - 1
													}
													isOver={
														draggData.id !==
															el.blockid &&
														dragOverIndex ===
															el.blockid
													}
												/>
											</div>
										) }
										<div
											className={ `prad-builder-wrapper prad-relative prad-${
												selectedBlock === el.blockid
													? 'active'
													: 'inactive'
											}` }
											onDrop={ ( e ) => {
												handleDrop( {
													e,
													targetIndex: onTargetIndex,
												} );
											} }
											onDragOver={ ( e ) => {
												e.preventDefault();
												e.stopPropagation();
												handleDragOver( el.blockid );
											} }
											onDragLeave={ handleDragLeave }
										>
											<BlocksPreview
												block={ el }
												index={ i }
												handleDrop={ handleDrop }
												handleDragOver={
													handleDragOver
												}
												handleDragLeave={
													handleDragLeave
												}
												dragOverIndex={ dragOverIndex }
												appendDragOver={
													appendDragOver
												}
												setAppendDragOver={
													setAppendDragOver
												}
											/>
										</div>
										{ draggData.type === 'blockList' && (
											<div
												className={ `prad-relative prad-builder-drag-drop prad-drop-lists` }
											>
												<DropZone
													onDrop={ ( e, index ) =>
														handleDrop( {
															e,
															targetIndex: index,
														} )
													}
													onDragOver={ () =>
														handleDragOver(
															el.blockid
														)
													}
													onDragLeave={
														handleDragLeave
													}
													index={ i + 1 }
													isOver={
														dragOverIndex ===
														el.blockid
													}
												/>
											</div>
										) }
									</div>
								</Fragment>
							);
						} ) }
					</div>
					{ draggData.type === 'blocks' && (
						<div
							style={ { height: '6px' } }
							className="prad-relative prad-builder-drag-drop prad-drop-blocks ends"
						>
							<DropZone
								onDrop={ ( e, index ) =>
									handleDrop( { e, targetIndex: index } )
								}
								onDragOver={ () =>
									handleDragOver( fieldData.length )
								}
								onDragLeave={ handleDragLeave }
								index={ fieldData.length }
								isOver={ dragOverIndex === fieldData.length }
							/>
						</div>
					) }
					<div
						className={ `prad-builder-container prad-block-add-btn ${
							appendDragOver === 'prad-blockappend-root'
								? 'prad-block-draggingover'
								: ''
						}` }
						onDrop={ ( e ) => {
							setAppendDragOver( '' );
							handleDrop( {
								e,
								targetIndex: fieldData.length,
							} );
						} }
						onDragOver={ ( e ) => {
							e.preventDefault();
							e.stopPropagation();
							setAppendDragOver( 'prad-blockappend-root' );
						} }
						onDragLeave={ () => setAppendDragOver( '' ) }
					>
						<Button
							onlyIcon={ true }
							iconName="plus_24"
							background="text-dark"
							padding="6px"
							onClick={ () =>
								updateDrawer( ( prevDrawer ) => ( {
									...prevDrawer,
									open:
										prevDrawer.compo !== 'blockList' ||
										! prevDrawer.open,
									compo: 'blockList',
									sectionid: '',
								} ) )
							}
						/>
					</div>
				</div>
			) }
		</div>
	);
};

export default BlockCanvas;
