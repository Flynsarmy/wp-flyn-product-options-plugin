const FieldToggle = ( props ) => {
	const { fieldKey, checked, label, handleChange, className = '' } = props;
	return (
		<div>
			<input
				type="checkbox"
				className="prad-input-hidden"
				id={ 'field-toggle-' + fieldKey }
				value={ 'field-toggle' }
				checked={ checked }
				onChange={ () => handleChange( ! checked ) }
			/>
			<label
				htmlFor={ 'field-toggle-' + fieldKey }
				className={ `prad-d-flex prad-gap-8 prad-item-center ${ className }` }
			>
				<div className="prad-btn-slider prad-btn-slider-md"></div>
				<div className="prad-font-14 prad-color-active">{ label }</div>
			</label>
		</div>
	);
};

export default FieldToggle;
