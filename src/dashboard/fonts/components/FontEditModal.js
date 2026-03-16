import { memo } from 'react';
import Button from '../../../components/Button';
import TextField from '../../../components/text_field';
import icons from '../../../utils/Icons';

const { __ } = wp.i18n;

const FontEditModal = ( {
	isOpen,
	onClose,
	fontTitle,
	setFontTitle,
	fontFamily,
	setFontFamily,
	uploading,
	onUpdate,
} ) => {
	if ( ! isOpen ) {
		return null;
	}

	return (
		<div
			className="prad-modal-overlay prad-d-flex prad-item-center prad-justify-center"
			onClick={ onClose }
		>
			<div
				className="prad-modal prad-bg-base1 prad-p-32 prad-br-md prad-shadow-lg prad-scrollbar"
				style={ { maxWidth: '500px', width: '90%' } }
				onClick={ ( e ) => e.stopPropagation() }
			>
				<div className="prad-d-flex prad-justify-between prad-item-center prad-mb-24">
					<div className="prad-font-20 prad-font-bold">
						{ __( 'Edit Font', 'product-addons' ) }
					</div>
					<button
						className="prad-cursor-pointer prad-color-base7 prad-hover-color-base9 prad-bg-transparent prad-border-none"
						onClick={ onClose }
						type="button"
						style={ {
							border: '1px solid black',
							display: 'flex',
							padding: '4px',
							borderRadius: '4px',
						} }
					>
						{ icons.cross_20 }
					</button>
				</div>

				<div className="prad-d-flex prad-flex-column prad-gap-20">
					<div>
						<label
							htmlFor="font_title"
							className="prad-font-14 prad-font-bold prad-mb-8 prad-d-block"
						>
							{ __( 'Font Title', 'product-addons' ) }
						</label>
						<TextField
							// inline={ true }
							name="font_title"
							value={ fontTitle }
							onChange={ setFontTitle }
							placeholder={ __(
								'Enter font title',
								'product-addons'
							) }
						/>
					</div>

					<div>
						<label
							htmlFor="font_family"
							className="prad-font-14 prad-font-bold prad-mb-8 prad-d-block"
						>
							{ __( 'Font Family Name', 'product-addons' ) }
						</label>
						<TextField
							// inline={ true }
							name="font_family"
							value={ fontFamily }
							onChange={ setFontFamily }
							placeholder={ __(
								'Enter font family name',
								'product-addons'
							) }
						/>
						<div className="prad-help-message prad-mt-4">
							{ __(
								'This will be used in CSS font-family property',
								'product-addons'
							) }
						</div>
					</div>
				</div>

				<div className="prad-d-flex prad-gap-12 prad-justify-start prad-mt-32">
					<Button
						value={
							uploading
								? __( 'Updating…', 'product-addons' )
								: __( 'Update Font', 'product-addons' )
						}
						onClick={ onUpdate }
						background="primary"
						iconPosition="before"
						fontSize="14"
						disabled={ uploading }
					/>
					<Button
						value={ __( 'Cancel', 'product-addons' ) }
						onClick={ onClose }
						// background="base3"
						fontSize="14"
						disabled={ uploading }
						style={ { color: 'black' } }
					/>
				</div>
			</div>
		</div>
	);
};

export default memo( FontEditModal );
