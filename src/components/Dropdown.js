import { useRef, useState, useEffect } from 'react';
import Icons from '../utils/Icons';
import ReactDOM from 'react-dom';

const Dropdown = ( props ) => {
	const [ status, setStatus ] = useState( false );
	const {
		title,
		renderContent,
		className = '',
		labelClassName = '',
		contentClass = '',
		onClickCallback,
		iconName = '',
		iconClass = '',
		noIcon = false,
		iconPosition = 'after',
		iconColor = '',
		iconGap = '8',
		iconRotation = 'full',
	} = props;

	const [ contentPosition, setContentPosition ] = useState( {
		top: 0,
		left: 0,
		isAbove: false,
		isRight: false,
	} );

	const dropdownRef = useRef( null );
	const contentRef = useRef( null );

	const position = iconPosition === 'before' || iconPosition === 'left';
	const Icon = iconName && Icons[ iconName ] ? Icons[ iconName ] : false;

	const handleOutsideClick = ( e ) => {
		if (
			dropdownRef.current &&
			( dropdownRef.current.contains( e.target ) ||
				( contentRef.current &&
					contentRef.current.contains( e.target ) ) )
		) {
			return;
		}
		setStatus( false );
	};

	useEffect( () => {
		if ( status ) {
			document.addEventListener( 'mousedown', handleOutsideClick );
		} else {
			document.removeEventListener( 'mousedown', handleOutsideClick );
		}
		return () => {
			document.removeEventListener( 'mousedown', handleOutsideClick );
		};
	}, [ status ] );

	const toggleDropdown = () => {
		if ( ! status ) {
			const rect = dropdownRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;

			setTimeout( () => {
				const contentHeight = contentRef.current
					? contentRef.current.getBoundingClientRect().height
					: 0;
				const contentWidth = contentRef.current
					? contentRef.current.getBoundingClientRect().width
					: 0;

				const isAbove =
					rect.top - contentHeight > 0
						? rect.bottom + contentHeight > viewportHeight
						: false;
				const isRight =
					rect.left - contentWidth > 0
						? rect.left + contentWidth > viewportWidth
						: false;

				setContentPosition( {
					top: isAbove
						? rect.top + window.scrollY - contentHeight - 10
						: rect.bottom + window.scrollY + 10,
					left: isRight
						? rect.right + window.scrollX - contentWidth
						: rect.left + window.scrollX,
					isAbove,
					isRight,
				} );
			}, 0 );
		}
		setStatus( ! status );
	};

	const dropdownContent = status && (
		<div
			className={ `prad-dropdown-content-wrapper ${
				props.padding ? `prad-p-${ props.padding }` : ''
			} ${ contentClass }` }
			ref={ contentRef }
			style={ {
				position: 'absolute',
				zIndex: status ? 999999 : -999999,
				visibility: status ? 'visible' : 'hidden',
				opacity: status ? 1 : 0,
				transition: 'opacity 0.3s ease-in-out',
				top: status ? `${ contentPosition.top - 5 }px` : 0,
				left: status ? `${ contentPosition.left }px` : 0,
			} }
		>
			{ renderContent() }
		</div>
	);

	let transformValue;

	if ( status ) {
		if ( iconRotation === 'full' ) {
			transformValue = 'rotate(180deg)';
		} else if ( iconRotation === 'half' ) {
			transformValue = 'rotate(90deg)';
		} else {
			transformValue = 'rotate(0deg)';
		}
	} else {
		transformValue = 'rotate(0deg)';
	}

	return (
		<div
			className={ `prad-dropdown ${
				! noIcon && 'prad-d-flex prad-item-center'
			} prad-gap-${ iconGap } ${ className } ${ status && 'active' }` }
			ref={ dropdownRef }
			onClick={ ( e ) => {
				toggleDropdown();
				if ( onClickCallback ) {
					onClickCallback( e );
				}
			} }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					toggleDropdown();
					if ( onClickCallback ) {
						onClickCallback( e );
					}
				}
			} }
			role="button"
			tabIndex="0"
		>
			{ ! noIcon && position && (
				<div
					className={ `prad-icon ${
						iconColor ? `prad-color-${ iconColor }` : ''
					} ${ iconClass }` }
					style={ {
						transition: 'transform var(--transition-md)',
						transform: transformValue,
					} }
				>
					{ Icon ? Icon : Icons.angleDown }
				</div>
			) }
			{ title && (
				<div
					className={ `prad-input-label prad-mb-0 ${ labelClassName } ${
						status && 'active'
					}` }
				>
					{ title }
				</div>
			) }
			{ ! noIcon && ! position && (
				<div
					className={ `prad-icon ${
						iconColor ? `prad-color-${ iconColor }` : ''
					} ${ iconClass }` }
					style={ {
						transition: 'transform var(--transition-md)',
						transform: transformValue,
					} }
				>
					{ Icon ? Icon : Icons.angleDown }
				</div>
			) }
			{ ReactDOM.createPortal( dropdownContent, document.body ) }
		</div>
	);
};

export default Dropdown;
