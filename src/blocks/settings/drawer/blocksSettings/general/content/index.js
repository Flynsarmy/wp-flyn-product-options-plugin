import { FieldTitle } from '../common_compo/generalCommon';
import TiptapEditor from './components/tiptap/editor/TiptapEditor';

const { __ } = wp.i18n;

const ContentSettings = ( props ) => {
	const { type, settings, toolbarSetData } = props;
	const attrKey = type === 'content' ? 'previewContent' : 'popupContent';

	const handleContentChange = ( html ) => {
		toolbarSetData( attrKey, html );
	};

	return (
		<div className="prad-content-settings">
			{ type === 'popup' && (
				<div className="prad-mb-20">
					<FieldTitle
						classes="prad-w-full"
						onChange={ ( _val ) => toolbarSetData( 'label', _val ) }
						value={ settings.label }
					/>
				</div>
			) }
			<div className="prad-mb-16">
				<div className="prad-field-title">
					{ type === 'content'
						? __( 'Content Editor', 'product-addons' )
						: __( 'Popup Content Editor', 'product-addons' ) }
				</div>
			</div>
			<TiptapEditor
				key={ type + settings.blockid }
				content={ settings[ attrKey ] }
				onChange={ handleContentChange }
			/>
		</div>
	);
};

export default ContentSettings;
