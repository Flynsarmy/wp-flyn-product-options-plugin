import { useRef, useEffect, useCallback } from 'react';
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { _setFieldData } from '../../../utils/Utils';
import { useAddons } from '../../../context/AddonsContext';

const Heading = ( props ) => {
	const { settings, fieldData, setFieldData, position } = props;
	const contentRef = useRef( null );
	const { updateBlockById } = useAddons();
	const Tag = settings.tag || 'h2';

	useEffect( () => {
		if (
			contentRef.current &&
			contentRef.current.ownerDocument &&
			contentRef.current.ownerDocument.activeElement !==
				contentRef.current
		) {
			contentRef.current.innerText = settings.value;
		}
	}, [ settings ] );

	const handleInput = ( e ) => {
		_setFieldData(
			setFieldData,
			fieldData,
			settings,
			position,
			'value',
			e.target.textContent
		);
	};

	const handleMigrate = useCallback( () => {
		const previewContent = `<${ settings.tag }>${ settings.value }</${ settings.tag }>`;
		updateBlockById( settings.blockid, {
			type: 'content',
			previewContent: previewContent,
		} );
	}, [ updateBlockById, settings.blockid ] );

	useEffect( () => {
		handleMigrate();
	}, [ handleMigrate ] );

	return (
		<>
			<ToolBar disableTab={ true } { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-w-full ${ settings.class }` }
			>
				<Tag
					ref={ contentRef }
					contentEditable={ true }
					className="prad-block-heading prad-block-builder-heading prad-w-full"
					onInput={ handleInput }
				></Tag>
			</div>
		</>
	);
};

export default Heading;
