import FormattingButtons from '../menubar/FormattingButtons';
import HeadingDropdown from '../menubar/HeadingDropdown';
import HighlightDropdown from '../menubar/HighlightDropdown';
import HtmlSourceButton from '../menubar/HtmlSourceButton';
import ImageUploadPanel from '../menubar/ImageUploadPanel';
import LinkButtons from '../menubar/LinkButtons';
import ListDropdown from '../menubar/ListDropdown';
import TableDropdown from '../menubar/TableDropdown';
import UndoRedo from '../menubar/UndoRedo';

const MenuBar = ( { editor, onHtmlToggle, isHtmlMode } ) => {
	if ( ! editor ) {
		return null;
	}

	// Check if an image is currently selected
	const isImageSelected = editor.isActive( 'image' );
	const isInTable = editor.isActive( 'table' );

	return (
		<div className="prad-content-edit-menubar">
			<div
				className={ `prad-content-edit-menubar-groups ${
					isHtmlMode ? 'prad-disable' : ''
				}` }
			>
				<UndoRedo editor={ editor } />

				<div className="prad-content-edit-menu-group">
					<HighlightDropdown
						editor={ editor }
						disabled={ isImageSelected || isInTable }
					/>
					<FormattingButtons
						editor={ editor }
						disabled={ isImageSelected }
					/>
				</div>

				<div className="prad-content-edit-menu-group">
					<HeadingDropdown
						editor={ editor }
						disabled={ isImageSelected || isInTable }
					/>
				</div>

				<div className="prad-content-edit-menu-group">
					<ListDropdown
						editor={ editor }
						disabled={ isImageSelected || isInTable }
					/>
				</div>

				<LinkButtons editor={ editor } disabled={ isImageSelected } />

				<TableDropdown editor={ editor } disabled={ isImageSelected } />

				<ImageUploadPanel editor={ editor } />
			</div>

			<HtmlSourceButton
				onHtmlToggle={ onHtmlToggle }
				isHtmlMode={ isHtmlMode }
			/>
		</div>
	);
};

export default MenuBar;
