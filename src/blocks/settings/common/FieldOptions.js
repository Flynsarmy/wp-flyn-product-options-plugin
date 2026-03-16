const { __ } = wp.i18n;
import { useEffect, useRef, useState } from 'react';
import Button from '../../../components/Button';
import ColorPicker from '../../../components/ColorPicker';
import Select from '../../../components/Select';
import Icons from '../../../utils/Icons';

const FieldOptions = ( props ) => {
	const {
		hasMultiple,
		options,
		priceTypes,
		setOption,
		setDelete,
		setNew,
		hasLabel,
		hasDescription = false,
		type,
		isSwatches,
		handleImage,
		multiChoice = false,
		defVal,
		setDefault,
		onDrop,
		hasImg,
	} = props;

	const elementRefs = useRef( [] );

	useEffect( () => {
		if ( elementRefs.current.length ) {
			elementRefs.current.forEach( ( ref ) => {
				if ( ref ) {
					ref.style.setProperty( 'margin-left', '9px', 'important' );
				}
			} );
		}
	}, [] );

	const [ draggedIndex, setDraggedIndex ] = useState( null );

	const columnNumber = ( fieldType ) => {
		switch ( fieldType ) {
			case 'button':
				return 'seven';
			case 'radio':
			case 'select':
			case 'checkbox':
				return 'eight';
			case 'switch':
				return 'five';
			case 'img_switch':
			case 'color_switch':
				return 'eight';

			default:
				return 'three';
		}
	};

	let isMultiChoice = multiChoice;
	if ( type === 'radio' ) {
		isMultiChoice = false;
	} else if ( type === 'checkbox' ) {
		isMultiChoice = true;
	}

	const handleActiveStatus = ( i ) => {
		let newDef = [ ...defVal ];
		const index = newDef.indexOf( i );
		if ( index === -1 ) {
			if ( isMultiChoice ) {
				newDef.push( i );
			} else {
				newDef = [ i ];
			}
		} else {
			newDef.splice( index, 1 );
		}
		setDefault( newDef );
	};

	const handleDragStart = ( e, index ) => {
		if ( ! e.target.classList.contains( 'prad-option-drag-toolbar' ) ) {
			e.preventDefault();
			return;
		}

		e.dataTransfer.setData( 'text/plain', index );
		e.dataTransfer.effectAllowed = 'move';

		e.target
			.closest( '.prad-drag-wrapper-toolbar' )
			.classList.add( 'prad-dragging' );

		setDraggedIndex( index );

		const blockElement = e.target.closest( '.prad-drag-wrapper-toolbar' );

		const dragImage = blockElement.cloneNode( true ); // Clone the block element
		dragImage.style.position = 'absolute';
		dragImage.style.pointerEvents = 'none'; // Prevent interactions
		dragImage.style.zIndex = '9999';
		dragImage.classList.add( 'prad-dragged-element-wrapper' ); // Add a custom class for styling
		document.body.appendChild( dragImage ); // Append to the document1

		// Get mouse position relative to the blockElement
		const rect = blockElement.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top + 30;

		// Set custom drag image with proper offset
		e.dataTransfer.setDragImage( dragImage, offsetX, offsetY );
	};
	const handleDragOver = ( e ) => {
		e.preventDefault();
		const target = e.target.closest( '.prad-drag-wrapper-toolbar' );

		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );

		if ( target && ! target.classList.contains( 'prad-dragging' ) ) {
			target.classList.add( 'prad-drag-over' );
		}
	};
	const handleDragEnter = ( e ) => {
		const target = e.target.closest( '.prad-drag-wrapper-toolbar' );

		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );

		if ( target && ! target.classList.contains( 'prad-dragging' ) ) {
			target.classList.add( 'prad-drag-over' );
		}
	};
	const handleDragLeave = ( e ) => {
		const related = e.relatedTarget?.closest(
			'.prad-drag-wrapper-toolbar'
		);
		const target = e.target.closest( '.prad-drag-wrapper-toolbar' );

		if ( ! related && target ) {
			target.classList.remove( 'prad-drag-over' );
		}
	};
	const handleDrop = ( e, index ) => {
		e.preventDefault();
		setDraggedIndex( e.dataTransfer.getData( 'text/plain' ) );
		handleDropCleanup();
		if ( onDrop ) {
			onDrop( index, draggedIndex );
		}

		document.querySelectorAll( '.prad-dragging' ).forEach( ( el ) => {
			el.classList.remove( 'prad-dragging' );
		} );
		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );
	};
	const handleDragEnd = () => {
		handleDropCleanup();
		document.querySelectorAll( '.prad-dragging' ).forEach( ( el ) => {
			el.classList.remove( 'prad-dragging' );
		} );
		document.querySelectorAll( '.prad-drag-over' ).forEach( ( el ) => {
			el.classList.remove( 'prad-drag-over' );
		} );
	};

	const handleDropCleanup = () => {
		const dragWrapper = document.body.querySelector(
			'.prad-dragged-element-wrapper'
		);
		if ( dragWrapper ) {
			document.body.removeChild( dragWrapper );
		}
	};

	return (
		<div className="prad-relative prad-pb-20 prad-border-default prad-br-smd">
			<div className="prad-editor-settings-table">
				<div
					className={ `prad-field-header prad-font-14 prad-font-semi prad-mb-20 prad-gap-12 prad-d-grid prad-column-${ columnNumber(
						type
					) }` }
				>
					{ hasMultiple && (
						<div>
							<div className="prad-lh-0"></div>
						</div>
					) }
					{ hasLabel && (
						<div>{ __( 'Title', 'product-addons' ) }</div>
					) }
					{ isSwatches && (
						<div>
							{ type === 'color_switch' ? 'Color' : 'Image' }
						</div>
					) }
					{ hasImg && (
						<div className="prad-relative">
							{ __( 'Image', 'product-addons' ) }
						</div>
					) }
					<div>{ __( 'Price Type', 'product-addons' ) }</div>
					<div>{ __( 'Regular', 'product-addons' ) }</div>
					<div className="prad-relative">
						{ __( 'Sales', 'product-addons' ) }
					</div>
					{ hasMultiple && (
						<div>{ __( 'Active', 'product-addons' ) }</div>
					) }
					{ hasMultiple && <div></div> }
				</div>

				{ options.map( ( val, i ) => {
					return (
						<div
							className={ `prad-field-row prad-drag-wrapper-toolbar prad-gap-12 prad-plr-20 prad-d-grid prad-item-center prad-column-${ columnNumber(
								type
							) }` }
							key={ i }
							id={ i }
							onDragOver={ ( e ) => handleDragOver( e ) } // Handle drag over
							onDragLeave={ ( e ) => handleDragLeave( e ) } // Handle drag leave
							onDrop={ ( e ) => handleDrop( e, i ) }
							onDragEnd={ handleDragEnd }
							onDragEnter={ ( e ) => handleDragEnter( e ) }
						>
							{ hasMultiple && (
								<div>
									<div
										className="prad-lh-0 prad-cursor-pointer prad-option-drag-toolbar"
										draggable={ true }
										onDragStart={ ( e ) =>
											handleDragStart( e, i )
										}
									>
										{ Icons.drag }
									</div>
								</div>
							) }
							{ hasLabel && (
								<div>
									<input
										className="prad-input prad-bc-border-primary prad-w-full"
										type="text"
										onChange={ ( v ) =>
											setOption(
												i,
												'value',
												v.target.value
											)
										}
										value={ val.value }
									/>
								</div>
							) }
							{ ( hasImg || isSwatches ) && (
								<div>
									{ type === 'color_switch' ? (
										<div>
											<ColorPicker
												initialColor={ val.color }
												isSwatches={ true }
												onChange={ ( newColor ) => {
													setOption(
														i,
														'color',
														newColor
													);
												} }
												style={ {
													width: '54px',
													height: '34px',
												} }
												triggerClass="prad-p-2 prad-br-smd"
												selectedColorClass="prad-br-sm"
											/>
										</div>
									) : (
										<div
											className="prad-lh-0 prad-p-2 prad-br-smd prad-border-default prad-cursor-pointer prad-relative"
											onClick={ () => handleImage( i ) }
											role="button"
											tabIndex="-1"
											onKeyDown={ ( e ) => {
												if ( e.key === 'Enter' ) {
													handleImage( i );
												}
											} }
										>
											{ val.img && hasImg && (
												<div
													className="prad-absolute"
													style={ {
														backgroundColor:
															'#ff0000',
														top: '-8px',
														right: '-8px',
														borderRadius: '16px',
														color: '#fff',
													} }
													onClick={ ( e ) => {
														e.stopPropagation();
														handleImage(
															i,
															'remove'
														);
													} }
													role="button"
													tabIndex="-1"
													onKeyDown={ ( e ) => {
														if (
															e.key === 'Enter'
														) {
															e.stopPropagation();
															handleImage(
																i,
																'remove'
															);
														}
													} }
												>
													{ Icons.cross }
												</div>
											) }
											<img
												style={ {
													width: '54px',
													height: '34px',
													objectFit: 'cover',
												} }
												src={
													val.img ||
													pradBackendData.url +
														'assets/img/default-product.svg'
												}
												alt="WowAddons"
												className="prad-br-sm"
											/>
										</div>
									) }
								</div>
							) }
							<div className="prad-relative prad-d-flex prad-item-center ">
								<Select
									options={ priceTypes?.map( ( item ) => ( {
										value: item.val,
										label: item.label,
										isPro: item.isPro,
									} ) ) }
									onChange={ ( v ) => {
										setOption( i, 'type', v.value );
									} }
									minWidth="100%"
									selectedOption={ val.type }
									valueClass="prad-ellipsis"
								/>
							</div>
							<div>
								<input
									className={ `prad-input prad-bc-border-primary prad-w-full prad-${
										val.type === 'no_cost'
											? 'disable'
											: 'enable'
									}` }
									type={
										val.type === 'no_cost'
											? 'text'
											: 'number'
									}
									onChange={ ( v ) => {
										const _val = v.target.value;
										setOption(
											i,
											'regular',
											_val < 0
												? Math.abs( Number( _val ) )
												: _val
										);
									} }
									value={
										val.type === 'no_cost'
											? 'Free'
											: val.regular
									}
								/>
							</div>
							<div>
								<input
									className={ `prad-input prad-bc-border-primary prad-w-full prad-${
										val.type === 'no_cost'
											? 'disable'
											: 'enable'
									} prad-opacity-${
										val.type === 'no_cost' ? 'half' : 'full'
									}` }
									type="number"
									onChange={ ( v ) => {
										const _val = v.target.value;
										setOption(
											i,
											'sale',
											_val < 0
												? Math.abs( Number( _val ) )
												: _val
										);
									} }
									value={ val.sale }
								/>
							</div>
							{ hasMultiple &&
								( isMultiChoice ? (
									<div
										className={ `prad-checkbox-custom prad-${
											defVal?.indexOf( i ) > -1
												? 'active'
												: 'inactive'
										}` }
										ref={ ( el ) =>
											( elementRefs.current[ i ] = el )
										}
										onClick={ () =>
											handleActiveStatus( i )
										}
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												handleActiveStatus( i );
											}
										} }
									/>
								) : (
									<div
										className={ `prad-radio-custom prad-${
											defVal?.indexOf( i ) > -1
												? 'active'
												: 'inactive'
										}` }
										ref={ ( el ) =>
											( elementRefs.current[ i ] = el )
										}
										onClick={ () =>
											handleActiveStatus( i )
										}
										role="button"
										tabIndex="-1"
										onKeyDown={ ( e ) => {
											if ( e.key === 'Enter' ) {
												handleActiveStatus( i );
											}
										} }
									/>
								) ) }
							{ hasMultiple && (
								<Button
									onlyIcon={ true }
									iconName="delete"
									background="base2"
									fontHeight="0"
									borderRadius="100"
									className="prad-btn-close"
									borderColor="transparent"
									onClick={ () => setDelete( i ) }
								/>
							) }
							{ hasDescription && (
								<>
									{ hasMultiple && <div></div> }
									<div style={ { gridColumn: 'span 7' } }>
										<input
											className="prad-input prad prad-bc-border-primary prad-w-full"
											type="text"
											onChange={ ( v ) =>
												setOption(
													i,
													'description',
													v.target.value
												)
											}
											value={ val.description }
										/>
									</div>
								</>
							) }
						</div>
					);
				} ) }
			</div>
			{ hasMultiple && (
				<div className="prad-plr-20 prad-mt-20">
					<Button
						value={ __( 'Add New Option', 'product-addons' ) }
						iconName="plus_20"
						background="primary"
						onClick={ () => setNew() }
					/>
				</div>
			) }
		</div>
	);
};

export default FieldOptions;
