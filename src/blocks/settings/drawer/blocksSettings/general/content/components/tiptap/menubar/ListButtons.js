const { __ } = wp.i18n;

const ListButtons = ( { editor } ) => (
	<>
		<button
			className={
				editor.isActive( 'bulletList' ) ? 'prad-ce-menu-active ' : ''
			}
			onClick={ () => editor.chain().focus().toggleBulletList().run() }
			title={ __( 'Bullet List', 'product-addons' ) }
			type="button"
		>
			• List
		</button>
		<button
			className={
				editor.isActive( 'orderedList' ) ? 'prad-ce-menu-active ' : ''
			}
			onClick={ () => editor.chain().focus().toggleOrderedList().run() }
			title={ __( 'Numbered List', 'product-addons' ) }
			type="button"
		>
			1. List
		</button>
	</>
);

export default ListButtons;
