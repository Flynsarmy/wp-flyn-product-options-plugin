import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Icons from '../utils/Icons';
const { __ } = wp.i18n;

const Select = ( {
	options,
	onChange,
	selectedOption,
	selectedFamily,
	defaultValue = __( 'Select an option', 'product-addons' ),
	className = '',
	valueClass = '',
	dropdownClass = '',
	maxWidth,
	minWidth,
	width,
	dropdownMaxHeight,
	onlyIcon = false,
	iconName = 'angleDown',
	iconRotation = 'full',
	iconColor,
	borderColor = 'border-primary',
	borderRadius = 'smd',
	color = 'active',
	backgroundColor = 'base1',
	fontSize = '14',
	fontWeight = 'regular',
	fontHeight = 'medium',
	padding,
	style,
} ) => {
	const Icon = Icons[ iconName ] || null;
	const [ isOpen, setIsOpen ] = useState( false );
	const [ dropdownPosition, setDropdownPosition ] = useState( {
		width: 0,
		top: 0,
		left: 0,
		isAbove: false,
		isRight: false,
	} );
	const [ positionCalculated, setPositionCalculated ] = useState( false ); // Track if the position is calculated

	const dropdownRef = useRef( null );
	const triggerRef = useRef( null );

	// Function to calculate dropdown position
	const calculatePosition = () => {
		if ( triggerRef.current ) {
			const triggerRect = triggerRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;

			const dropdownHeight =
				dropdownRef.current?.getBoundingClientRect().height || 0;
			const dropdownWidth =
				dropdownRef.current?.getBoundingClientRect().width || 0;

			const isAbove =
				triggerRect?.top - dropdownHeight - 10 > 0
					? triggerRect.bottom + dropdownHeight + 10 > viewportHeight
					: false;
			const isRight =
				triggerRect.left - dropdownWidth - 10 > 0
					? triggerRect.left + dropdownWidth + 10 > viewportWidth
					: false;

			setDropdownPosition( {
				width: triggerRect?.width,
				top: isAbove
					? triggerRect?.top + window.scrollY - dropdownHeight - 1
					: triggerRect?.bottom + window.scrollY + 1,
				left: isRight
					? triggerRect?.right + window.scrollX - dropdownWidth
					: triggerRect?.left + window.scrollX,
				isAbove,
				isRight,
			} );
			setPositionCalculated( true ); // Mark position as calculated
		}
	};

	const handleToggle = () => {
		if ( ! isOpen ) {
			setTimeout( () => calculatePosition(), 0 );
		}
		setIsOpen( ! isOpen );
	};

	const getRotation = () => {
		if ( ! isOpen ) {
			return 'rotate(0deg)';
		}
		if ( iconRotation === 'full' ) {
			return 'rotate(180deg)';
		}
		if ( iconRotation === 'half' ) {
			return 'rotate(90deg)';
		}
		return 'rotate(0deg)';
	};

	const handleSelect = ( option ) => {
		if ( option.proDisabled ) {
			return;
		}
		selectedOption = option.value;
		setIsOpen( false );
		onChange?.( option );
	};

	const handleClickOutside = ( event ) => {
		if (
			dropdownRef.current &&
			! dropdownRef.current.contains( event.target ) &&
			triggerRef.current &&
			! triggerRef.current.contains( event.target )
		) {
			setIsOpen( false );
		}
	};

	// Set up event listeners for outside clicks and scroll event
	useEffect( () => {
		const abortControl = new AbortController();
		if ( triggerRef.current ) {
			triggerRef.current.style.setProperty(
				'padding',
				padding,
				'important'
			);
		}
		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		window.addEventListener( 'scroll', calculatePosition, {
			signal: abortControl.signal,
		} );
		return () => {
			abortControl.abort();
		};
	}, [] );

	const dropdownContent = isOpen && (
		<div
			className={ `prad-select-dropdown prad-br-${ borderRadius } prad-bc-${ borderColor } prad-color-${ color } prad-font-${ fontSize } prad-font-${ fontWeight } prad-lh-${ fontHeight } ${ dropdownClass }` }
			ref={ dropdownRef }
			style={ {
				zIndex: isOpen ? 999999 : -999999,
				top: isOpen ? `${ dropdownPosition.top }px` : 0,
				left: isOpen ? `${ dropdownPosition.left }px` : 0,
				opacity: isOpen ? 1 : 0,
				width: `${ dropdownPosition.width }px`,
				minWidth: 'fit-content',
				maxHeight: dropdownMaxHeight,
			} }
			onMouseDown={ ( e ) => e.stopPropagation() } // Prevent outside click handling
			role="button"
			tabIndex="-1"
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					e.stopPropagation();
				}
			} }
		>
			{ options.map( ( option ) => (
				<div
					key={ option.value }
					className={ `prad-select-option ${
						option.value === selectedOption ? 'selected' : ''
					} ${ option.disabled ? 'prad-disable' : '' }` }
					onClick={ () => handleSelect( option ) }
					role="button"
					tabIndex="-1"
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' ) {
							handleSelect( option );
						}
					} }
					{ ...( option.family && {
						style: {
							fontFamily: `"${ option.family }"`,
						},
					} ) }
				>
					<div className="prad-relative prad-w-fit">
						{ option.label }
					</div>
				</div>
			) ) }
		</div>
	);

	return (
		<div
			className="prad-select-wrapper-component prad-relative "
			style={ { maxWidth, minWidth, width } }
		>
			<div
				className={ `${
					onlyIcon
						? 'prad-w-fit'
						: `prad-select-trigger prad-br-${ borderRadius } prad-bc-${ borderColor } prad-bg-${ backgroundColor } prad-color-${ color } prad-font-${ fontSize } prad-font-${ fontWeight } prad-lh-${ fontHeight }`
				} ${ className }` }
				onClick={ handleToggle }
				ref={ triggerRef }
				style={ { ...style } }
				role="button"
				tabIndex="-1"
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' ) {
						handleToggle();
					}
				} }
			>
				{ ! onlyIcon && (
					<div
						className={ `prad-select-value ${ valueClass }` }
						style={ {
							maxWidth: '80%',
							fontFamily: selectedFamily
								? `"${ selectedFamily }"`
								: '',
						} }
					>
						{ options.find( function ( item ) {
							return item.value === selectedOption;
						} )?.label || defaultValue }
					</div>
				) }
				<div
					className={ `prad-icon prad-w-fit` }
					style={ {
						transition: 'transform var(--prad-transition-md)',
						transform: getRotation(),
						color: iconColor ? iconColor : 'unset',
					} }
				>
					{ Icon }
				</div>
			</div>
			{ positionCalculated &&
				ReactDOM.createPortal( dropdownContent, document.body ) }
		</div>
	);
};

export default Select;
