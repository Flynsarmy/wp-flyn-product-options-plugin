import ToolBar from '../../../dashboard/toolbar/ToolBar';
import Icons from '../../../utils/Icons';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const DateTime = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-datetime prad-w-full ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div
					className={ `prad-d-flex prad-item-center prad-gap-12 prad-custom-datetime-picker-container prad-w-full` }
				>
					<div className="prad-datetime-container prad-w-full prad-d-flex prad-item-center prad-gap-12">
						{ /* Date Picker Section */ }
						{ settings.blockType !== 'time' && (
							<div className="prad-date-picker-container prad-block-input prad-w-50 prad-d-flex prad-item-center prad-gap-8 prad-w-full">
								<div className="prad-lh-0 prad-input-date-icon prad-cursor-pointer">
									{ Icons.calendar_20 }
								</div>
								<DatePicker
									dateFormat={ settings.dateFormat }
									placeholder={ settings.dateFormat }
									maxDate={
										settings.maxDateType === 'custom'
											? settings.maxDate
											: settings.maxDateType
									}
									minDate={
										settings.minDateType === 'custom'
											? settings.minDate
											: settings.minDateType
									}
									disableDays={ settings.disableDays }
									disableDates={ settings.disableDates }
									disableToday={ settings.disableToday }
									disableSpecificDates={
										settings.disableSpecificDates || false
									}
								/>
							</div>
						) }
						{ /* Time Picker Section */ }
						{ settings.blockType !== 'date' && (
							<div className="prad-time-picker-container prad-block-input prad-w-50 prad-d-flex prad-item-center prad-gap-8 prad-w-full">
								<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
									{ Icons.clock_20 }
								</div>
								<TimePicker
									placeholder={
										settings.timeFormat === '12_hours'
											? 'hh:mm AM/PM'
											: 'HH:mm'
									}
									minTime={ settings.minTime || '' }
									maxTime={ settings.maxTime || '' }
								/>
							</div>
						) }
					</div>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default DateTime;
