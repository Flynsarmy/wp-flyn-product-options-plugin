import { useState, useRef } from 'react';

export const usePortal = () => {
	const [ isPortalOpen, setIsPostalOpen ] = useState( false );
	const portalAnchorRef = useRef();

	const portalOpen = () => setIsPostalOpen( true );
	const portalClose = () => setIsPostalOpen( false );
	const portalToggle = () => setIsPostalOpen( ! isPortalOpen );

	return {
		isPortalOpen,
		portalAnchorRef,
		portalOpen,
		portalClose,
		portalToggle,
	};
};

export default usePortal;
