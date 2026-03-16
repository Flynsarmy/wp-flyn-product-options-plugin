import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ( props ) => {
	const {
		direction,
		type,
		content,
		tooltipContentClass,
		className,
		spaceTop,
		spaceBottom,
		spaceLeft,
		spaceRight,
		onlyText = false,
		parentColor,
		parentClass,
		children,
		parentStyle,
	} = props;
	const [ active, setActive ] = useState( false );
	const [ position, setPosition ] = useState( { top: 0, left: 0 } );
	const [ adjustedDirection, setAdjustedDirection ] = useState(
		direction || 'top'
	);
	const parentRef = useRef( null );
	const tooltipRef = useRef( null );

	const calculatePosition = () => {
		if ( tooltipRef.current && parentRef.current ) {
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			const parentRect = parentRef.current.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let top =
				parentRect.top +
				window.scrollY -
				( tooltipRect.height + 8 || 0 );
			let left =
				parentRect.left +
				window.scrollX -
				( ( tooltipRect.width - parentRect.width ) / 2 || 0 );
			let newDirection = direction || 'top';

			if ( newDirection === 'top' ) {
				top =
					parentRect.top +
					window.scrollY -
					( tooltipRect.height + 8 );
				left =
					parentRect.left +
					window.scrollX +
					( parentRect.width - tooltipRect.width ) / 2;
			} else if ( newDirection === 'bottom' ) {
				top = parentRect.bottom + window.scrollY + 8;
				left =
					parentRect.left +
					window.scrollX +
					( parentRect.width - tooltipRect.width ) / 2;
			} else if ( newDirection === 'left' ) {
				top =
					parentRect.top +
					window.scrollY +
					( parentRect.height - tooltipRect.height ) / 2;
				left =
					parentRect.left +
					window.scrollX -
					( tooltipRect.width + 8 );
			} else if ( newDirection === 'right' ) {
				top =
					parentRect.top +
					window.scrollY +
					( parentRect.height - tooltipRect.height ) / 2;
				left = parentRect.right + window.scrollX + 8;
			}

			if (
				tooltipRect.bottom + 0 > viewportHeight &&
				newDirection === 'bottom'
			) {
				newDirection = 'top';
				top =
					parentRect.top +
					window.scrollY -
					( tooltipRect.height + 8 );
			} else if (
				tooltipRect.top < tooltipRect.height + 70 &&
				newDirection === 'top'
			) {
				newDirection = 'bottom';
				top = parentRect.bottom + window.scrollY + 8;
				if ( tooltipRect.width + parentRect.right > viewportWidth ) {
					newDirection = 'left';
					top =
						parentRect.top +
						window.scrollY +
						( parentRect.height - tooltipRect.height ) / 2;
					left =
						parentRect.left +
						window.scrollX -
						( tooltipRect.width + 8 );
				}
			}

			if (
				tooltipRect.width + left + 70 > viewportWidth &&
				newDirection === 'right'
			) {
				if ( tooltipRect.left > tooltipRect.width + 8 ) {
					newDirection = 'left';
					left =
						parentRect.left +
						window.scrollX -
						( tooltipRect.width + 8 );
				} else if ( tooltipRect.top < tooltipRect.height + 70 ) {
					newDirection = 'bottom';
					top = parentRect.bottom + window.scrollY + 8;
					left =
						parentRect.left +
						window.scrollX +
						( parentRect.width - tooltipRect.width ) / 2;
				} else {
					newDirection = 'top';
					top =
						parentRect.top +
						window.scrollY -
						( tooltipRect.height + 8 );
					left =
						parentRect.left +
						window.scrollX +
						( parentRect.width - tooltipRect.width ) / 2;
				}
			} else if (
				parentRect.left < tooltipRect.width + 8 &&
				newDirection === 'left'
			) {
				if (
					tooltipRect.width + parentRect.right + 70 <
					viewportWidth
				) {
					newDirection = 'right';
					left = parentRect.right + window.scrollX + 8;
				} else if ( tooltipRect.top < tooltipRect.height + 70 ) {
					newDirection = 'bottom';
					top = parentRect.bottom + window.scrollY + 8;
					left =
						parentRect.left +
						window.scrollX +
						( parentRect.width - tooltipRect.width ) / 2;
				} else {
					newDirection = 'top';
					top =
						parentRect.top +
						window.scrollY -
						( tooltipRect.height + 8 );
					left =
						parentRect.left +
						window.scrollX +
						( parentRect.width - tooltipRect.width ) / 2;
				}
			}

			setAdjustedDirection( newDirection );
			setPosition( { top, left } );
		}
	};

	const showToolTip = () => {
		setActive( true );
	};

	const hideToolTip = () => {
		setActive( false );
	};

	useEffect( () => {
		if ( parentRef.current ) {
			parentRef.current.style.setProperty(
				'padding',
				`${ spaceTop || '0' } ${ spaceRight || '0' } ${
					spaceBottom || '0'
				} ${ spaceLeft || '0' }`,
				'important'
			);
		}
	}, [] );
	useEffect( () => {
		calculatePosition();
	}, [ active ] );

	const tooltipContent = (
		<div
			ref={ tooltipRef }
			className={ `prad-tooltip-content prad-font-regular ${ tooltipContentClass } ${ adjustedDirection }` }
			style={ {
				position: 'absolute',
				zIndex: active ? 999999 : -999999,
				top: active ? position.top : 0,
				left: active ? position.left : 0,
				visibility: active ? 'visible' : 'hidden',
				opacity: active ? 1 : 0,
				transition: 'opacity var(--prad-transition-md) ease-in-out',
			} }
		>
			{ type === 'element' ? content : content.replace( /{.*}/, '' ) }
		</div>
	);

	return (
		<>
			<div
				ref={ parentRef }
				className={ `prad-tooltip ${ className }` }
				onMouseEnter={ showToolTip }
				onMouseLeave={ hideToolTip }
			>
				<div
					className={ `
                    ${
						! onlyText &&
						`prad-lh-0 prad-icon-wrapper 
                        ${
							parentColor
								? `prad-color-${ parentColor }`
								: 'prad-color-secondary'
						}`
					} prad-w-fit ${ parentClass }` }
					style={ { ...parentStyle } }
				>
					{ children }
				</div>
			</div>
			{ ReactDOM.createPortal( tooltipContent, document.body ) }
		</>
	);
};

export default Tooltip;
