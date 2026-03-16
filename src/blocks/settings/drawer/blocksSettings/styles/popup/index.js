import ButtonGroup from '../../../../../../components/button_group';
const { __ } = wp.i18n;

const PopUpContentStyles = ( props ) => {
	const { settings, toolbarSetData } = props;

	return (
		<div className="prad-d-flex prad-flex-column prad-gap-24">
			<div className="prad-d-flex prad-w-half prad-gap-24">
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

export default PopUpContentStyles;
