import ToolBar from '../../../dashboard/toolbar/ToolBar';
import Label from '../../helper/fields/Label';
import { _setFieldData } from '../../../utils/Utils';

const Shortcode = ( props ) => {
	const { settings, fieldData, setFieldData, position } = props;
	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-shortcode prad-w-full ${ settings.class }` }
			>
				{ settings.label && settings.hide !== true && (
					<Label editAble={ true } { ...props } />
				) }
				<input
					className="prad-input prad-block-input prad-w-full"
					type="text"
					placeholder={ settings.placeholder }
					value={ settings.value }
					onChange={ ( e ) => {
						_setFieldData(
							setFieldData,
							fieldData,
							settings,
							position,
							'value',
							e.target.value
						);
					} }
				/>
			</div>
		</>
	);
};

export default Shortcode;
