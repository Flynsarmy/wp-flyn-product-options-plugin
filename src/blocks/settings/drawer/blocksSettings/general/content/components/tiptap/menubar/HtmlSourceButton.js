const { __ } = wp.i18n;

const HtmlSourceButton = ( { isHtmlMode, onHtmlToggle } ) => (
	<div className="prad-content-edit-menu-group mode-toggle">
		<button
			className={ `prad-menubar-btn  ${
				isHtmlMode ? 'prad-ce-menu-active ' : ''
			}` }
			onClick={ onHtmlToggle }
			title={ __( 'HTML Source', 'product-addons' ) }
			type="button"
		>
			&lt;HTML&gt;
		</button>
	</div>
);

export default HtmlSourceButton;
