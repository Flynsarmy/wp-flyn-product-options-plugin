import ButtonGroup from '../../../../../components/button_group';
const { __ } = wp.i18n;

const SelectiveStyle = ( { settings, toolbarSetData } ) => {
	return (
		<div className="prad-w-full">
			<ButtonGroup
				title={ __( 'Image Style' ) }
				value={ settings.imgStyle || 'normal' }
				options={ [
					{ label: 'Normal', value: 'normal' },
					{ label: 'Circle', value: 'circle' },
				] }
				onChange={ ( value ) => {
					toolbarSetData( 'imgStyle', value );
				} }
			/>
		</div>
	);
};

export default SelectiveStyle;
