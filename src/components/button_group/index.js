import './styles.scss';

const ButtonGroup = ( props ) => {
	const { options, value, onChange, title, inlineView, classes } = props;

	return (
		<div
			className={ `prad-btn-group-field ${
				inlineView ? '_inline' : ''
			} ${ classes || 'prad-w-full' }` }
		>
			{ title && <div className="prad-field-title">{ title }</div> }
			<div className="prad-btn-group-field-wrapper">
				{ options.map( ( option ) => (
					<div
						key={ option.value }
						type="button"
						onClick={ () => onChange( option.value ) }
						className={ `prad-btn-group-option ${
							value === option.value ? '_active' : ''
						}` }
					>
						{ option.label }
					</div>
				) ) }
			</div>
		</div>
	);
};

export default ButtonGroup;
