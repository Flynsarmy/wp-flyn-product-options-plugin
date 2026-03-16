import { useEffect, useRef, useState } from 'react';

const EditableTitle = ( {
	className = '',
	initialTitle = 'Click to Edit Title',
	background = 'transparent',
	borderColor = 'border-primary',
	borderRadius = 'smd',
	width = '250px',
	padding = '10px 12px',
	minWidth,
	maxWidth,
	color = 'text-dark',
	fontSize = '14',
	fontWeight = 'regular',
	onChange,
} ) => {
	const containerRef = useRef( null );
	const contentRef = useRef( null );
	const [ isFocused, setIsFocused ] = useState( false );

	useEffect( () => {
		if ( containerRef.current ) {
			containerRef.current.style.setProperty(
				'padding',
				padding,
				'important'
			);
		}
	}, [] );

	useEffect( () => {
		if (
			contentRef.current &&
			contentRef.current.ownerDocument &&
			contentRef.current.ownerDocument.activeElement !==
				contentRef.current
		) {
			contentRef.current.innerText = initialTitle;
		}
	}, [ initialTitle ] );

	const handleInput = ( e ) => {
		onChange( e, e.target.textContent );
	};
	const handleFocus = () => setIsFocused( true );
	const handleBlur = () => setIsFocused( false );

	return (
		<div
			className={ `prad-d-flex prad-item-center prad-w-fit prad-bg-${ background } prad-border-default prad-bc-${ borderColor } prad-br-${ borderRadius } ${ className }` }
			ref={ containerRef }
			onFocus={ handleFocus }
			onBlur={ handleBlur }
		>
			<div
				style={ {
					width,
					minWidth,
					maxWidth,
					overflow: 'auto',
				} }
				className="prad-scrollbar-hidden"
			>
				<div
					ref={ contentRef }
					contentEditable={ true }
					onInput={ handleInput }
					title={ initialTitle }
					className={ `prad-editable prad-space-nowrap prad-font-${ fontSize } prad-font-${ fontWeight } prad-color-${ color } ${
						! isFocused ? 'prad-ellipsis' : ''
					}` }
				/>
			</div>
		</div>
	);
};

export default EditableTitle;
