import { useEffect, useRef } from 'react';

const DropZone = ( {
	onDrop,
	onDragOver,
	onDragLeave,
	index,
	isOver,
	isNested = false,
} ) => {
	const dragRef = useRef( null );

	useEffect( () => {
		if ( dragRef.current ) {
			const marginLeft = isNested ? '1.5rem' : '0px';
			dragRef.current.style.setProperty(
				'margin-left',
				`${ marginLeft }`,
				'important'
			);
		}
	}, [ isNested ] );

	const handleDragOver = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		onDragOver();
	};

	const handleDrop = ( e ) => {
		e.preventDefault();
		onDrop( e, index );
	};

	return (
		<div
			className={ `prad-blocks-drop-zone ${
				isOver ? 'prad-dragging' : ''
			}` }
			onDragOver={ handleDragOver }
			onDragLeave={ onDragLeave }
			onDrop={ handleDrop }
			ref={ dragRef }
			style={ {
				background: isOver
					? 'var(--prad-color-primary)'
					: 'transparent',
				position: 'absolute',
				height: '6px',
				width: '100%',
			} }
		/>
	);
};

export default DropZone;
