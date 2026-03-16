import ToolBar from '../../../dashboard/toolbar/ToolBar';
import icons from '../../../utils/Icons';
import TimePicker from '../../../components/TimePicker';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';
import { useAddons } from '../../../context/AddonsContext';
const { __ } = wp.i18n;

const Time = ( props ) => {
	const { settings } = props;
	const blockObject = useAbstractBlock( settings, { ...props } );
	const { updateBlockById } = useAddons();

	const handleMigrate = () => {
		updateBlockById( settings.blockid, {
			type: 'datetime',
			blockType: 'time',
			timeFormat: '12_hours',
			disableSpecificDates: [],
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
					className={ `prad-d-flex prad-item-center prad-gap-12 prad-w-full` }
				>
					<div className="prad-d-flex prad-item-center prad-gap-12 prad-w-full">
						<div className="prad-w-full prad-relative prad-block-input prad-d-flex prad-item-center prad-gap-8 prad-time-picker-container prad-custom-datetime-picker-container">
							<div className="prad-lh-0 prad-input-time-icon prad-cursor-pointer">
								{ icons.clock_20 }
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
					</div>
					{ blockObject.renderPriceWithOption() }
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Time;
