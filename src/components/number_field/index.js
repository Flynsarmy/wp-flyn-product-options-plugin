import './style.scss';
const NumberField = ( {
	value = '',
	onChange = () => {},
	min = undefined,
	max = undefined,
	step = 1,
	label = '',
	name = '',
	placeholder = '',
	inline = false,
	disabled = false,
	required = false,
	className = '',
	style = {},
	...rest
} ) => (
	<div
		className={ `prad-number-field${
			inline ? ' prad-number-field-inline' : ''
		} ${ className }` }
		style={ style }
	>
		{ label && (
			<label htmlFor={ name } style={ inline ? { marginRight: 8 } : {} }>
				{ label }
			</label>
		) }
		<input
			type="number"
			id={ name }
			name={ name }
			value={ value }
			onChange={ ( e ) => onChange( e.target.value ) }
			min={ min }
			max={ max }
			step={ step }
			placeholder={ placeholder }
			disabled={ disabled }
			required={ required }
			{ ...rest }
			className="prad-number-field__input"
		/>
	</div>
);

export default NumberField;
