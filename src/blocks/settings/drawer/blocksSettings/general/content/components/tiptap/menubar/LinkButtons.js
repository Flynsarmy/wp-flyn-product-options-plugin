import { useRef, useState } from 'react';
import Portal from '../../../../../../../../../components/portal/Portal';
const { __ } = wp.i18n;

const LinkButtons = ( { editor, disabled = false } ) => {
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [ linkUrl, setLinkUrl ] = useState( '' );
	const buttonRef = useRef();

	// Check if link is active and selection is valid for link operations
	const isValidLinkSelection = () => {
		const { selection } = editor.state;
		const { from, to, empty } = selection;

		// Allow if cursor is inside a link (empty selection)
		if ( empty && editor.isActive( 'link' ) ) {
			return true;
		}

		// For non-empty selections, check if entire range has the same link
		if ( ! empty ) {
			const linkMark = editor.schema.marks.link;
			const { doc } = editor.state;

			// Get all marks in the selection
			let hasLink = false;
			let linkHref = null;

			doc.nodesBetween( from, to, ( node ) => {
				if ( node.isText ) {
					const marks = node.marks.filter(
						( mark ) => mark.type === linkMark
					);
					if ( marks.length > 0 ) {
						const currentHref = marks[ 0 ].attrs.href;
						if ( linkHref === null ) {
							linkHref = currentHref;
							hasLink = true;
						} else if ( linkHref !== currentHref ) {
							// Different links in selection
							hasLink = false;
							return false;
						}
					} else if ( hasLink ) {
						// Part of selection has no link
						hasLink = false;
						return false;
					}
				}
			} );

			return hasLink;
		}

		return false;
	};

	const isLinkActive = isValidLinkSelection();

	// Get current link URL if a link is active
	const getCurrentLinkUrl = () => {
		if ( isLinkActive ) {
			const attrs = editor.getAttributes( 'link' );
			return attrs.href || '';
		}
		return '';
	};

	// Handle dropdown toggle and populate with current link
	const handleToggleDropdown = () => {
		if ( disabled ) {
			return;
		}

		if ( ! showDropdown ) {
			// Opening dropdown - populate with current link if exists
			const currentUrl = getCurrentLinkUrl();
			setLinkUrl( currentUrl );
		}
		setShowDropdown( ( v ) => ! v );
	};

	return (
		<div className="prad-content-edit-menu-group">
			<div className="prad-dropdown">
				<button
					ref={ buttonRef }
					className={ `prad-menubar-btn ${
						isLinkActive ? 'prad-ce-menu-active ' : ''
					} ${ disabled ? 'disabled' : '' }` }
					type="button"
					onClick={ handleToggleDropdown }
					title={ __( 'Insert Link', 'product-addons' ) }
					disabled={ disabled }
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
								strokeLinecap="round"
								d="m9.34 11.35-1.68 1.68a3.32 3.32 0 0 1-4.69-4.7l1.68-1.67m2-2.01 1.69-1.68a3.32 3.32 0 0 1 4.69 4.7l-1.68 1.67M6.33 9.67l3.34-3.34"
							/>
						</svg>
					</span>
				</button>
				<Portal
					isOpen={ showDropdown && ! disabled }
					anchorRef={ buttonRef }
					onClickOutside={ () => setShowDropdown( false ) }
				>
					<div className="prad-content-editor-dropdown prad-dropdown-list prad-dropdown-list-base prad-dropdown-min-width-300">
						<input
							type="url"
							className="wow-link-input prad-dropdown-input-full"
							placeholder={ __( 'Enter URL…', 'product-addons' ) }
							value={ linkUrl }
							onChange={ ( e ) => setLinkUrl( e.target.value ) }
						/>
						<div
							style={ {
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginTop: '4px',
							} }
						>
							<div className="prad-dropdown-flex-gap">
								<button
									className=" primary"
									type="button"
									disabled={ ! linkUrl.trim() }
									onClick={ () => {
										editor
											.chain()
											.focus()
											.setLink( { href: linkUrl } )
											.run();
										setShowDropdown( false );
										setLinkUrl( '' );
									} }
									style={ {
										backgroundColor:
											'var(--prad-color-primary)',
										color: 'var(--prad-color-text-reverse)',
										border: 'none',
										borderRadius: '4px',
										cursor: 'pointer',
										fontSize: '14px',
										fontWeight: '500',
										padding: '8px 20px',
									} }
								>
									{ __( 'Apply', 'product-addons' ) }
								</button>
								<button
									className=""
									type="button"
									onClick={ () => {
										setShowDropdown( false );
										setLinkUrl( '' );
									} }
								>
									{ __( 'Cancel', 'product-addons' ) }
								</button>
							</div>
							{ isLinkActive && ! disabled && (
								<button
									className="prad-ce-menu-active "
									onClick={ () => {
										editor
											.chain()
											.focus()
											.unsetLink()
											.run();
										setShowDropdown( false );
										setLinkUrl( '' );
									} }
									title={ __(
										'Remove Link',
										'product-addons'
									) }
									type="button"
									style={ {
										backgroundColor:
											'var(--prad-color-required)',
										color: 'var(--prad-color-text-reverse)',
										border: 'none',
										borderRadius: '4px',
										cursor: 'pointer',
										fontSize: '14px',
										fontWeight: '500',
										padding: '8px 16px',
									} }
								>
									{ /* <span className="wow-icon">
										{ icons.cross }
									</span> */ }
									{ __( 'Remove', 'product-addons' ) }
								</button>
							) }
						</div>
					</div>
				</Portal>
			</div>
		</div>
	);
};

export default LinkButtons;
