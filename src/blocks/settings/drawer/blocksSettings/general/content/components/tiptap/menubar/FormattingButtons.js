const FormattingButtons = ( { editor, disabled = false } ) => (
	<>
		<button
			className={ `prad-menubar-btn ${
				editor.isActive( 'bold' ) ? 'prad-ce-menu-active ' : ''
			} ${ disabled ? 'disabled' : '' }` }
			onClick={ () =>
				! disabled && editor.chain().focus().toggleBold().run()
			}
			title="Bold"
			type="button"
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
						strokeLinejoin="round"
						d="M4 2.67h5.33a2.67 2.67 0 1 1 0 5.33H4V2.67Z"
					/>
					<path
						stroke="#3A3E39"
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M4 8h6a2.67 2.67 0 0 1 0 5.33H4V8Z"
					/>
				</svg>
			</span>
		</button>
		<button
			className={ `prad-menubar-btn ${
				editor.isActive( 'italic' ) ? 'prad-ce-menu-active ' : ''
			} ${ disabled ? 'disabled' : '' }` }
			onClick={ () =>
				! disabled && editor.chain().focus().toggleItalic().run()
			}
			title="Italic"
			type="button"
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
						strokeLinejoin="round"
						d="M12.67 2.67h-6m2.66 10.66h-6M9.8 3.13l-3.67 9.8"
					/>
				</svg>
			</span>
		</button>
		<button
			className={ `prad-menubar-btn  ${
				editor.isActive( 'underline' ) ? 'prad-ce-menu-active ' : ''
			} ${ disabled ? 'disabled' : '' }` }
			onClick={ () =>
				! disabled && editor.chain().focus().toggleUnderline().run()
			}
			title="Underline"
			type="button"
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
						strokeLinejoin="round"
						d="M4 2v4.67a4 4 0 0 0 8 0V2M2.67 14h10.66"
					/>
				</svg>
			</span>
		</button>
	</>
);

export default FormattingButtons;
