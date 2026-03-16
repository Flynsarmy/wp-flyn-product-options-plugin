import Icons from '../utils/Icons';

const Popup = ( {
	className = '',
	overlayClass = '',
	noHeader = false,
	title,
	onClose,
	children,
	footerChildren,
} ) => {
	return (
		<div
			className={ `prad-popup-overlay prad-border-none ${ overlayClass }` }
		>
			<div
				style={ { maxWidth: '500px', width: '90%' } }
				className={ `prad-card prad-bg-base1 ${ className }` }
			>
				{ ! noHeader && ( title || onClose ) && (
					<div className="prad-card-header prad-d-flex prad-item-center prad-justify-between prad-color-text-dark">
						<div className="prad-font-18 prad-font-semi">
							{ title }
						</div>
						{ onClose && (
							<div
								className="prad-btn-close prad-bg-base2"
								onClick={ onClose }
								role="button"
								tabIndex="-1"
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										onClose;
									}
								} }
							>
								{ Icons.cross_20 }
							</div>
						) }
					</div>
				) }
				<div className="prad-card-body prad-color-text-medium">
					{ children }
				</div>
				{ footerChildren && (
					<div className="prad-card-footer prad-color-text-body">
						{ footerChildren }
					</div>
				) }
			</div>
		</div>
	);
};

export default Popup;
