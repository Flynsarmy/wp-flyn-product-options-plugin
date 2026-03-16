import {
	useRef,
	useEffect,
	useState,
	useLayoutEffect,
	useCallback,
} from 'react';
import ReactDOM from 'react-dom';

const Portal = ( {
	children,
	anchorRef,
	isOpen = false,
	onClickOutside,
	className = '',
	hasTransition = false,
} ) => {
	const portalRef = useRef();
	const [ pos, setPos ] = useState( { top: 0, left: 0, width: 'auto' } );
	const [ mounted, setMounted ] = useState( isOpen );
	const [ animState, setAnimState ] = useState(
		isOpen ? 'entered' : 'exited'
	);

	const updatePosition = useCallback( () => {
		if ( ! anchorRef?.current ) {
			return;
		}

		const rect = anchorRef.current.getBoundingClientRect();
		const scrollY = window.scrollY;
		const scrollX = window.scrollX;

		let top = rect.bottom + scrollY;
		const left = rect.left + scrollX;
		const width = rect.width;

		// Check if there's space below, otherwise position above
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;

		if ( portalRef.current ) {
			const portalHeight = portalRef.current.offsetHeight || 200;

			if ( spaceBelow < portalHeight && spaceAbove > spaceBelow ) {
				top = rect.top + scrollY - portalHeight;
			}
		}

		setPos( { top, left, width } );
	}, [ anchorRef, portalRef ] );

	useLayoutEffect( () => {
		if ( ! anchorRef?.current || ! mounted ) {
			return;
		}

		updatePosition();

		window.addEventListener( 'scroll', updatePosition, true );
		window.addEventListener( 'resize', updatePosition );

		return () => {
			window.removeEventListener( 'scroll', updatePosition, true );
			window.removeEventListener( 'resize', updatePosition );
		};
	}, [ mounted, updatePosition ] );

	useEffect( () => {
		if ( ! mounted || ! onClickOutside ) {
			return;
		}

		const handleClick = ( e ) => {
			if (
				anchorRef?.current &&
				! anchorRef.current.contains( e.target ) &&
				portalRef.current &&
				! portalRef.current.contains( e.target )
			) {
				onClickOutside();
			}
		};

		document.addEventListener( 'click', handleClick );
		return () => document.removeEventListener( 'click', handleClick );
	}, [ mounted, onClickOutside ] );

	useEffect( () => {
		if ( ! hasTransition ) {
			setMounted( isOpen );
			setAnimState( isOpen ? 'entered' : 'exited' );
			return;
		}

		if ( isOpen ) {
			setMounted( true );
			requestAnimationFrame( () => {
				setAnimState( 'entering' );
				requestAnimationFrame( () => setAnimState( 'entered' ) );
			} );
		} else {
			setAnimState( 'exiting' );
			const timer = setTimeout( () => {
				setAnimState( 'exited' );
				setMounted( false );
			}, 200 );
			return () => clearTimeout( timer );
		}
	}, [ isOpen, hasTransition ] );

	if ( ! mounted ) {
		return null;
	}

	const baseStyle = {
		position: 'absolute',
		top: pos.top,
		left: pos.left,
		width: pos.width,
		zIndex: 999999,
	};

	const transitionStyle = hasTransition
		? {
				transition: 'opacity 160ms ease, transform 160ms ease',
				opacity:
					animState === 'entered' || animState === 'entering' ? 1 : 0,
				transform:
					animState === 'entered' || animState === 'entering'
						? 'translateY(0)'
						: 'translateY(-6px)',
				willChange: 'opacity, transform',
		  }
		: {};

	return ReactDOM.createPortal(
		<div
			ref={ portalRef }
			className={ className }
			style={ Object.assign( {}, baseStyle, transitionStyle ) }
			aria-hidden={ ! isOpen }
		>
			{ children }
		</div>,
		document.body
	);
};

export default Portal;
