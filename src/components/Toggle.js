import { useRef } from 'react';
import Icons from '../utils/Icons';

const Toggle = ( props ) => {
	let {
		className,
		toggleClass,
		contentClass,
		label,
		isLabelHide,
		isLabelSide = true,
		labelClass,
		labelColor,
		toggleSize = 'lg',
		type = 'slider',
		name,
		isDisable,
		required,
		value,
		onChange,
		help,
		helpClass,
		isLock,
		tooltip,
		activeBackground,
		inputBackground,
		checkMarkBackground = '#a9a924',
		thumbColor,
	} = props;

	if ( ! name ) {
		name = `prad-${ type }-${ Date.now().toString() }`;
	}

	const trackRef = useRef( null );

	return (
		<div
			className={ `prad-${ type }-wrapper prad-${ type }-${ toggleSize } ${ className }` }
		>
			{ ! isLabelHide && ! isLabelSide && label && (
				<div
					className={ `prad-input-label 
                    ${ tooltip ? 'prad-d-flex prad-item-center' : '' } 
                    ${ labelColor && `prad-color-${ labelColor }` } 
                    ${ required && `prad-required` } 
                    ${ labelClass }` }
				>
					{ label }
					{ tooltip && (
						<div
							title={ tooltip }
							className="prad-rtl-tooltip-left"
						>
							{ Icons.help }
						</div>
					) }
				</div>
			) }
			<div className={ `prad-toggle-content ${ contentClass }` }>
				<div className="prad-d-flex prad-item-center prad-gap-8">
					<label
						htmlFor={ name }
						className={ `prad-label prad-toggle prad-${ type } ${
							value && value != 'no' && 'prad-active'
						} ${ toggleClass }` }
					>
						{ type == 'slider' ? (
							<div
								ref={ trackRef }
								className={ `prad-${ type }-track prad-relative` }
								style={ {
									backgroundColor:
										value && value != 'no'
											? activeBackground ||
											  inputBackground ||
											  '#86a62c'
											: inputBackground || '#80837f',
								} }
							>
								<input
									name={ name }
									id={ name }
									type="checkbox"
									checked={
										value && value != 'no' ? true : false
									}
									onChange={ onChange }
									className="prad-input prad-toggle-input"
									disabled={ isDisable ? true : false }
								/>
								<div
									className="prad-slider-thumb"
									style={ {
										backgroundColor:
											thumbColor || '#ffffff',
									} }
								/>
							</div>
						) : (
							<div>
								<input
									name={ name }
									id={ name }
									type="checkbox"
									checked={
										value && value != 'no' ? true : false
									}
									onChange={ onChange }
									className="prad-input prad-toggle-input"
									disabled={ isDisable ? true : false }
								/>
								<div
									className={ `prad-checkbox-mark prad-checkbox-${ toggleSize } ${
										value && value != 'no' && 'prad-active'
									}` }
									style={ {
										backgroundColor: checkMarkBackground
											? checkMarkBackground
											: '',
										borderColor: checkMarkBackground
											? checkMarkBackground
											: '',
									} }
								/>
							</div>
						) }
						{ ! isLabelHide && isLabelSide && label && (
							<div
								className={ `prad-input-label ${
									tooltip
										? 'prad-d-flex prad-item-center'
										: ''
								} ${
									labelColor && `prad-color-${ labelColor }`
								} ${ labelClass }` }
							>
								{ label }{ ' ' }
								{ required && (
									<div
										className="prad-required"
										style={ {
											color: requiredColor || '#fc143f',
										} }
									>
										*
									</div>
								) }
								{ tooltip && (
									<div
										title={ tooltip }
										className="prad-rtl-tooltip-left"
									>
										{ Icons.help }
									</div>
								) }
							</div>
						) }
					</label>
					{ isLock && ( ! value || 'no' === value ) && (
						<span className="prad-lh-0">{ Icons.lock }</span>
					) }
				</div>
				{ help && (
					<div
						className={ `prad-${ type }-help prad-help-message ${ helpClass }` }
					>
						{ help }
					</div>
				) }
			</div>
		</div>
	);
};

export default Toggle;
