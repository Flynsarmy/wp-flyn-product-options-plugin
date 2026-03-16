// AbstractBlock.js
import { useMemo } from 'react';
import { pradAllBlocks } from '../../utils/common_data/commonData';
import { getPriceHtml } from '../../utils/Utils';
import Label from '../helper/fields/Label';

export function useAbstractBlock( data = {}, propsdata ) {
	const blockData = data || {};
	const getProperty = ( key, defaultVal = '' ) => {
		return blockData.hasOwnProperty( key ) ? blockData[ key ] : defaultVal;
	};

	const isTitleHidden = () => !! getProperty( 'hide', false );
	const isPriceWithTile = () =>
		getProperty( 'pricePosition', 'with_title' ) === 'with_title';
	const getDescription = () => getProperty( 'description', '' );
	const getDescriptionPosition = () =>
		getProperty( 'descpPosition', 'belowTitle' );

	const renderDescriptionTooltip = () => {
		if ( ! getDescription() || getDescriptionPosition() !== 'tooltip' ) {
			return null;
		}
		return (
			<div className="prad-tooltip-container">
				<div className="prad-tooltip-icon">?</div>
				<div className="prad-tooltip-box">{ getDescription() }</div>
			</div>
		);
	};

	const renderDescriptionHtml = () => {
		if ( ! getDescription() ) {
			return null;
		}
		return (
			<div className="prad-block-description">{ getDescription() }</div>
		);
	};

	const renderDescriptionBelowTitle = () => {
		if ( getDescriptionPosition() !== 'belowTitle' ) {
			return null;
		}
		return renderDescriptionHtml();
	};

	const renderTitleDescriptionNoPrice = () => {
		const titleHidden = isTitleHidden();
		const descPosition = getDescriptionPosition();
		const hasDescription = !! getDescription();

		// Early exit conditions
		if (
			( titleHidden && descPosition === 'tooltip' ) ||
			( titleHidden && descPosition === 'belowField' ) ||
			( titleHidden && descPosition === 'belowTitle' && ! hasDescription )
		) {
			return null;
		}

		return (
			<div className="prad-d-flex prad-flex-column prad-mb-12 prad-gap-2">
				<div className="prad-d-flex prad-item-center prad-gap-12 ">
					{ renderBlockTitleWithRequired() }
					{ ! isTitleHidden() && renderDescriptionTooltip() }
				</div>
				{ renderDescriptionBelowTitle() }
			</div>
		);
	};

	const priceCanBeWithTitle = ( item ) => {
		return isPriceWithTile() && item.type !== 'no_cost';
	};

	const renderPriceWithTitle = () => {
		if ( ! isPriceWithTile() ) {
			return null;
		}
		return (
			<>
				{ blockData._options[ 0 ]?.type !== 'no_cost' && (
					<div className="prad-block-price prad-text-upper">
						{ getPriceHtml( {
							regular: blockData?._options[ 0 ]?.regular,
							sale: blockData?._options[ 0 ]?.sale,
							type: blockData?._options[ 0 ]?.type,
						} ) }
					</div>
				) }
			</>
		);
	};

	const renderBlockTitleWithRequired = () => {
		if ( isTitleHidden() ) {
			return null;
		}
		return (
			<>
				<Label noSpace={ true } editAble={ true } { ...propsdata } />
			</>
		);
	};

	const renderTitleDescriptionPriceWithPosition = () => {
		const titleHidden = isTitleHidden();
		const descPosition = getDescriptionPosition();
		const hasDescription = !! getDescription();
		const priceWithTitle = priceCanBeWithTitle(
			blockData._options?.length ? blockData._options[ 0 ] : {}
		);

		// Early exit conditions
		if (
			( titleHidden && descPosition === 'tooltip' && ! priceWithTitle ) ||
			( titleHidden && descPosition === 'belowTitle' && ! hasDescription )
		) {
			return null;
		}

		return (
			<div className="prad-d-flex prad-flex-column prad-mb-12 prad-gap-2">
				<div className="prad-d-flex prad-item-center prad-gap-12 ">
					{ renderBlockTitleWithRequired() }
					{ ! titleHidden && renderDescriptionTooltip() }
					{ renderPriceWithTitle() }
				</div>
				{ renderDescriptionBelowTitle() }
			</div>
		);
	};

	const renderDescriptionBelowField = () => {
		if ( getDescriptionPosition() !== 'belowField' || ! getDescription() ) {
			return null;
		}

		return (
			<div className="prad-block-description prad-mt-12">
				{ getDescription() }
			</div>
		);
	};

	const renderPriceWithOption = () => {
		if ( getProperty( 'pricePosition', 'with_title' ) !== 'with_option' ) {
			return null;
		}
		return (
			<>
				{ blockData._options[ 0 ]?.type !== 'no_cost' && (
					<div className="prad-block-price prad-text-upper">
						{ getPriceHtml( {
							regular: blockData?._options[ 0 ]?.regular,
							sale: blockData?._options[ 0 ]?.sale,
							type: blockData?._options[ 0 ]?.type,
						} ) }
					</div>
				) }
			</>
		);
	};

	/** Memoize API object */
	return useMemo(
		() => ( {
			data: blockData,
			renderTitleDescriptionNoPrice,
			renderTitleDescriptionPriceWithPosition,
			renderDescriptionBelowField,
			renderPriceWithOption,
			renderBlockTitleWithRequired,
			renderDescriptionTooltip,
			renderDescriptionBelowTitle,
		} ),
		[ blockData, propsdata ]
	);
}
