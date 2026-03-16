const { __ } = wp.i18n;

const AlertModal = ( { message, onProceed, proceedText } ) => {
	return (
		<div className="prad-confirm-modal-overlay">
			<div className="prad-alert-modal-container">
				<div className="prad-d-flex prad-item-center prad-gap-10 prad-justify-left prad-mb-24">
					<svg
						height="22"
						width="22"
						fill="#faad14"
						aria-hidden="true"
						data-icon="exclamation-circle"
						viewBox="64 64 896 896"
					>
						<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z" />
					</svg>
					<div className="prad-font-18 prad-font-bold">
						{ message }
					</div>
				</div>
				<div className="prad-text-end">
					<button
						className="prad-confirm-btn prad-confirm-btn-confirm"
						onClick={ onProceed }
					>
						{ proceedText || __( 'Proceed', 'product-addons' ) }
					</button>
				</div>
			</div>
		</div>
	);
};

export default AlertModal;
