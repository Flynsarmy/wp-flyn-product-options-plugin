import { useRef, useState } from 'react';
import Portal from '../../../../../../../../../components/portal/Portal';
const { __ } = wp.i18n;

const ListDropdown = ( { editor, disabled = false } ) => {
	const [ showDropdown, setShowDropdown ] = useState( false );
	const buttonRef = useRef();

	const handleSelect = ( cb ) => {
		if ( disabled ) {
			return;
		}
		cb();
		setShowDropdown( false );
	};

	const isAnyListActive =
		editor.isActive( 'bulletList' ) || editor.isActive( 'orderedList' );

	return (
		<div className="prad-dropdown prad-dropdown-relative">
			<button
				ref={ buttonRef }
				className={ `prad-menubar-btn ${
					isAnyListActive ? 'prad-ce-menu-active' : ''
				} ${ disabled ? 'disabled' : '' }` }
				type="button"
				title={ __( 'List Styles', 'product-addons' ) }
				onClick={ () => ! disabled && setShowDropdown( ( v ) => ! v ) }
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
							strokeLinejoin="round"
							d="M2 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM2 13a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM2 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
						/>
						<path
							stroke="#3A3E39"
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 3h8M6 8h8M6 13h8"
						/>
					</svg>
				</span>
			</button>
			<Portal
				isOpen={ showDropdown && ! disabled }
				anchorRef={ buttonRef }
				onClickOutside={ () => setShowDropdown( false ) }
			>
				<div
					className="prad-content-editor-dropdown prad-dropdown-list prad-dropdown-list-base"
					style={ {
						display: 'flex',
						// flexDirection: 'row',
						gap: '12px',
						padding: '12px',
						paddingTop: '16px',
						minWidth: '302px',
					} }
				>
					<div
						style={ {
							display: 'flex',
							gap: '12px',
						} }
					>
						{ /* Basic Lists Section */ }
						<div
							style={ {
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
							} }
						>
							<div className="prad-dropdown-list-heading">
								{ __( 'Basic Lists', 'product-addons' ) }
							</div>
							<button
								className={ `prad-dropdown-btn-left ${
									editor.isActive( 'bulletList' )
										? 'prad-ce-menu-active '
										: ''
								}` }
								onClick={ () =>
									handleSelect( () =>
										editor
											.chain()
											.focus()
											.toggleBulletList()
											.run()
									)
								}
								type="button"
							>
								<span className="prad-dropdown-btn-icon-margin prad-dropdown-btn-bold">
									•
								</span>
								{ __( 'Bullet List', 'product-addons' ) }
							</button>
							<button
								className={ `prad-dropdown-btn-left ${
									editor.isActive( 'orderedList' )
										? 'prad-ce-menu-active '
										: ''
								}` }
								onClick={ () =>
									handleSelect( () =>
										editor
											.chain()
											.focus()
											.toggleOrderedList()
											.run()
									)
								}
								type="button"
							>
								<span className="prad-dropdown-btn-icon-margin prad-dropdown-btn-bold">
									1.
								</span>
								{ __( 'Numbered List', 'product-addons' ) }
							</button>
						</div>

						{ /* Advanced List Actions */ }
						{ isAnyListActive && (
							<div
								style={ {
									display: 'flex',
									flexDirection: 'column',
									gap: '4px',
									borderLeft: '1px solid #D5DAD4',
									paddingLeft: '12px',
								} }
							>
								<div className="prad-dropdown-list-heading">
									{ __( 'List Actions', 'product-addons' ) }
								</div>
								<button
									className="prad-dropdown-btn-left"
									onClick={ () =>
										handleSelect( () => {
											editor
												.chain()
												.focus()
												.liftListItem( 'listItem' )
												.run();
										} )
									}
									type="button"
									disabled={
										! editor
											.can()
											.liftListItem( 'listItem' )
									}
								>
									<span className="prad-dropdown-btn-icon-margin">
										←
									</span>
									{ __(
										'Decrease Indent',
										'product-addons'
									) }
								</button>
								<button
									className="prad-dropdown-btn-left"
									onClick={ () =>
										handleSelect( () => {
											editor
												.chain()
												.focus()
												.sinkListItem( 'listItem' )
												.run();
										} )
									}
									type="button"
									disabled={
										! editor
											.can()
											.sinkListItem( 'listItem' )
									}
								>
									<span className="prad-dropdown-btn-icon-margin">
										→
									</span>
									{ __(
										'Increase Indent',
										'product-addons'
									) }
								</button>
								<button
									className="prad-dropdown-btn-left"
									onClick={ () =>
										handleSelect( () => {
											editor
												.chain()
												.focus()
												.splitListItem( 'listItem' )
												.run();
										} )
									}
									type="button"
									disabled={
										! editor
											.can()
											.splitListItem( 'listItem' )
									}
								>
									<span className="prad-dropdown-btn-icon-margin">
										⏎
									</span>
									{ __(
										'Split List Item',
										'product-addons'
									) }
								</button>
							</div>
						) }
					</div>
					{ isAnyListActive && (
						<button
							className="prad-dropdown-btn-left prad-dropdown-btn-secondary prad-w-fit prad-d-flex"
							style={ {
								background: '#E83629',
								color: '#FFFFFF',
							} }
							onClick={ () =>
								handleSelect( () => {
									if ( editor.isActive( 'bulletList' ) ) {
										editor
											.chain()
											.focus()
											.toggleBulletList()
											.run();
									} else if (
										editor.isActive( 'orderedList' )
									) {
										editor
											.chain()
											.focus()
											.toggleOrderedList()
											.run();
									}
								} )
							}
							type="button"
						>
							{ __( 'Remove List', 'product-addons' ) }
						</button>
					) }
				</div>
			</Portal>
		</div>
	);
};

export default ListDropdown;
