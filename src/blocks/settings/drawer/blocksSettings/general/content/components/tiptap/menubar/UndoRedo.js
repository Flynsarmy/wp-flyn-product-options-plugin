const { __ } = wp.i18n;

const UndoRedo = ( { editor } ) => {
	const canUndo = editor.can().undo();
	const canRedo = editor.can().redo();

	return (
		<div className="prad-content-edit-menu-group">
			<button
				className={ `prad-menubar-btn ${ canUndo ? '' : 'disabled' }` }
				onClick={ () => canUndo && editor.chain().focus().undo().run() }
				title={ __( 'Undo (Ctrl+Z)', 'product-addons' ) }
				type="button"
				disabled={ ! canUndo }
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
							d="M14.67 12v-2c0-1.47-1.2-2.67-2.67-2.67H1.33m0 0L4.67 4M1.33 7.33l3.34 3.34"
						/>
					</svg>
				</span>
			</button>
			<button
				className={ `prad-menubar-btn ${ canRedo ? '' : 'disabled' }` }
				onClick={ () => canRedo && editor.chain().focus().redo().run() }
				title={ __( 'Redo (Ctrl+Y)', 'product-addons' ) }
				type="button"
				disabled={ ! canRedo }
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
							d="M1.33 12v-2c0-1.47 1.2-2.67 2.67-2.67h10.67m0 0L11.33 4m3.34 3.33-3.34 3.34"
						/>
					</svg>
				</span>
			</button>
		</div>
	);
};

export default UndoRedo;
