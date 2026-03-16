import ToolBar from '../../../dashboard/toolbar/ToolBar';
import Icons from '../../../utils/Icons';
import DatePicker from '../../../components/DatePicker';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';
import { useAddons } from '../../../context/AddonsContext';
const { __ } = wp.i18n;

const Date = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );
	const { updateBlockById } = useAddons();

	const handleMigrate = () => {
		updateBlockById( settings.blockid, {
			type: 'datetime',
			blockType: 'date',
			timeFormat: '12_hours',
			disableSpecificDates: [],
			maxTime: '',
			minTime: '',
			maxDateType: 'none',
			minDateType: 'none',
			maxDate: '',
			minDate: '',
		} );
	};

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-date prad-w-full ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div className="prad-block-deprecated prad-d-flex prad-gap-12 prad-item-center prad-mb-10">
					<div
						className="prad-block-deprecated-title"
						style={ { color: '#F86E24', fontSize: '12px' } }
					>
						{ __( 'This field is deprecated', 'product-addons' ) }
					</div>
					<div
						className="prad-block-deprecated-btn "
						onClick={ () => handleMigrate() }
						style={ {
							background: '#F86E24',
							color: '#fff',
							padding: '4px 8px',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '12px',
						} }
					>
						{ __( 'Migrate', 'product-addons' ) }
					</div>
				</div>
				<div
					className={ `prad-d-flex prad-item-center prad-gap-12 prad-custom-datetime-picker-container prad-w-full` }
				>
					<div className="prad-date-picker-container prad-block-input prad-w-full prad-d-flex prad-item-center prad-gap-8">
						<div className="prad-lh-0 prad-input-date-icon prad-cursor-pointer">
							{ Icons.calendar_20 }
						</div>
						<DatePicker
							dateFormat={ settings.dateFormat }
							placeholder={ settings.dateFormat }
							maxDate={ settings.maxDate || '' }
							minDate={ settings.minDate || '' }
							disableDays={ settings.disableDays || '' }
							disableDates={ settings.disableDates || '' }
						/>
					</div>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Date;
