import { useState, useEffect } from 'react';
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import OptionController from '../../../components/OptionController';
import { _setFieldData, getPriceHtml } from '../../../utils/Utils';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Button = ( props ) => {
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

	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-button-wrapper prad-w-full ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionNoPrice() }
				{ settings._options.length !== 0 && (
					<div
						className={ `prad-d-flex prad-flex-wrap prad-gap-${
							settings.vertical === true ? '4' : '8'
						} prad-flex-${
							settings.vertical === true ? 'column' : 'row'
						}` }
					>
						{ settings._options.map( ( item, index ) => {
							const isActive = settings.multiple
								? selectedItems.includes( index )
								: selectedIndex === index;

							return (
								<OptionController
									id={ index }
									key={ index }
									onDelete={ handleDelete }
								>
									<div
										className={ `prad-w-fit prad-d-flex prad-item-center prad-justify-center prad-relative prad-button-container prad-${
											isActive ? 'active' : ''
										}` }
										key={ index }
									>
										<input
											className="prad-input-hidden"
											defaultValue={ item.value }
											id={ `id_${ settings.blockid }_${ item.value }_${ index }` }
											onClick={ () =>
												handleSelection( index )
											}
											name={ `prad_button_${ settings.blockid }` }
											type={
												settings.multiple === true
													? 'checkbox'
													: 'radio'
											}
										/>
										<label
											className="prad-mb-0"
											htmlFor={ `id_${ settings.blockid }_${ item.value }_${ index }` }
										>
											<div
												className={ `prad-button-item prad-w-fit prad-d-flex prad-item-center prad-gap-8 prad-${
													isActive
														? 'active'
														: 'inactive'
												}` }
												aria-label={ `Option Button for ${ item.value }` }
											>
												<div
													className={ `prad-text-${
														item?.type !== 'no_cost'
															? 'start'
															: 'center'
													}` }
													style={ {
														minWidth: `${
															item?.type !==
															'no_cost'
																? 'unset'
																: '2rem'
														}`,
													} }
												>
													<div
														title={ item.value }
														className="prad-ellipsis-2"
													>
														{ item.value }
													</div>
												</div>
												{ item?.type !== 'no_cost' && (
													<div className="prad-block-price prad-text-upper">
														{ getPriceHtml( {
															regular:
																item.regular,
															sale: item.sale,
															type: item.type,
														} ) }
													</div>
												) }
											</div>
										</label>
									</div>
								</OptionController>
							);
						} ) }
					</div>
				) }
				{ settings._options.length !== 0 &&
					blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Button;
