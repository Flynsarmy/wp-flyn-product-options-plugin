import { TableCell } from '@tiptap/extension-table-cell';

const CustomTableCell = TableCell.extend( {
	name: 'tableCell',
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
				tag: 'td',
				preserveWhitespace: 'full',
			},
		];
	},

	renderHTML( { HTMLAttributes } ) {
		return [ 'td', HTMLAttributes, 0 ];
	},

	addCommands() {
		return {
			...this.parent?.(),
		};
	},

	addKeyboardShortcuts() {
		return {
			Tab: () => {
				// Only apply table navigation if we're actually in a table
				if ( ! this.editor.isActive( 'tableCell' ) ) {
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
				// Only apply table navigation if we're actually in a table
				if ( ! this.editor.isActive( 'tableCell' ) ) {
					return false;
				}
				return this.editor.commands.goToPreviousCell();
			},
			Enter: () => {
				// Only apply hard break behavior if we're actually in a table cell
				if ( ! this.editor.isActive( 'tableCell' ) ) {
					return false;
				}

				// Insert hard break instead of creating new paragraph
				if ( this.editor.can().setHardBreak() ) {
					return this.editor.chain().focus().setHardBreak().run();
				}
				// Fallback: insert <br> directly
				return this.editor.commands.insertContent( '<br>' );
			},
			'Shift-Enter': () => {
				// Only apply hard break behavior if we're actually in a table cell
				if ( ! this.editor.isActive( 'tableCell' ) ) {
					return false;
				}

				// Insert line break
				if ( this.editor.can().setHardBreak() ) {
					return this.editor.chain().focus().setHardBreak().run();
				}
				return this.editor.commands.insertContent( '<br>' );
			},
			ArrowRight: () => {
				// Disable right arrow key inside table cells
				if ( this.editor.isActive( 'tableCell' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
			ArrowLeft: () => {
				// Disable left arrow key inside table cells
				if ( this.editor.isActive( 'tableCell' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
			ArrowUp: () => {
				// Disable up arrow key inside table cells
				if ( this.editor.isActive( 'tableCell' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
			ArrowDown: () => {
				// Disable down arrow key inside table cells
				if ( this.editor.isActive( 'tableCell' ) ) {
					return true; // Prevent default behavior
				}
				return false;
			},
		};
	},
} );

export default CustomTableCell;
