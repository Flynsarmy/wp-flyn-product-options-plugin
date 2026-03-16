const { __ } = wp.i18n;
import ButtonGroup from '../../../../../../components/button_group';

const SectionStyles = ( props ) => {
	const { settings, toolbarSetData } = props;

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-item-center prad-gap-12">
				<ButtonGroup
					title={ __( 'Help Text Position' ) }
					value={ settings.descpPosition || 'belowTitle' }
					options={ [
						{ label: 'Below Title', value: 'belowTitle' },
						{ label: 'Tooltip', value: 'tooltip' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'descpPosition', value )
					}
				/>
				<ButtonGroup
					title={ __( 'Style' ) }
					value={ settings.showAccordion || false }
					options={ [
						{ label: 'Section', value: false },
						{ label: 'Accordion', value: true },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'showAccordion', value )
					}
				/>
			</div>
			<div className="prad-d-flex prad-item-center prad-gap-12">
				<ButtonGroup
					title={ __( 'Initial State' ) }
					value={ settings.initState || 'open' }
					options={ [
						{ label: 'Open', value: 'open' },
						{ label: 'Close', value: 'close' },
					] }
					onChange={ ( value ) =>
						toolbarSetData( 'initState', value )
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

export default SectionStyles;
