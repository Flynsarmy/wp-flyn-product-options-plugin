import { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';

const ColorPickerTab = ( {
	onChange,
	normalColor = '#abe946',
	hoverColor = '#e94646',
	normalText = 'normal',
	hoverText = 'hover',
} ) => {
	// State for storing normal and hover colors
	const [ currentNormalColor, setCurrentNormalColor ] =
		useState( normalColor );
	const [ currentHoverColor, setCurrentHoverColor ] = useState( hoverColor );
	const [ activeTab, setActiveTab ] = useState( normalText );
	const [ color, setColor ] = useState( currentNormalColor );

	const handleTabSelection = ( selectedTab ) => {
		setActiveTab( selectedTab );
	};

	const handleColorChange = ( finalColor, type ) => {
		const newColor = {
			[ normalText ]: currentNormalColor,
			[ hoverText ]: currentHoverColor,
		};
		if ( type === normalText ) {
			setCurrentNormalColor( finalColor );
			newColor[ normalText ] = finalColor;
		} else {
			setCurrentHoverColor( finalColor );
			newColor[ hoverText ] = finalColor;
		}
		onChange( newColor );
	};

	// Update the color based on the active tab
	useEffect( () => {
		if ( activeTab === normalText ) {
			setColor( currentNormalColor ); // Update color to normal color
		} else {
			setColor( currentHoverColor ); // Update color to hover color
		}
	}, [ activeTab, normalText, currentNormalColor, currentHoverColor ] );

	return (
		<div>
			{ activeTab === normalText ? (
				<ColorPicker
					initialColor={ color }
					onChange={ ( newColor ) =>
						handleColorChange( newColor, normalText )
					}
					colorTabNormal={ normalText }
					colorTabHover={ hoverText }
					onTabChange={ ( colorType ) =>
						handleTabSelection( colorType )
					}
				/>
			) : (
				<ColorPicker
					initialColor={ color }
					onChange={ ( newColor ) =>
						handleColorChange( newColor, hoverText )
					}
					colorTabNormal={ normalText }
					colorTabHover={ hoverText }
					onTabChange={ ( colorType ) =>
						handleTabSelection( colorType )
					}
				/>
			) }
		</div>
	);
};

export default ColorPickerTab;
