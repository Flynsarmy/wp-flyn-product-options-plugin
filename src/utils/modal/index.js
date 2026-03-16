import React from 'react';
const { __ } = wp.i18n;

const ConfirmModal = ( {
	message,
	onConfirm,
	onCancel,
	cancel,
	swap,
	confirm,
} ) => {
	return (
		<div className="prad-confirm-modal-overlay">
			<div className="prad-confirm-modal-container">
				<p className="prad-confirm-modal-message">{ message }</p>
				<div
					className="prad-confirm-modal-buttons"
					style={ { flexDirection: swap ? 'row-reverse' : '' } }
				>
					<button
						className="prad-confirm-btn prad-confirm-btn-confirm"
						onClick={ onCancel }
					>
						{ cancel || __( 'No', 'product-addons' ) }
					</button>
					<button
						className="prad-confirm-btn prad-confirm-btn-cancel"
						onClick={ onConfirm }
					>
						{ confirm || __( 'Yes', 'product-addons' ) }
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
