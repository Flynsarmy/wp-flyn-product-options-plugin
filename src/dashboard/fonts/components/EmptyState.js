import { memo } from 'react';

const { __ } = wp.i18n;

const EmptyState = () => {
	return (
		<div className="prad-text-center prad-p-40 prad-color-base6">
			<div className="prad-font-16 prad-mb-8">
				{ __( 'No custom fonts uploaded yet.', 'product-addons' ) }
			</div>
		</div>
	);
};

export default memo( EmptyState );
