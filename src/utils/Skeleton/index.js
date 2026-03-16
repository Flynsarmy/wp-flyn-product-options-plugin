import { Fragment } from 'react';

const Skeleton = ( props ) => {
	const {
		count = 1,
		wrapper: Wrapper,
		containerStyles = { width: '100%' },
		className: customClassName,
		containerClassName = '',
		containerTestId,
		circle = false,
		style: styleProp,
		isTableRow = false,
		container: Container = 'span',
		...originalPropsStyleOptions
	} = props;

	const propsStyleOptions = { ...originalPropsStyleOptions };

	for ( const [ key, value ] of Object.entries(
		originalPropsStyleOptions
	) ) {
		if ( typeof value === 'undefined' ) {
			delete propsStyleOptions[ key ];
		}
	}

	const styleOptions = {
		...propsStyleOptions,
		circle,
	};

	const styleOptionsToCssProperties = ( params ) => {
		const {
			baseColor,
			highlightColor,
			width,
			height,
			borderRadius,
			direction,
			duration,
			enableAnimation = true,
			gap = '5px',
		} = params;
		const style = {};

		if ( gap === 'rtl' ) {
			style[ '--gap' ] = gap;
		}
		if ( direction === 'rtl' ) {
			style[ '--animation-direction' ] = 'reverse';
		}
		if ( typeof duration === 'number' ) {
			style[ '--animation-duration' ] = `${ duration }s`;
		}
		if ( ! enableAnimation ) {
			style[ '--pseudo-element-display' ] = 'none';
		}

		if ( typeof width === 'string' || typeof width === 'number' ) {
			style.width = width;
		}
		if ( typeof height === 'string' || typeof height === 'number' ) {
			style.height = height;
		}

		if (
			typeof borderRadius === 'string' ||
			typeof borderRadius === 'number'
		) {
			style.borderRadius = borderRadius;
		}

		if ( params.circle ) {
			style.borderRadius = '50%';
		}

		if ( typeof baseColor !== 'undefined' ) {
			style[ '--base-color' ] = baseColor;
		}
		if ( typeof highlightColor !== 'undefined' ) {
			style[ '--highlight-color' ] = highlightColor;
		}

		return style;
	};

	const style = {
		...styleProp,
		...styleOptionsToCssProperties( styleOptions ),
	};

	let className = 'prad-loading-skeleton';
	if ( customClassName ) {
		className += ` ${ customClassName }`;
	}

	const inline = styleOptions.inline ?? false;

	const elements = [];

	const countCeil = Math.ceil( count );

	for ( let i = 0; i < countCeil; i++ ) {
		let thisStyle = style;

		if ( countCeil > count && i === countCeil - 1 ) {
			const width = thisStyle.width ?? '100%';

			const fractionalPart = count % 1;

			const fractionalWidth =
				typeof width === 'number'
					? width * fractionalPart
					: `calc(${ width } * ${ fractionalPart })`;

			thisStyle = { ...thisStyle, width: fractionalWidth };
		}

		const skeletonSpan = (
			<span className={ className } style={ thisStyle } key={ i }>
				&zwnj;
			</span>
		);

		if ( inline ) {
			elements.push( skeletonSpan );
		} else {
			elements.push(
				<Fragment key={ i }>
					{ skeletonSpan }
					{ ! isTableRow && <br /> }
				</Fragment>
			);
		}
	}

	return (
		<Container
			className={ `${ containerClassName } prad-skeleton-container` }
			data-testid={ containerTestId }
			aria-live="polite"
			aria-busy={ styleOptions.enableAnimation ?? true }
			style={ containerStyles }
		>
			{ Wrapper
				? elements.map( ( el, i ) => (
						<Wrapper key={ i }>{ el }</Wrapper>
				  ) )
				: elements }
		</Container>
	);
};

export default Skeleton;
