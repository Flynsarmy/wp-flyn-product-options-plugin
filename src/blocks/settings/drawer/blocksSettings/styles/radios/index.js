const { __ } = wp.i18n;
import ButtonGroup from '../../../../../../components/button_group';
import FieldNumber from '../../../../common/FieldNumber';

const RadioStyles = ( props ) => {
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
				<FieldNumber
					label={ 'Fixed Height' }
					fieldKey={ 'fixedHeight' }
					value={ settings.fixedHeight }
					handleChange={ ( value ) =>
						toolbarSetData( 'fixedHeight', value )
					}
					disabled={ false }
					unit={ 'px' }
					min="0"
				/>
			</div>
			<div className="prad-d-flex prad-gap-12">
				<ButtonGroup
					title={ __( 'Columns' ) }
					value={ settings.columns || '1' }
					options={ [
						{ label: 'One', value: '1' },
						{ label: 'two', value: '2' },
					] }
					onChange={ ( value ) => {
						toolbarSetData( 'columns', value );
					} }
				/>
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

export default RadioStyles;
