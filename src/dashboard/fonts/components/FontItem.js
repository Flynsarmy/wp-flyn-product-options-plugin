import { memo } from 'react';
import icons from '../../../utils/Icons';

const { __ } = wp.i18n;

const FontItem = ( { font, onEdit, onDelete, isDeleting } ) => {
	return (
		<div
			className={ `prad-font-item prad-bg-base1 prad-p-24 prad-br-md prad-d-flex prad-justify-between prad-item-center ${
				isDeleting ? 'prad-deleting' : ''
			}` }
			style={ {
				opacity: isDeleting ? 0.5 : 1,
				pointerEvents: isDeleting ? 'none' : 'auto',
				transition: 'opacity 0.3s ease',
			} }
		>
			<div className="prad-d-flex prad-flex-column prad-gap-8 prad-flex-grow">
				<div className="prad-d-flex prad-item-center prad-gap-16">
					<div className="prad-font-16 prad-font-semi prad-color-base9">
						{ font.title }
					</div>
					<div className="prad-border-left-default prad-pl-12 prad-d-flex prad-items-center prad-gap-8 prad-item-center">
						<div className="prad-font-medium prad-h-fit">
							{ __( 'Font Family:', 'product-addons' ) }
						</div>
						<code
							className="prad-bg-base3 prad-br-sm"
							style={ {
								padding: '2px 6px',
							} }
						>
							{ font.family }
						</code>
					</div>
					<div className="prad-border-left-default prad-pl-12 prad-d-flex prad-items-center prad-gap-8 prad-item-center">
						<div className="prad-font-medium prad-h-fit">
							{ __( 'Format:', 'product-addons' ) }
						</div>
						<code
							className="prad-bg-base3 prad-br-sm"
							style={ {
								padding: '2px 6px',
							} }
						>
							{ font.file_type }
						</code>
					</div>
				</div>
				<div
					className="prad-font-preview prad-font-24"
					style={ {
						fontFamily: `'${ font.family }'`,
					} }
				>
					{ __(
						'The quick brown fox jumps over the lazy dog',
						'product-addons'
					) }
				</div>
			</div>
			<div className="prad-d-flex prad-gap-8">
				<span
					className="prad-btn-action prad-lh-0"
					role="button"
					tabIndex="-1"
					onClick={ () => onEdit( font ) }
					style={ {
						pointerEvents: isDeleting ? 'none' : 'auto',
						opacity: isDeleting ? 0.5 : 1,
					} }
				>
					{ icons.edit }
				</span>
				<span
					className="prad-btn-action prad-lh-0 hover:prad-bg-error"
					role="button"
					tabIndex="-1"
					onClick={ () => onDelete( font.id ) }
					style={ {
						pointerEvents: isDeleting ? 'none' : 'auto',
						opacity: isDeleting ? 0.5 : 1,
					} }
				>
					{ icons.delete }
				</span>
			</div>
		</div>
	);
};

export default memo( FontItem );
