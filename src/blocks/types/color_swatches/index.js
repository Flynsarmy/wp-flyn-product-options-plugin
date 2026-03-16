import { useState, useEffect, useRef } from 'react';
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import Icons from '../../../utils/Icons';
import OptionController from '../../../components/OptionController';
import { _setFieldData, getPriceHtml } from '../../../utils/Utils';
import { useEditor } from '../../../context/EditorContext';
import { generateBlockCss } from './blockCss';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const ColorSwatches = ( props ) => {
	const swatchRefs = useRef( [] );
	const { settings, setFieldData, fieldData, position } = props;
	const [ selectedIndex, setSelectedIndex ] = useState(
		settings.defval &&
			( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
			? settings.defval[ 0 ]
			: ''
	);
	const [ selectedItems, setSelectedItems ] = useState(
		settings.defval ? settings.defval : []
	);
	useEffect( () => {
		if ( swatchRefs.current.length ) {
			swatchRefs.current.forEach( ( ref ) => {
				if ( ref ) {
					ref.style.setProperty( 'padding', '1px', 'important' );
				}
			} );
		}
	}, [] );
	useEffect( () => {
		if ( settings.multiple ) {
			setSelectedItems( settings.defval ? settings.defval : [] );
		} else {
			setSelectedIndex(
				settings.defval &&
					( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
					? settings.defval[ 0 ]
					: ''
			);
		}
	}, [ settings.defval, settings.multiple ] );

	const handleSelection = ( index ) => {
		if ( settings.multiple ) {
			setSelectedItems(
				( prev ) =>
					prev.includes( index )
						? prev.filter( ( item ) => item !== index ) // Remove if already selected
						: [ ...prev, index ] // Add if not selected
			);
		} else {
			// For single selection (radio buttons), toggle the selection
			const newSelectedIndex = selectedIndex === index ? null : index;
			setSelectedIndex( newSelectedIndex ); // Select new item
		}
	};

	const handleDelete = ( index ) => {
		const _options = [ ...( settings._options ?? [] ) ];
		_options.splice( index, 1 );
		_setFieldData(
			setFieldData,
			fieldData,
			settings,
			position,
			'_options',
			_options
		);
	};

	const { currentPostCss, globalStyles } = useEditor();

	const blockCss = generateBlockCss( {
		settings,
		globalStyles,
	} );

	currentPostCss.current = {
		...( currentPostCss.current || {} ),
		[ settings.blockid ]: blockCss,
	};

	const renderSwatchContent = ( index, item ) => {
		return (
			<div className="prad-d-flex prad-flex-column prad-item-center prad-gap-2 prad-text-center prad-mt-8 prad-block-content-wrapper prad-effect-container">
				<div>
					<div
						className="prad-block-content prad-ellipsis-2"
						title={ item?.value }
					>
						{ item?.value }
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
				{ settings.enableCount === true && (
					<input
						id={ `id__quantity_${ settings.blockid }_${ index }` }
						name={ `id__quantity_${ settings.blockid }_${ index }` }
						type="number"
						placeholder={ settings.min }
						min={ settings.min }
						max={ settings.max }
						defaultValue={ settings._options[ index ]?.quantity }
						className={ `prad-block-input prad-quantity-input prad-input prad-w-full` }
					/>
				) }
			</div>
		);
	};

	const [ hoverClass, setHoverClass ] = useState( 'hide' );

	useEffect( () => {
		if ( settings.layoutVisibility === 'hover_show' ) {
			setHoverClass( 'show' );
		} else if ( settings.layoutVisibility === 'hover_hide' ) {
			setHoverClass( 'hide' );
		} else {
			setHoverClass( 'always' );
		}
	}, [ settings.layoutVisibility ] );

	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-color-switcher prad-w-full prad-block-${ settings.blockid } ${ settings.class } prad-swatch-layout${ settings.layout }` }
			>
				{ blockCss && <style>{ blockCss }</style> }
				{ blockObject.renderTitleDescriptionNoPrice() }
				{ settings._options.length !== 0 && (
					<div className="prad-swatch-wrapper">
						{ settings._options.map( ( item, index ) => {
							const isActive = settings.multiple
								? selectedItems.includes( index )
								: selectedIndex === index;
							return (
								<OptionController
									id={ index }
									key={ index }
									onDelete={ handleDelete }
									className="prad-d-flex prad-flex-column prad-h-full"
								>
									<div
										className={ `prad-swatch-container prad-p-2 prad-w-fit prad-relative prad-hover-${ hoverClass }-bottom prad-${
											isActive ? 'active' : 'inactive'
										}` }
										key={ index }
									>
										<input
											className="prad-input-hidden"
											defaultValue={ item.value }
											id={ `id_${ settings.blockid }_${ index }` }
											onClick={ () =>
												handleSelection( index )
											}
											name={ `prad-swatch-${ settings.blockid }` }
											type={
												settings.multiple === true
													? 'checkbox'
													: 'radio'
											}
										/>
										<label
											className=" prad-lh-0 prad-mb-0"
											htmlFor={ `id_${ settings.blockid }_${ index }` }
										>
											<div
												className="prad-swatch-item"
												aria-label={ `Color swatch for ${ item.value }` }
												style={ {
													backgroundColor: item.color,
												} }
											/>
										</label>
										<div
											className={ `prad-swatch-mark-image prad-absolute prad-${
												isActive ? 'active' : 'inactive'
											}` }
											ref={ ( el ) =>
												( swatchRefs.current[ index ] =
													el )
											}
											style={ {
												border: '1px solid #ffffff',
												borderRadius: '2px',
											} }
										>
											{ Icons.checkMark }
										</div>
										{ settings.layout === '_overlay' &&
											renderSwatchContent( index, item ) }
									</div>
									{ settings.layout === '_default' &&
										renderSwatchContent( index, item ) }
									{ settings.enableCount === true &&
										settings.layout === '_img' && (
											<input
												id={ `id__quantity_${ settings.blockid }_${ index }` }
												name={ `id__quantity_${ settings.blockid }_${ index }` }
												type="number"
												placeholder={ settings.min }
												min={ settings.min }
												max={ settings.max }
												defaultValue={
													settings._options[ index ]
														.quantity
												}
												className={ `prad-block-input prad-quantity-input prad-input prad-w-full prad-mt-6` }
											/>
										) }
								</OptionController>
							);
						} ) }
					</div>
				) }
				{ settings._options.length &&
					blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default ColorSwatches;
