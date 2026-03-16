import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ExtendedImage from '../extensions/ExtendedImage';
import CustomTableCell from '../extensions/CustomTableCell';
import CustomTableHeader from '../extensions/CustomTableHeader';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Node, Extension } from '@tiptap/core';
import { useEffect, useState, useMemo } from 'react';

import MenuBar from './MenuBar';
import HtmlEditor from './HtmlEditor';
import '../scss/content-editor.scss';

const { __ } = wp.i18n;

// Custom Div extension
const Div = Node.create( {
	name: 'div',
	group: 'block',
	content: 'inline*',
	parseHTML() {
		return [ { tag: 'div' } ];
	},
	renderHTML( { HTMLAttributes } ) {
		return [ 'div', HTMLAttributes, 0 ];
	},
	addCommands() {
		return {
			setDiv:
				() =>
				( { commands } ) => {
					return commands.setNode( this.name );
				},
		};
	},
} );

// Custom Span extension (as a block-level node, similar to div)
const Span = Node.create( {
	name: 'span',
	group: 'block',
	content: 'inline*',
	parseHTML() {
		return [ { tag: 'span' } ];
	},
	renderHTML( { HTMLAttributes } ) {
		return [ 'span', HTMLAttributes, 0 ];
	},
	addCommands() {
		return {
			setSpan:
				() =>
				( { commands } ) => {
					return commands.setNode( this.name );
				},
		};
	},
} );

// Custom extension to handle exiting tables with keyboard
const TableExit = Extension.create( {
	name: 'tableExit',
	addKeyboardShortcuts() {
		return {
			// When pressing Enter in last cell of table, exit to paragraph below
			Enter: ( { editor } ) => {
				const { selection } = editor.state;
				const { $from } = selection;

				// Check if entire table node is selected (when clicking on wrapper)
				if ( selection.node && selection.node.type.name === 'table' ) {
					const tablePos = selection.from;
					const tableNode = selection.node;
					const afterTablePos = tablePos + tableNode.nodeSize;

					// Insert paragraph after table and move cursor there
					editor
						.chain()
						.insertContentAt( afterTablePos, {
							type: 'paragraph',
						} )
						.setTextSelection( afterTablePos + 1 )
						.run();
					return true;
				}

				// Otherwise, check if we're inside a table cell
				if ( ! editor.isActive( 'table' ) ) {
					return false;
				}

				// Check if we're in a table cell
				let cellDepth = null;
				let tableDepth = null;

				for ( let d = $from.depth; d > 0; d-- ) {
					if (
						$from.node( d ).type.name === 'tableCell' ||
						$from.node( d ).type.name === 'tableHeader'
					) {
						cellDepth = d;
					}
					if ( $from.node( d ).type.name === 'table' ) {
						tableDepth = d;
						break;
					}
				}

				if ( cellDepth === null || tableDepth === null ) {
					return false;
				}

				const tableNode = $from.node( tableDepth );
				const tablePos = $from.before( tableDepth );

				// Check if we're in the last row of the table
				const tableRows = tableNode.content.childCount;
				const currentRow = $from.index( tableDepth );

				// If in last row and cell content is empty or at end
				if ( currentRow === tableRows - 1 ) {
					const cell = $from.node( cellDepth );
					const cellContent = cell.textContent;

					// If cell is empty or cursor is at end of cell content
					if (
						! cellContent ||
						$from.parentOffset === cell.content.size
					) {
						const afterTablePos = tablePos + tableNode.nodeSize;

						// Check if there's already content after table
						const after = editor.state.doc.resolve( afterTablePos );
						if (
							after.nodeAfter === null ||
							after.nodeAfter.type.name !== 'paragraph'
						) {
							// Insert paragraph after table and move cursor there
							editor
								.chain()
								.insertContentAt( afterTablePos, {
									type: 'paragraph',
								} )
								.setTextSelection( afterTablePos + 1 )
								.run();
							return true;
						}
					}
				}

				return false;
			},
		};
	},
} );

// Extension to ensure there's always a trailing paragraph at the end
const TrailingParagraph = Extension.create( {
	name: 'trailingParagraph',

	addProseMirrorPlugins() {
		return [
			new ( require( 'prosemirror-state' ).Plugin )( {
				appendTransaction: ( transactions, oldState, newState ) => {
					// Don't do anything if document hasn't changed
					if ( ! transactions.some( ( tr ) => tr.docChanged ) ) {
						return null;
					}

					const { doc, tr: transaction } = newState;
					let modified = false;

					// Rule 1: If editor is empty, behave normal (do nothing special)
					if ( doc.childCount === 0 ) {
						return null;
					}

					// Rule 2: If table is at the first position, add div before it
					const firstNode = doc.firstChild;
					if (
						firstNode &&
						firstNode.type.name === 'table' &&
						doc.childCount > 0
					) {
						const div = newState.schema.nodes.div.create();
						transaction.insert( 0, div );
						modified = true;
					}

					// Rule 3: Add trailing div at the bottom ONLY when table is last
					const lastNode = doc.lastChild;
					if ( lastNode && lastNode.type.name === 'table' ) {
						const div = newState.schema.nodes.div.create();
						transaction.insert( doc.content.size, div );
						modified = true;
					}

					return modified ? transaction : null;
				},
			} ),
		];
	},
} );

