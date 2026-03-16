import { useRef, useEffect } from 'react';
import { _setFieldData } from '../../../utils/Utils';

const Label = ( props ) => {
	const { settings, fieldData, setFieldData, position, editAble, noSpace } =
		props;
	const contentRef = useRef( null );

	useEffect( () => {
		if (
			contentRef.current &&
			contentRef.current.ownerDocument &&
			contentRef.current.ownerDocument.activeElement !==
				contentRef.current
		) {
			contentRef.current.innerText = settings.label;
		}
	}, [ settings ] );

	const handleInput = ( e ) => {
		_setFieldData(
			setFieldData,
			fieldData,
			settings,
			position,
			'label',
			e.target.textContent
		);
	};

	return (
		<div className="prad-relative prad-w-fit">
			<div
				ref={ contentRef }
				contentEditable={ editAble || false }
				className={ `${
					noSpace ? 'prad-mb-0' : 'prad-mb-12'
				} prad-block-title` }
				onInput={ handleInput }
			/>
			{ settings.required === true && (
				<div className="prad-block-required prad-absolute">*</div>
			) }
		</div>
	);
};

export default Label;
