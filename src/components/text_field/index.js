import './style.scss';
const TextField = ( {
	value = '',
	onChange = () => {},
	label = '',
	placeholder = '',
	name = '',
	disabled = false,
	inline = false,
	className = '',
	style = {},
} = {} ) => (
	<div
		className={ `prad-text-field${
			inline ? ' prad-text-field-inline' : ''
		} ${ className }` }
		style={ style }
	>
		{ label && (
			<label htmlFor={ name } style={ inline ? { marginRight: 8 } : {} }>
				{ label }
			</label>
		) }
		<input
			type={ 'text' }
			id={ name }
			name={ name }
			value={ value }
			onChange={ ( e ) => onChange( e.target.value ) }
			placeholder={ placeholder }
			disabled={ disabled }
			className="prad-text-input"
		/>
	</div>
);

export default TextField;
