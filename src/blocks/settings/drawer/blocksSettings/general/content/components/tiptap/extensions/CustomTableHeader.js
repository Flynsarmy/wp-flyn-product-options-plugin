import { TableHeader } from '@tiptap/extension-table-header';

const CustomTableHeader = TableHeader.extend( {
	name: 'tableHeader',
	content: '(text | hardBreak)*',
	isolating: true,

	addAttributes() {
		return {
			...this.parent?.(),
			colspan: {
				default: 1,
			},
			rowspan: {
				default: 1,
			},
			colwidth: {
				default: null,
				parseHTML: ( element ) => {
					const colwidth = element.getAttribute( 'colwidth' );
					const value = colwidth
						? [ parseInt( colwidth, 10 ) ]
						: null;
					return value;
				},
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'th',
				preserveWhitespace: 'full',
			},
		];
	},

	renderHTML( { HTMLAttributes } ) {
		return [ 'th', HTMLAttributes, 0 ];
	},

	addCommands() {
		return {
			...this.parent?.(),
		};
	},

	addKeyboardShortcuts() {
		return {
			Enter: () => {
				if ( ! this.editor.isActive( 'tableHeader' ) ) {
					return false;
				}
				if ( this.editor.can().setHardBreak() ) {
					return this.editor.chain().focus().setHardBreak().run();
				}
				return this.editor.commands.insertContent( '<br>' );
			},
			Tab: () => {
				// Only apply table navigation if we're actually in a table header
				if ( ! this.editor.isActive( 'tableHeader' ) ) {
					return false;
				}

				if ( this.editor.commands.goToNextCell() ) {
					return true;
				}

				if ( this.editor.commands.addRowAfter() ) {
					return this.editor.commands.goToNextCell();
				}

				return false;
			},
			'Shift-Tab': () => {
				// Only apply table navigation if we're actually in a table header
				if ( ! this.editor.isActive( 'tableHeader' ) ) {
					return false;
				}
				return this.editor.commands.goToPreviousCell();
			},
			ArrowRight: () => {
				// Disable right arrow key inside table headers
				if ( this.editor.isActive( 'tableHeader' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
			ArrowLeft: () => {
				// Disable left arrow key inside table headers
				if ( this.editor.isActive( 'tableHeader' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
			ArrowUp: () => {
				// Disable up arrow key inside table headers
				if ( this.editor.isActive( 'tableHeader' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
			ArrowDown: () => {
				// Disable down arrow key inside table headers
				if ( this.editor.isActive( 'tableHeader' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
		};
	},
} );

export default CustomTableHeader;
