const { __ } = wp.i18n;
import ButtonGroup from '../../../../../../components/button_group';

const ButtonStyles = ( props ) => {
	const { settings, toolbarSetData } = props;

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-gap-12">
				<ButtonGroup
					title={ __( 'Help Text Position' ) }
					value={ settings.descpPosition || 'belowTitle' }
					options={ [
						{ label: 'Below Title', value: 'belowTitle' },
						{ label: 'Tooltip', value: 'tooltip' },
						{ label: 'Below Field', value: 'belowField' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'descpPosition', value )
					}
				/>
				<ButtonGroup
					title={ __( 'View' ) }
					value={ settings.vertical || false }
					options={ [
						{ label: 'Vertical', value: true },
						{ label: 'Horizontal', value: false },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'vertical', value )
					}
				/>
				<ButtonGroup
					title={ __( 'Width' ) }
					value={ settings.blockWidth || '_100' }
					options={ [
						{ label: '33%', value: '_33' },
						{ label: '50%', value: '_50' },
						{ label: '66%', value: '_66' },
						{ label: '100%', value: '_100' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'blockWidth', value )
					}
				/>
			</div>
		</div>
	);
};

export default ButtonStyles;
