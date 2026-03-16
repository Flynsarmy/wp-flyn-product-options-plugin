import { forwardRef, useEffect, useRef, useState } from 'react';
import icons from '../utils/Icons';

const Button = forwardRef(
	(
		{
			value = 'value',
			onClick = () => {},
			buttonLink = '',
			sameTab = false,
			dataTarget = '',
			disable = false,
			onlyText = false,
			onlyIcon = false,
			borderBtn = false,
			smallButton = false,
			className = '',
			iconName = '',
			iconClass = '',
			iconColor = '',
			iconPosition = 'before',
			iconGap = '8',
			iconAnimation = '',
			iconRotation,
			background = 'transparent',
			color = '',
			fontSize = '14',
			fontWeight = 'semi',
			fontHeight = 'btn',
			borderColor = '',
			borderRadius = 'smd',
			textAlign = 'center',
			textTransform = 'none',
			width,
			padding,
			style,
			loading,
		},
		ref
	) => {
		const buttonRef = useRef( null );
		const Icon = icons[ iconName ] || null;
		const IconPosition =
			iconPosition === 'before' || iconPosition === 'left';

		const [ isActive, setIsActive ] = useState( false );

		useEffect( () => {
			if ( buttonRef.current ) {
				buttonRef.current.style.setProperty(
					'padding',
					padding,
					'important'
				);
			}
		}, [] );

		const handleClick = ( e ) => {
			e.preventDefault();
			if ( ! disable ) {
				const button = e.currentTarget;
				setIsActive( ! isActive );
				button.style.transform = 'scale(0.95)';
				setTimeout(
					() => ( button.style.transform = 'scale(1)' ),
					150
				);
				if ( buttonLink ) {
					if ( sameTab ) {
						window.location.href = buttonLink;
					} else {
						window.open( buttonLink, '_blank' );
					}
				} else {
					onClick( e );
				}
			}
		};

		const getTransform = () => {
			if ( iconRotation && isActive ) {
				if ( iconRotation === 'full' ) {
					return 'rotate(180deg)';
				} else if ( iconRotation === 'half' ) {
					return 'rotate(90deg)';
				}
			}
			return 'rotate(0deg)';
		};

		return (
			<div
				ref={ ( el ) => {
					// Link both refs: the forwarded ref and internal buttonRef
					buttonRef.current = el;
					if ( ref ) {
						ref.current = el;
					}
				} }
				className={ `${ onlyText ? 'prad-btn-text' : 'prad-btn' } ${
					borderBtn ? 'prad-btn-bordered' : ''
				} ${ background ? `prad-bg-${ background }` : '' } ${
					color ? `prad-color-${ color }` : ''
				} prad-font-${ fontSize } prad-font-${ fontWeight } prad-lh-${ fontHeight } prad-text-${ textAlign } prad-text-${ textTransform } prad-br-${ borderRadius } ${
					borderColor
						? `prad-border-default prad-bc-${ borderColor }`
						: ''
				} ${ Icon ? 'prad-btn-icon' : '' } prad-gap-${ iconGap } ${
					disable ? 'disable' : ''
				} ${ smallButton ? 'prad-btn-sm' : '' } ${
					loading ? 'prad-d-flex prad-item-center' : ''
				} ${ className }`
					.replace( /\s+/g, ' ' )
					.trim() }
				style={ {
					width,
					...style,
				} }
				onClick={ handleClick }
				data-target={ dataTarget }
				role="button"
				tabIndex="-1"
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' ) {
						handleClick( e );
					}
				} }
			>
				{ IconPosition && Icon && (
					<div
						className={ `prad-icon 
                        ${
							iconAnimation ? `prad-anim-${ iconAnimation }` : ''
						} 
                        ${ iconColor ? `prad-color-${ iconColor }` : '' } 
                        ${ iconClass ? iconClass : '' }
                    ` }
						style={ {
							transition: 'transform var(--prad-transition-md)',
							transform: getTransform(),
						} }
					>
						{ Icon }
					</div>
				) }
				{ ! onlyIcon && value }
				{ loading && <span className="prad-icon-loading"></span> }
				{ ! IconPosition && Icon && (
					<div
						className={ `prad-icon 
                        ${
							iconAnimation ? `prad-anim-${ iconAnimation }` : ''
						} 
                        ${ iconColor ? `prad-color-${ iconColor }` : '' } 
                        ${ iconClass ? iconClass : '' }
                    ` }
						style={ {
							transition: 'transform var(--prad-transition-md)',
							transform: getTransform(),
						} }
					>
						{ Icon }
					</div>
				) }
			</div>
		);
	}
);

export default Button;
