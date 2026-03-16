import { useState, useEffect, useRef } from 'react';

const { __ } = wp.i18n;

const HtmlEditor = ( { content, onChange } ) => {
	const [ htmlContent, setHtmlContent ] = useState( content || '' );
	const textareaRef = useRef();

	useEffect( () => {
		setHtmlContent( content || '' );
	}, [ content ] );

	const handleHtmlChange = ( event ) => {
		const newContent = event.target.value;
		setHtmlContent( newContent );
		if ( onChange ) {
			onChange( newContent );
		}
	};

	return (
		<div className="prad-html-editor-wrapper">
			<textarea
				name="html-editor"
				ref={ textareaRef }
				value={ htmlContent }
				onChange={ handleHtmlChange }
				className="prad-html-editor"
				placeholder={ __( 'Enter HTML code here…', 'product-addons' ) }
				spellCheck={ false }
			/>
		</div>
	);
};

export default HtmlEditor;
