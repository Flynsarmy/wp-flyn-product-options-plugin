import { useState, useRef } from 'react';
import Portal from '../../../../../../../../../components/portal/Portal';
const { __ } = wp.i18n;

const HeadingDropdown = ( { editor, disabled = false } ) => {
	const [ showDropdown, setShowDropdown ] = useState( false );
	const buttonRef = useRef();

	const handleSelect = ( cb ) => {
		if ( disabled ) {
			return;
		}
		cb();
		setShowDropdown( false );
	};

	let activeFormat = '';
	if ( editor.isActive( 'paragraph' ) ) {
		activeFormat = 'P';
	} else if ( editor.isActive( 'div' ) ) {
		activeFormat = 'div';
	} else if ( editor.isActive( 'span' ) ) {
		activeFormat = 'span';
	} else if ( editor.isActive( 'heading', { level: 1 } ) ) {
		activeFormat = 'H1';
	} else if ( editor.isActive( 'heading', { level: 2 } ) ) {
		activeFormat = 'H2';
	} else if ( editor.isActive( 'heading', { level: 3 } ) ) {
		activeFormat = 'H3';
	}

	return (
		<div className="prad-dropdown prad-dropdown-relative">
			<button
				ref={ buttonRef }
				className={ `prad-menubar-btn  ${
					activeFormat ? 'prad-ce-menu-active' : ''
				} ${ disabled ? 'disabled' : '' }` }
				type="button"
				title={ __( 'Text Format & Headings', 'product-addons' ) }
				onClick={ () => ! disabled && setShowDropdown( ( v ) => ! v ) }
				disabled={ disabled }
			>
				{ activeFormat || 'P' }
			</button>
			<Portal
				isOpen={ showDropdown && ! disabled }
				anchorRef={ buttonRef }
				onClickOutside={ () => setShowDropdown( false ) }
			>
				<div className="prad-content-editor-dropdown  prad-dropdown-list prad-scrollbar prad-dropdown-list-base prad-dropdown-min-height-200">
					<button
						className={
							editor.isActive( 'paragraph' )
								? 'prad-ce-menu-active '
								: ''
						}
						onClick={ () =>
							handleSelect( () => {
								if ( editor.isActive( 'paragraph' ) ) {
									// If already paragraph, toggle to plain text (clear paragraph format)
									const textOnly = editor.getText();
									editor
										.chain()
										.focus()
										.selectAll()
										.deleteSelection()
										.insertContent( textOnly )
										.run();
								} else {
									// If not paragraph, convert to paragraph
									editor.chain().focus().setParagraph().run();
								}
							} )
						}
						type="button"
					>
						P
					</button>
					<button
						className={
							editor.isActive( 'heading', { level: 1 } )
								? 'prad-ce-menu-active '
								: ''
						}
						onClick={ () =>
							handleSelect( () =>
								editor
									.chain()
									.focus()
									.toggleHeading( { level: 1 } )
									.run()
							)
						}
						type="button"
					>
						H1
					</button>
					<button
						className={
							editor.isActive( 'heading', { level: 2 } )
								? 'prad-ce-menu-active '
								: ''
						}
						onClick={ () =>
							handleSelect( () =>
								editor
									.chain()
									.focus()
									.toggleHeading( { level: 2 } )
									.run()
							)
						}
						type="button"
					>
						H2
					</button>
					<button
						className={
							editor.isActive( 'heading', { level: 3 } )
								? 'prad-ce-menu-active '
								: ''
						}
						onClick={ () =>
							handleSelect( () =>
								editor
									.chain()
									.focus()
									.toggleHeading( { level: 3 } )
									.run()
							)
						}
						type="button"
					>
						H3
					</button>
					<button
						className={
							editor.isActive( 'div' )
								? 'prad-ce-menu-active '
								: ''
						}
						onClick={ () =>
							handleSelect( () =>
								editor.chain().focus().setDiv().run()
							)
						}
						type="button"
					>
						div
					</button>
					<button
						className={
							editor.isActive( 'span' )
								? 'prad-ce-menu-active '
								: ''
						}
						onClick={ () =>
							handleSelect( () =>
								editor.chain().focus().setSpan().run()
							)
						}
						type="button"
					>
						span
					</button>
				</div>
			</Portal>
		</div>
	);
};

export default HeadingDropdown;
