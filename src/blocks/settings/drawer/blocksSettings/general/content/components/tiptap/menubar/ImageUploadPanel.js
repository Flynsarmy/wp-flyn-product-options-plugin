import { useCallback, useEffect, useRef, useState } from 'react';
import Portal from '../../../../../../../../../components/portal/Portal';
import icons from '../../../../../../../../../utils/Icons';

const { __ } = wp.i18n;

// Constants
const IMAGE_NODE_TYPE = 'image';

// Styles
const PANEL_STYLES = {
	background: '#fff',
	border: '1px solid #ddd',
	borderRadius: 6,
	boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
	padding: '16px',
	minWidth: 320,
};

const ICON_STYLES = { marginRight: 4 };

const FORM_FIELD_STYLES = { width: '100%' };

const HELP_TEXT_STYLES = {
	fontSize: '12px',
	color: '#666',
	marginTop: '4px',
};

const DIVIDER_STYLES = {
	fontSize: '12px',
	color: '#666',
	textAlign: 'center',
	marginBottom: '8px',
};

const ACTIONS_STYLES = {
	display: 'flex',
	gap: '8px',
	justifyContent: 'flex-end',
};

const ImageUploadPanel = ( { editor } ) => {
	const [ showPanel, setShowPanel ] = useState( false );
	const [ imageUrl, setImageUrl ] = useState( '' );
	const [ imageWidth, setImageWidth ] = useState( '' );
	const [ altText, setAltText ] = useState( '' );
	const [ isEditing, setIsEditing ] = useState( false );
	const [ selectedImageNode, setSelectedImageNode ] = useState( null );
	const buttonRef = useRef();

	// Helper function to find selected image node
	const findSelectedImageNode = useCallback( ( selection ) => {
		// Check if we have a node selection (when clicking on an image)
		if ( selection.node?.type.name === IMAGE_NODE_TYPE ) {
			return selection.node;
		}

		// Check if cursor is inside or adjacent to an image node
		const { $from } = selection;

		const candidates = [ $from.nodeBefore, $from.nodeAfter, $from.parent ];

		return (
			candidates.find(
				( node ) => node?.type.name === IMAGE_NODE_TYPE
			) || null
		);
	}, [] );

	// Helper function to populate form from image node
	const populateFormFromNode = useCallback( ( imageNode ) => {
		setSelectedImageNode( imageNode );
		setImageUrl( imageNode.attrs.src || '' );
		setImageWidth( imageNode.attrs.width || '' );
		setAltText( imageNode.attrs.alt || '' );
		setIsEditing( true );
	}, [] );

	// Helper function to reset form state
	const resetForm = useCallback( () => {
		setImageUrl( '' );
		setImageWidth( '' );
		setAltText( '' );
		setShowPanel( false );
		setIsEditing( false );
		setSelectedImageNode( null );
	}, [] );

	// Check if an image is currently selected in the editor
	useEffect( () => {
		if ( ! editor ) {
			return;
		}

		const updateImageSelection = () => {
			const { selection } = editor.state;
			const imageNode = findSelectedImageNode( selection );

			if ( imageNode ) {
				populateFormFromNode( imageNode );
			} else {
				setSelectedImageNode( null );
				// Only reset form fields if panel is not currently showing
				if ( ! showPanel ) {
					setImageUrl( '' );
					setImageWidth( '' );
					setAltText( '' );
				}
				setIsEditing( false );
			}
		};

		editor.on( 'selectionUpdate', updateImageSelection );
		return () => editor.off( 'selectionUpdate', updateImageSelection );
	}, [ editor, showPanel, findSelectedImageNode, populateFormFromNode ] );

	// WordPress Media Library upload handler
	const handleWpMediaUpload = useCallback( () => {
		if ( ! wp?.media ) {
			return;
		}

		const mediaFrame = wp.media( {
			title: __( 'Add Image', 'product-addons' ),
			button: { text: __( 'Add Image', 'product-addons' ) },
			multiple: false,
			library: { type: 'image' },
		} );

		mediaFrame.on( 'select', () => {
			const attachment = mediaFrame
				.state()
				.get( 'selection' )
				.first()
				.toJSON();

			const imageAttrs = {
				src: attachment.url,
				alt: attachment.alt || attachment.title || '',
			};

			if ( attachment.width ) {
				imageAttrs.width = `${ attachment.width }px`;
			}

			// Insert image directly into editor and reset
			editor.chain().focus().setImage( imageAttrs ).run();
			resetForm();
		} );

		mediaFrame.open();
		setShowPanel( false );
	}, [ editor, __, resetForm ] );

	const handleImageInsert = () => {
		if ( ! imageUrl.trim() ) {
			return;
		}

		// Check if cursor is inside a table cell
		const { selection } = editor.state;
		const { $from } = selection;

		// Walk up the node hierarchy to check if we're inside a table cell
		let node = $from.parent;
		let depth = $from.depth;

		while ( depth > 0 ) {
			if (
				node.type.name === 'tableCell' ||
				node.type.name === 'tableHeader'
			) {
				// Silently prevent image insertion inside table cells
				return;
			}
			depth--;
			node = $from.node( depth );
		}

		const attrs = {
			src: imageUrl,
			alt: altText || '',
		};

		if ( imageWidth ) {
			attrs.width = imageWidth;
		}

		if ( isEditing && selectedImageNode ) {
			// Update existing image
			const pos = selection.$from.pos;
			editor.view.dispatch(
				editor.view.state.tr.setNodeMarkup( pos, undefined, attrs )
			);
		} else {
			// Insert new image
			editor.chain().focus().setImage( attrs ).run();
		}

		// Reset form
		resetForm();
	};

	// Check if cursor is inside a table cell
	const isInsideTableCell = useCallback( () => {
		if ( ! editor ) {
			return false;
		}
		const { selection } = editor.state;
		const { $from } = selection;

		let node = $from.parent;
		let depth = $from.depth;

		while ( depth > 0 ) {
			if (
				node.type.name === 'tableCell' ||
				node.type.name === 'tableHeader'
			) {
				return true;
			}
			depth--;
			node = $from.node( depth );
		}
		return false;
	}, [ editor ] );

	// Check if image is currently selected for active state
	const isImageSelected = editor?.isActive( IMAGE_NODE_TYPE ) || isEditing;
	const insideTableCell = isInsideTableCell();

	// Handle button click to toggle panel
	const handleButtonClick = useCallback( () => {
		// When opening panel, ensure image selection state is up to date
		if ( ! showPanel && editor?.isActive( IMAGE_NODE_TYPE ) ) {
			const { selection } = editor.state;
			const imageNode = findSelectedImageNode( selection );
			if ( imageNode ) {
				populateFormFromNode( imageNode );
			}
		}
		setShowPanel( ! showPanel );
	}, [ showPanel, editor, findSelectedImageNode, populateFormFromNode ] );

	return (
		<div className="prad-content-edit-menu-group">
			<button
				ref={ buttonRef }
				className={ `prad-menubar-btn ${
					isImageSelected ? 'prad-ce-menu-active ' : ''
				}` }
				type="button"
				disabled={ insideTableCell && ! isImageSelected }
				title={
					insideTableCell && ! isImageSelected
						? __(
								'Images cannot be inserted inside table cells',
								'product-addons'
						  )
						: isImageSelected
						? __( 'Edit Image', 'product-addons' )
						: __( 'Upload Image', 'product-addons' )
				}
				onClick={ handleButtonClick }
			>
				<span className="wow-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 16 16"
						height={ 16 }
						width={ 16 }
					>
						<path
							stroke="#3A3E39"
							d="M1.33 4c0-.74.6-1.33 1.34-1.33h10.66c.74 0 1.34.6 1.34 1.33v8c0 .74-.6 1.33-1.34 1.33H2.67c-.74 0-1.34-.6-1.34-1.33V4Z"
						/>
						<path
							stroke="#3A3E39"
							strokeLinecap="round"
							d="M1.33 11.33 4.4 8.28a1.33 1.33 0 0 1 1.88 0l1.79 1.78c.52.52 1.36.52 1.88 0l.45-.45a1.33 1.33 0 0 1 1.88 0l2.4 2.4"
						/>
						<path
							stroke="#3A3E39"
							d="M12.33 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
						/>
					</svg>
				</span>
			</button>

			<Portal
				isOpen={ showPanel }
				anchorRef={ buttonRef }
				onClickOutside={ resetForm }
			>
				<div
					className="prad-content-editor-dropdown image-upload-panel wow-image-upload-panel"
					style={ PANEL_STYLES }
				>
					<div>
						<h4
							style={ { margin: '0 0 8px 0', fontSize: '14px' } }
							className="prad-dropdown-list-heading"
						>
							{ isEditing
								? __( 'Edit Image', 'product-addons' )
								: __( 'Upload Image', 'product-addons' ) }
						</h4>
					</div>

					{ /* WordPress Media Uploader */ }
					{ ! isEditing && (
						<div>
							<button
								className=" primary"
								type="button"
								onClick={ handleWpMediaUpload }
								style={ {
									width: '100%',
									marginBottom: '8px',
									background: '#f3f5f3',
									textAlign: 'center',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								} }
							>
								<span className="prad-dropdown-btn-icon-margin prad-d-flex prad-align-center">
									{ icons.upload }
								</span>
								{ __( 'Media Library', 'product-addons' ) }
							</button>
							<div style={ DIVIDER_STYLES }>
								{ __( 'or', 'product-addons' ) }
							</div>
						</div>
					) }

					{ /* URL Input */ }
					<div>
						<input
							type="url"
							placeholder={ __(
								'Enter image URL…',
								'product-addons'
							) }
							value={ imageUrl }
							onChange={ ( e ) => setImageUrl( e.target.value ) }
							style={ {
								...FORM_FIELD_STYLES,
								marginBottom: '8px',
							} }
						/>
					</div>

					{ /* Alt Text */ }
					<div style={ { marginBottom: '12px' } }>
						<input
							type="text"
							placeholder={ __(
								'Alt text (optional)',
								'product-addons'
							) }
							value={ altText }
							onChange={ ( e ) => setAltText( e.target.value ) }
							style={ FORM_FIELD_STYLES }
						/>
					</div>

					{ /* Width only - height is auto */ }
					<div style={ { marginBottom: '16px' } }>
						<input
							type="text"
							placeholder={ __(
								'Width - optional',
								'product-addons'
							) }
							value={ imageWidth }
							onChange={ ( e ) =>
								setImageWidth( e.target.value )
							}
							style={ FORM_FIELD_STYLES }
							min="1"
						/>
						<div style={ HELP_TEXT_STYLES }>
							{ __(
								'Height will be automatically adjusted',
								'product-addons'
							) }
						</div>
					</div>

					{ /* Actions */ }
					<div style={ ACTIONS_STYLES }>
						<button
							className=""
							type="button"
							onClick={ resetForm }
						>
							{ __( 'Cancel', 'product-addons' ) }
						</button>
						<button
							className="primary"
							type="button"
							onClick={ handleImageInsert }
							disabled={ ! imageUrl.trim() || false }
							style={ {
								backgroundColor: 'var(--prad-color-primary)',
								color: 'var(--prad-color-text-reverse)',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '14px',
								fontWeight: '500',
								padding: '8px 16px',
							} }
						>
							{ isEditing
								? __( 'Update', 'product-addons' )
								: __( 'Upload', 'product-addons' ) }
						</button>
					</div>
				</div>
			</Portal>
		</div>
	);
};

export default ImageUploadPanel;
