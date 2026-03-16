const { __ } = wp.i18n;
import ButtonGroup from '../../../../../../components/button_group';
import TimePicker from '../../../../../../components/TimePicker';
import { icons } from '@tiptap/pm/menu';

const TimeSettings = ( props ) => {
	const { settings, toolbarSetData } = props;

	return (
		<>
			<div className="prad-d-flex prad-gap-12 prad-border-default prad-br-md prad-p-12">
				<div className="prad-w-full">
					<div className="prad-field-title">
						{ __( 'Time Range (Min)', 'product-addons' ) }
					</div>
					<div className="prad-datetime-container">
						<div className="prad-settings-time prad-settings-time-p-top prad-br-md prad-d-flex prad-item-center prad-gap-8 prad-time-picker-container prad-custom-datetime-picker-container">
							<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
								{ icons.clock_20 }
							</div>
							<TimePicker
								onChange={ ( _val ) => {
									toolbarSetData( 'minTime', _val );
								} }
								defVal={ settings.minTime }
								placeholder={ settings.minTime || 'hh:mm A' }
							/>
						</div>
					</div>
				</div>
				<div className="prad-w-full">
					<div className="prad-field-title">
						{ __( 'Time Range (Max)', 'product-addons' ) }
					</div>
					<div className="prad-datetime-container">
						<div className="prad-settings-time prad-settings-time-p-top prad-br-md prad-d-flex prad-item-center prad-gap-8 prad-time-picker-container prad-custom-datetime-picker-container">
							<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
								{ icons.clock_20 }
							</div>
							<TimePicker
								onChange={ ( _val ) => {
									toolbarSetData( 'maxTime', _val );
								} }
								defVal={ settings.maxTime }
								placeholder={ settings.maxTime || 'hh:mm A' }
							/>
						</div>
					</div>
				</div>
				<div className="prad-w-full">
					<ButtonGroup
						title={ __( 'Time Format' ) }
						value={ settings.timeFormat || '12_hours' }
						options={ [
							{ label: '12 Hours', value: '12_hours' },
							{ label: '24 Hours', value: '24_hours' },
						] }
						onChange={ ( value ) =>
							toolbarSetData( 'timeFormat', value )
						}
					/>
				</div>
			</div>
			<div style={ { height: '80px' } }></div>
		</>
	);
};

export default TimeSettings;
