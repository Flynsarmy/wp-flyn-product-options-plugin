import ToolBar from '../../../dashboard/toolbar/ToolBar';
import OptionController from '../../../components/OptionController';
import { _setFieldData, getPriceHtml } from '../../../utils/Utils';
import { useState, useEffect } from 'react';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Radio = ( props ) => {
	const { settings, setFieldData, fieldData, position } = props;
	const [ defaultVal, setDefaultVal ] = useState(
		settings.defval &&
			( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
			? settings.defval[ 0 ]
			: ''
	);

	useEffect( () => {
		setDefaultVal(
			settings.defval &&
				( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
				? settings.defval[ 0 ]
				: ''
		);
	}, [ settings.defval ] );

	let columnClass = '1';
	switch ( settings.columns ) {
		case '3':
			columnClass = '3';
			break;
		case '2':
			columnClass = '2';
			break;
		default:
			columnClass = '1';
	}

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
	const blockItemImgClass =
		'prad-block-item-img-parent prad-block-img-' +
		( settings.imgStyle || 'normal' );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-radio prad-type-radio-input prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionNoPrice() }
				{ settings._options.length && (
					<div
						className={ `prad-input-container prad-column-${ columnClass } ${
							settings.fixedHeight
								? 'prad-overflow-x-hidden prad-overflow-y-auto prad-scrollbar prad-pb-8 prad-pt-8'
								: ''
						} ${ blockItemImgClass }` }
						style={ {
							maxHeight: settings.fixedHeight
								? settings.fixedHeight + 'px'
								: '',
						} }
					>
						{ settings._options.map( ( item, index ) => {
							const _id = Math.floor( Math.random() * 1000 );

							return (
								<OptionController
									id={ index }
									key={ `${ item?.value }_${ index }` }
									onDelete={ handleDelete }
								>
									<div
										className={ `prad-d-flex prad-item-center prad-gap-8 prad-justify-${
											settings.pricePosition ===
											'with_option'
												? 'left'
												: 'between'
										}` }
									>
										<div
											key={ index }
											className="prad-radio-item"
										>
											<input
												className="prad-input-hidden"
												name={ `name-` + position }
												type="radio"
												id={ `id-` + _id }
												checked={ defaultVal === index }
												onChange={ () => {
													setDefaultVal( index );
												} }
											/>
											<label
												htmlFor={ `id-` + _id }
												className="prad-d-flex prad-item-center prad-gap-10"
											>
												<div className="prad-radio-mark prad-realtive prad-br-round prad-selection-none"></div>
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
										{ ( item?.type !== 'no_cost' ||
											settings.enableCount === true ) && (
											<div className="prad-d-flex prad-item-center prad-gap-12">
												{ item?.type !== 'no_cost' && (
													<div className="prad-block-price prad-text-upper">
														{ getPriceHtml( {
															regular:
																item?.regular,
															sale: item?.sale,
															type: item?.type,
														} ) }
													</div>
												) }
												{ settings.enableCount ===
													true &&
													settings.columns ===
														'1' && (
														<input
															id={ `id__quantity_${ settings.blockid }_${ index }` }
															name={ `id__quantity_${ settings.blockid }_${ index }` }
															type="number"
															placeholder={
																settings.min
															}
															min={ settings.min }
															max={ settings.max }
															className={ `prad-block-input prad-quantity-input` }
														/>
													) }
											</div>
										) }
									</div>
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

export default Radio;
