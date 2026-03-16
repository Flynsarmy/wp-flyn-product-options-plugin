const { __ } = wp.i18n;
import ButtonGroup from '../../../../../../components/button_group';
import Select from '../../../../../../components/Select';

const HeadingSettings = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<>
			<div>
				<label className="prad-field-title" htmlFor="heading_label">
					{ __( 'Title', 'product-addons' ) }
				</label>
				<input
					className="prad-input prad-width-none prad-w-full prad-bc-border-primary"
					type="text"
					id="heading_label"
					onChange={ ( v ) =>
						toolbarSetData( 'value', v.target.value )
					}
					value={ settings.value }
				/>
			</div>
			<div className="prad-mt-24 prad-d-flex prad-flex-col prad-gap-16">
				<div>
					<div className="prad-field-title">
						{ __( 'Heading Tag', 'product-addons' ) }
					</div>
					<Select
						options={ [
							{ value: 'h1', label: 'H1' },
							{ value: 'h2', label: 'H2' },
							{ value: 'h3', label: 'H3' },
							{ value: 'h4', label: 'H4' },
							{ value: 'h5', label: 'H5' },
							{ value: 'h6', label: 'H6' },
							{ value: 'div', label: 'DIV' },
							{ value: 'span', label: 'SPAN' },
						] }
						onChange={ ( val ) => {
							toolbarSetData( 'tag', val.value );
						} }
						width="100%"
						selectedOption={ settings.tag }
						borderRadius="md"
					/>
				</div>
				<div className="prad-mb-24 prad-w-full">
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
		</>
	);
};

export default HeadingSettings;
