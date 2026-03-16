import React from 'react';

const Loader = ( {
	fullScreen = true, // if false, loader will be inside a container, and that container must have to relative position
	topAlign = false,
	onlyLoader = false,
	widthContainer = false,
	className = '',
	loaderClass = '',
	backgroundColor = 'transparent',
	containerHeight = '200px',
} ) => {
	if ( onlyLoader ) {
		return (
			<img
				className={ className }
				style={ { maxWidth: '100px', maxHeight: '100px' } }
				src={ `${ pradBackendData.url }assets/img/loader.gif` }
				alt="loading gif"
			/>
		);
	}

	if ( widthContainer ) {
		return (
			<div
				className={ `${ 'prad-d-flex prad-item-center prad-justify-center' }  prad-bg-${ backgroundColor } ${ className }` }
				style={ { width: '100%', height: containerHeight } }
			>
				<img
					className={ ` ${
						topAlign && 'prad-absolute prad-z-99999 prad-top-p20'
					} ${ loaderClass }` }
					style={ { width: '60px', height: '60px' } }
					src={ `${ pradBackendData.url }assets/img/loader.gif` }
					alt="loading gif"
				/>
			</div>
		);
	}

	return (
		<div
			className={ `${
				fullScreen
					? 'prad-popup-overlay'
					: 'prad-absolute prad-z-999 prad-top prad-bottom prad-left prad-right prad-d-flex prad-item-center prad-justify-center'
			}  prad-bg-${ backgroundColor } ${ className }` }
		>
			<img
				className={ ` ${
					topAlign && 'prad-absolute prad-z-99999 prad-top-p20'
				} ${ loaderClass }` }
				style={ { maxWidth: '100px', maxHeight: '100px' } }
				src={ `${ pradBackendData.url }assets/img/loader.gif` }
				alt="loading gif"
			/>
		</div>
	);
};
export default Loader;
