import ButtonGroup from '../../../../../../components/button_group';
import Select from '../../../../../../components/Select';
const { __ } = wp.i18n;

const DateTimeStyles = ( props ) => {
	const { settings, toolbarSetData } = props;

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-20">
			<div className="prad-d-flex prad-gap-12">
				<ButtonGroup
					title={ __( 'Description Position' ) }
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
				<div className="prad-w-full">
					<div className="prad-field-title">
						{ __( 'Price Position', 'product-addons' ) }
					</div>
					<Select
						options={ [
							{
								value: 'with_title',
								label: 'With Title',
							},
							{
								value: 'with_option',
								label: 'With Option',
							},
						] }
						onChange={ ( val ) => {
							toolbarSetData( 'pricePosition', val.value );
						} }
						width="100%"
						selectedOption={ settings.pricePosition }
						borderRadius="md"
						className="prad-toolbar-selection"
					/>
				</div>
			</div>
			<div className="prad-d-flex prad-gap-12 prad-w-half">
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

export default DateTimeStyles;
