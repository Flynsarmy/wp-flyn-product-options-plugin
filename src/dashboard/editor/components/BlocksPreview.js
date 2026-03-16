import { Fragment } from 'react';
import { pradAllBlocks } from '../../../utils/common_data/commonData';
import { useAddons } from '../../../context/AddonsContext';
import DropZone from './DropZone';
import Button from '../../../components/Button';
const _registeredBlocks = pradAllBlocks;

const BlocksPreview = ( {
	block,
	index,
	handleDrop,
	handleDragOver,
	handleDragLeave,
	dragOverIndex,
	appendDragOver,
	setAppendDragOver,
} ) => {
	const TempCom = _registeredBlocks[ block.type ]?.com ?? '';

	const {
		fieldData,
		updateFieldData,
		selectedBlock,
		upDateSelectedBlock,
		draggData,
		updateDrawer,
	} = useAddons();

	if ( ! TempCom ) {
		return null;
	}

	return (
		<TempCom
			isSelected={ selectedBlock === block.blockid }
			type={ block.type }
			position={ index }
			setFieldData={ ( data ) => updateFieldData( data ) }
			settings={ block }
			fieldData={ fieldData }
		>
			{ draggData.type === 'blockList' && block.type === 'section' && (
				<div
					style={ {
						height: '6px',
						...( block.innerBlocks?.length === 0
							? { padding: '10px 0px' }
							: {} ),
					} }
					className="prad-relative prad-w-full prad-builder-drag-drop prad-drag-drop-before-section"
				>
					<DropZone
						onDrop={ ( e, i ) =>
							handleDrop( {
								e,
								targetIndex: i,
								sectionId: block.blockid,
							} )
						}
						onDragOver={ () => {
							handleDragOver( block.blockid + '-fc-' + 0 );
						} }
						onDragLeave={ handleDragLeave }
						index={ 0 }
						isOver={ dragOverIndex === block.blockid + '-fc-' + 0 }
					/>
				</div>
			) }
			{ block.type === 'section' && block.innerBlocks?.length > 0 && (
				<>
					{ block.innerBlocks?.map( ( blockItem, i ) => {
						return (
							<Fragment key={ blockItem.blockid }>
								<div
									className={ `prad-relative prad-cw${
										blockItem.blockWidth || '_100'
									}` }
									onClick={ ( e ) => {
										if ( blockItem.sectionid ) {
											e.stopPropagation();
										}
										upDateSelectedBlock(
											blockItem.blockid || ''
										);
									} }
									role="button"
									tabIndex="-1"
									onKeyDown={ ( e ) => {
										if ( e.key === 'Enter' ) {
											if ( blockItem.sectionid ) {
												e.stopPropagation();
											}
											upDateSelectedBlock(
												blockItem.blockid || ''
											);
										}
									} }
								>
									{ draggData.type === 'blocks' && (
										<div className="prad-relative prad-builder-drag-drop prad-drop-blocks inside">
											<DropZone
												onDrop={ ( e, ii ) =>
													handleDrop( {
														e,
														targetIndex: ii,
														sectionId:
															block.blockid,
													} )
												}
												onDragOver={ () =>
													handleDragOver(
														block.blockid +
															'-it-' +
															i
													)
												}
												onDragLeave={ handleDragLeave }
												index={ i === 0 ? i : i - 1 }
												isOver={
													draggData.id !==
														blockItem.blockid &&
													dragOverIndex ===
														block.blockid +
															'-it-' +
															i
												}
											/>
										</div>
									) }
									<div
										className={ `prad-builder-wrapper prad-relative prad-${
											selectedBlock === blockItem.blockid
												? 'active'
												: 'inactive'
										}` }
										onDrop={ ( e ) => {
											handleDrop( {
												e,
												targetIndex:
													draggData.type === 'blocks'
														? i === 0
															? i
															: i - 1
														: i + 1,
												sectionId: block.blockid,
											} );
										} }
										onDragOver={ ( e ) => {
											e.preventDefault();
											e.stopPropagation();
											handleDragOver(
												block.blockid + '-it-' + i
											);
										} }
										onDragLeave={ handleDragLeave }
									>
										<BlocksPreview
											block={ blockItem }
											index={ i }
											handleDrop={ handleDrop }
											handleDragOver={ handleDragOver }
											handleDragLeave={ handleDragLeave }
											dragOverIndex={ dragOverIndex }
											appendDragOver={ appendDragOver }
											setAppendDragOver={
												setAppendDragOver
											}
										/>
									</div>
									{ draggData.type === 'blockList' && (
										<div className="prad-relative">
											<DropZone
												onDrop={ ( e, ii ) =>
													handleDrop( {
														e,
														targetIndex: ii,
														sectionId:
															block.blockid,
													} )
												}
												onDragOver={ () =>
													handleDragOver(
														block.blockid +
															'-it-' +
															i
													)
												}
												onDragLeave={ handleDragLeave }
												index={ i + 1 }
												isOver={
													dragOverIndex ===
													block.blockid + '-it-' + i
												}
											/>
										</div>
									) }
								</div>
							</Fragment>
						);
					} ) }
					{ draggData.type !== 'blockList' && (
						<div
							style={ { height: '6px' } }
							className="prad-relative prad-drag-drop-after-section"
						>
							<DropZone
								onDrop={ ( e, ii ) =>
									handleDrop( {
										e,
										targetIndex: ii,
										sectionId: block.blockid,
									} )
								}
								onDragOver={ () =>
									handleDragOver(
										block.blockid +
											'fl' +
											block.innerBlocks.length
									)
								}
								onDragLeave={ handleDragLeave }
								index={ block.innerBlocks.length }
								isOver={
									dragOverIndex ===
									block.blockid +
										'fl' +
										block.innerBlocks.length
								}
							/>
						</div>
					) }
				</>
			) }
			{ block.type === 'section' && (
				<div
					className={ `prad-builder-container prad-block-add-btn ${
						appendDragOver === 'prad-append' + block.blockid
							? 'prad-block-draggingover'
							: ''
					}` }
					onDrop={ ( e ) => {
						setAppendDragOver( '' );
						handleDrop( {
							e,
							targetIndex: block.innerBlocks.length,
							sectionId: block.blockid,
						} );
					} }
					onDragOver={ ( e ) => {
						e.preventDefault();
						e.stopPropagation();
						setAppendDragOver( 'prad-append' + block.blockid );
					} }
					onDragLeave={ () => setAppendDragOver( '' ) }
				>
					<Button
						onlyIcon={ true }
						iconName="plus_24"
						background="text-dark"
						padding="6px"
						onClick={ ( e ) => {
							e.stopPropagation();
							updateDrawer( ( prevDrawer ) => ( {
								...prevDrawer,
								open:
									prevDrawer.compo !== 'blockList' ||
									! prevDrawer.open,
								compo: 'blockList',
								sectionid: block.blockid,
							} ) );
						} }
					/>
				</div>
			) }
		</TempCom>
	);
};

export default BlocksPreview;
