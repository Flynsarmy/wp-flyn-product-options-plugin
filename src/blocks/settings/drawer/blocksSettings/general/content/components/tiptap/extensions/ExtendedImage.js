import Image from '@tiptap/extension-image';

const ExtendedImage = Image.extend( {
	name: 'image',

	addOptions() {
		return {
			...this.parent?.(),
			HTMLAttributes: { class: 'prad-content-image' },
		};
	},

	addAttributes() {
		return {
			...this.parent?.(),
			width: {
				default: null,
				parseHTML: ( element ) => element.getAttribute( 'width' ),
				renderHTML: ( attributes ) => {
					if ( ! attributes.width ) {
						return {};
					}
					return {
						width: attributes.width,
						height: 'auto',
					};
				},
			},
			height: {
				default: null,
				parseHTML: ( element ) => element.getAttribute( 'height' ),
				renderHTML: ( attributes ) => {
					if ( ! attributes.height ) {
						return {};
					}
					return {
						height: attributes.height,
					};
				},
			},
		};
	},

	addCommands() {
		return {
			setImage:
				( options ) =>
				( { commands, state } ) => {
					// Check if cursor is inside a table cell
					const { selection } = state;
					const { $from } = selection;

					let node = $from.parent;
					let depth = $from.depth;

					while ( depth > 0 ) {
						if ( node.type.name === 'tableCell' ) {
							// Prevent image insertion inside table cells
							return false;
						}
						depth--;
						node = $from.node( depth );
					}

					// If not in table cell, proceed with normal image insertion
					return commands.insertContent( {
						type: this.name,
						attrs: options,
					} );
				},
		};
	},
} );

export default ExtendedImage;
