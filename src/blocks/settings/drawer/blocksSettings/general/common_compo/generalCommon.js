const { __ } = wp.i18n;

const FieldTitle = ( props ) => {
	const { onChange, value, classes = '' } = props;
	const id = Math.random().toString( 36 ).substring( 2, 12 );
	return (
		<div className={ `prad-field-title-wrapper ${ classes }` }>
			<label
				htmlFor={ `${ id }-field-title` }
				className="prad-field-title"
			>
				{ __( 'Title', 'product-addons' ) }
			</label>
			<input
				className="prad-input prad-bc-border-primary prad-w-full"
				type="text"
				id={ `${ id }-field-title` }
				onChange={ ( e ) => onChange( e.target.value ) }
				value={ value }
				placeholder="Enter title here.."
			/>
		</div>
	);
};

const FieldHelpText = ( props ) => {
	const { onChange, value, classes = '' } = props;
	const id = Math.random().toString( 36 ).substring( 2, 12 );
	return (
		<div className={ `prad-field-help-wrapper ${ classes }` }>
			<label
				htmlFor={ `${ id }-field-help-text` }
				className="prad-field-title"
			>
				{ __( 'Help Text', 'product-addons' ) }
			</label>
			<input
				className="prad-input prad-bc-border-primary prad-w-full"
				type="text"
				id={ `${ id }-field-help-text` }
				onChange={ ( e ) => onChange( e.target.value ) }
				value={ value }
				placeholder="Enter help text here.."
			/>
		</div>
	);
};

const MinMaxSelectRestrictions = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-item-center prad-gap-12">
			<div className="prad-w-full">
				<label htmlFor="min-val" className="prad-field-title">
					{ __( 'Min Restriction', 'product-addons' ) }
				</label>
				<input
					className="prad-input prad-bc-border-primary prad-w-full"
					type="number"
					id="minSelect-val"
					onChange={ ( e ) =>
						toolbarSetData( 'minSelect', e.target.value )
					}
					value={ settings.minSelect }
					min="0"
				/>
			</div>
			<div className="prad-w-full">
				<label htmlFor="max-val" className="prad-field-title">
					{ __( 'Max Restriction', 'product-addons' ) }
				</label>
				<input
					className="prad-input prad-bc-border-primary prad-w-full"
					type="number"
					id="maxSelect-val"
					onChange={ ( e ) =>
						toolbarSetData( 'maxSelect', e.target.value )
					}
					value={ settings.maxSelect }
				/>
			</div>
		</div>
	);
};

const MinMaxQuantityRestrictions = ( props ) => {
	const { settings, toolbarSetData } = props;
	return (
		<div className="prad-d-flex prad-item-center prad-gap-12">
			<div className="prad-w-full">
				<label htmlFor="min-val" className="prad-field-title">
					{ __( 'Minimum Quantity', 'product-addons' ) }
				</label>
				<input
					className="prad-input prad-bc-border-primary prad-w-full"
					type="number"
					id="min-val"
					onChange={ ( e ) => {
						let _val = e.target.value;
						const countMax = Number( settings.max ?? '' );
						if ( countMax && _val && _val > countMax ) {
							_val = countMax - 1;
						}
						toolbarSetData(
							'min',
							_val < 0 ? Math.abs( Number( _val ) ) : _val
						);
					} }
					value={ settings.min }
				/>
			</div>
			<div className="prad-w-full">
				<label htmlFor="max-val" className="prad-field-title">
					{ 'Maximum Quantity' }
				</label>
				<input
					className="prad-input prad-bc-border-primary prad-w-full"
					type="number"
					id="max-val"
					onChange={ ( e ) => {
						let _val = e.target.value;
						const countMin = Number( settings.min ?? '' );
						if ( countMin && _val && _val < countMin ) {
							_val = countMin + 1;
						}
						toolbarSetData(
							'max',
							_val < 0 ? Math.abs( Number( _val ) ) : _val
						);
					} }
					value={ settings.max }
				/>
			</div>
		</div>
	);
};

export {
	FieldTitle,
	FieldHelpText,
	MinMaxSelectRestrictions,
	MinMaxQuantityRestrictions,
};
