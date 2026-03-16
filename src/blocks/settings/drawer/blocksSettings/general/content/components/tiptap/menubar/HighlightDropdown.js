import { useState, useRef } from 'react';
import Portal from '../../../../../../../../../components/portal/Portal';
const { __ } = wp.i18n;

const HighlightDropdown = ( { editor, disabled = false } ) => {
	const [ showDropdown, setShowDropdown ] = useState( false );
	const buttonRef = useRef();

	// Highlight color options
	const highlightColors = [
		{ name: 'Yellow', color: '#fff700' },
		{ name: 'Red', color: '#ff3b3b' },
		{ name: 'Green', color: '#3bff6a' },
		{ name: 'Blue', color: '#3bb7ff' },
		{ name: 'Purple', color: '#b83bff' },
		{ name: 'Orange', color: '#ff8c3b' },
	];

	// Get current highlight color if any
	const getCurrentHighlightColor = () => {
		const { selection } = editor.state;
		const { from, to } = selection;

		// Check if any highlight mark exists in selection
		const marks = editor.state.doc.rangeHasMark(
			from,
			to,
			editor.schema.marks.highlight
		);
		if ( marks || editor.isActive( 'highlight' ) ) {
			// Get the highlight mark attributes
			const highlightMark = editor.getAttributes( 'highlight' );
			return highlightMark.color || '#fff700';
		}
		return null;
	};

	const currentColor = getCurrentHighlightColor();
	const isHighlighted = editor.isActive( 'highlight' );

	const handleHighlight = ( color ) => {
		if ( disabled ) {
			return;
		}
		// If clicking the same color that's already applied, remove highlight
		if ( currentColor === color ) {
			editor.chain().focus().unsetHighlight().run();
		} else {
			editor.chain().focus().setHighlight( { color } ).run();
		}
		setShowDropdown( false );
	};

	const handleRemoveHighlight = () => {
		if ( disabled ) {
			return;
		}
		editor.chain().focus().unsetHighlight().run();
		setShowDropdown( false );
	};

	return (
		<div className="prad-dropdown">
			<button
				className={ `prad-menubar-btn  ${
					isHighlighted ? 'prad-ce-menu-active' : ''
				} ${ disabled ? 'disabled' : '' }` }
				type="button"
				onClick={ () => ! disabled && setShowDropdown( ( v ) => ! v ) }
				title={ __( 'Highlight', 'product-addons' ) }
				disabled={ disabled }
			>
				<span
					className="wow-icon prad-highlight-icon"
					style={ { '--highlight-color': currentColor || '#fff700' } }
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 16 16"
						height={ 16 }
						width={ 16 }
					>
						<path fill="currentColor" d="M0 14h16v2H0z" />
						<path
							stroke="#3A3E39"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth=".92"
							d="m5.76 4.17.6-.6 4.22 4.21-.6.6c-.33.34-.78.53-1.25.53H8.4c-.47 0-.92.2-1.26.53l-.4.4a.6.6 0 0 1-.85 0l-1.6-1.6a.6.6 0 0 1 0-.83L4.71 7c.33-.34.52-.79.53-1.26v-.32c0-.47.19-.92.52-1.25Z"
						/>
						<path
							stroke="#3A3E39"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth=".92"
							d="M8.48.61 6.37 2.72a.6.6 0 0 0 0 .84l4.21 4.22a.6.6 0 0 0 .85 0l2.1-2.1M2.79 10.52l1.9-1.9 1.05 1.06-1.62 1.61-1.33-.77Z"
						/>
					</svg>
				</span>
			</button>
			<div ref={ buttonRef } style={ { height: '1px' } }></div>
			<Portal
				isOpen={ showDropdown && ! disabled }
				anchorRef={ buttonRef }
				onClickOutside={ () => setShowDropdown( false ) }
			>
				<div className="prad-dropdown-list prad-menu-highlight-dropdown prad-dropdown-list-base prad-dropdown-min-width-120">
					{ isHighlighted && (
						<button
							className=""
							type="button"
							onClick={ handleRemoveHighlight }
						>
							<span className="wow-icon prad-highlight-remove-span prad-cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 32 32"
									height={ 20 }
									width={ 20 }
								>
									<circle
										cx="16"
										cy="16"
										r="13.33"
										stroke="#575E55"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
									/>
									<path
										stroke="#575E55"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6.67 25.33 25.33 6.67"
									/>
								</svg>
							</span>
						</button>
					) }

					{ highlightColors.map( ( opt ) => (
						<button
							className={ `${
								currentColor === opt.color
									? 'prad-highlight-color-active'
									: ''
							}` }
							key={ opt.color }
							type="button"
							onClick={ () => handleHighlight( opt.color ) }
						>
							<span
								className="prad-highlight-color-span"
								style={ {
									backgroundColor: opt.color,
								} }
							></span>
						</button>
					) ) }
				</div>
			</Portal>
		</div>
	);
};

export default HighlightDropdown;
