const FieldNumber = ( {
	label,
	fieldKey,
	value,
	handleChange,
	disabled,
	unit,
	min,
	max,
	classes,
	step,
} ) => {
	return (
		<div className={ classes ? classes : 'prad-w-full' }>
			<div className={ `prad-field-title` }>{ label }</div>
			<div className="prad-global-settings-item">
				<input
					id={ fieldKey }
					name={ fieldKey }
					type="number"
					{ ...( value ? { value } : {} ) }
					{ ...( min ? { min } : {} ) }
					{ ...( max ? { max } : {} ) }
					{ ...( step ? { step } : {} ) }
					onChange={ ( e ) => handleChange( e.target.value ) }
					disabled={ disabled ? true : false }
					className={ `prad-input prad-width-none prad-w-full prad-bc-border-primary` }
				/>
				{ unit && (
					<div className="prad-global-settings-unit">{ unit }</div>
				) }
			</div>
		</div>
	);
};

export default FieldNumber;