// Helper function to convert mixed text/HTML content to proper HTML
const parseContentToHtml = ( content ) => {
	if ( ! content || content.trim() === '' ) {
		return '<p></p>';
	}

	// If content already looks like proper HTML (starts with tag), return as-is
	if ( content.trim().startsWith( '<' ) && content.trim().endsWith( '>' ) ) {
		return content;
	}

	// Convert mixed content: split by HTML tags and wrap plain text in paragraphs
	const htmlTagRegex = /(<[^>]+>.*?<\/[^>]+>|<[^>]+\/>)/g;
	const parts = content.split( htmlTagRegex );

	let result = '';
	let insideTable = false;

	for ( const part of parts ) {
		if ( part.trim() === '' ) {
			continue;
		}
		if ( htmlTagRegex.test( part ) ) {
			result += part;
			// Track if we're inside a table context
			if ( part.includes( '<table' ) ) {
				insideTable = true;
			} else if ( part.includes( '</table>' ) ) {
				insideTable = false;
			}
		} else {
			const trimmed = part.trim();
			if ( trimmed ) {
				// Don't wrap in paragraphs if we're inside a table cell context
				if ( insideTable ) {
					result += trimmed;
				} else {
					result += `<p>${ trimmed }</p>`;
				}
			}
		}
	}
	return result || '<p></p>';
};

const TiptapEditor = ( { content, onChange } ) => {
	const [ isHtmlMode, setIsHtmlMode ] = useState( false );
	const [ htmlContent, setHtmlContent ] = useState( content || '' );

	const extensions = useMemo(
		() => [
			StarterKit.configure( {
				paragraph: {
					parseHTML() {
						return [ { tag: 'p' } ];
					},
				},
				bulletList: {
					keepMarks: true,
				},
				orderedList: {
					keepMarks: true,
				},
			} ),
			Div,
			Span,
			ExtendedImage.configure( {
				inline: false,
				allowBase64: true,
			} ),
			Table.configure( {
				resizable: true,
				HTMLAttributes: { class: 'prad-block-content-table' },
			} ),
			TableRow,
			CustomTableHeader,
			CustomTableCell,
			TableExit,
			TrailingParagraph,
			// CodeBlock removed to avoid duplicate extension (already included in StarterKit)
			Underline,
			Highlight.configure( { multicolor: true } ),
			Link.configure( {
				openOnClick: false, // Disable clicking links in editor
				autolink: true,
				linkOnPaste: true,
				HTMLAttributes: {
					rel: 'noopener noreferrer',
					target: '_blank',
				},
			} ),
		],
		[]
	);

	const editor = useEditor( {
		extensions,
		content: content || '<p>Enter your content here…</p>',
		parseOptions: { preserveWhitespace: 'full' },
		onUpdate: ( { editor: currentEditor } ) => {
			if ( ! isHtmlMode ) {
				const html = currentEditor.getHTML();
				setHtmlContent( html );
				if ( onChange ) {
					onChange( html );
				}
			}
		},
	} );

	useEffect( () => {
		if ( editor && content !== editor.getHTML() && ! isHtmlMode ) {
			try {
				// Parse mixed content properly
				const parsedContent = parseContentToHtml(
					content || '<p>Enter your content here…</p>'
				);
				editor.commands.setContent( parsedContent, false );
				setHtmlContent( parsedContent );
			} catch ( error ) {
				// Fallback for invalid HTML
				const fallbackContent = '<p>Enter your content here…</p>';
				editor.commands.setContent( fallbackContent );
				setHtmlContent( fallbackContent );
			}
		}
	}, [ content, editor, isHtmlMode ] );

	const handleHtmlToggle = () => {
		if ( ! isHtmlMode ) {
			// Switching to HTML mode - get current editor HTML
			if ( editor ) {
				setHtmlContent( editor.getHTML() );
			}
		} else if ( editor ) {
			// Switching back to visual mode - parse mixed content properly
			try {
				const parsedContent = parseContentToHtml( htmlContent );
				editor.commands.setContent( parsedContent, false );
				if ( onChange ) {
					onChange( parsedContent );
				}
			} catch ( error ) {
				// Fallback to safe content if HTML is invalid
				editor.commands.setContent( '<p>Invalid HTML content</p>' );
			}
		}
		setIsHtmlMode( ! isHtmlMode );
	};

	const handleHtmlChange = ( newHtmlContent ) => {
		setHtmlContent( newHtmlContent );
		if ( onChange ) {
			onChange( newHtmlContent );
		}
	};

	if ( ! editor && ! isHtmlMode ) {
		return (
			<div className="prad-editor-loading">
				{ __( 'Loading editor…', 'product-addons' ) }
			</div>
		);
	}

	return (
		<div className="prad-content-editor">
			<MenuBar
				editor={ editor }
				onHtmlToggle={ handleHtmlToggle }
				isHtmlMode={ isHtmlMode }
			/>

			<div className="prad-content-editor-content">
				{ isHtmlMode ? (
					<HtmlEditor
						content={ htmlContent }
						onChange={ handleHtmlChange }
					/>
				) : (
					<EditorContent editor={ editor } />
				) }
			</div>
		</div>
	);
};

export default TiptapEditor;
