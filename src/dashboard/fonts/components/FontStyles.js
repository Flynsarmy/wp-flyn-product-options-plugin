import { memo } from 'react';

const FontStyles = ( { fonts } ) => {
	if ( fonts.length === 0 ) {
		return null;
	}

	return (
		<style id="prad-custom-fonts">
			{ fonts
				.map(
					( font ) => `
				@font-face {
					font-family: '${ font.family }';
					src: url('${ font.src }') format('${
						font.file_type === 'ttf' ? 'truetype' : font.file_type
					}');
					font-weight: normal;
					font-style: normal;
					font-display: swap;
				}
			`
				)
				.join( '\n' ) }
		</style>
	);
};

export default memo( FontStyles );
