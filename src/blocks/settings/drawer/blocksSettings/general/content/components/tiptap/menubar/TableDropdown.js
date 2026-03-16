import { useRef, useState } from 'react';
import Portal from '../../../../../../../../../components/portal/Portal';
import icons from '../../../../../../../../../utils/Icons';
const { __ } = wp.i18n;

const TableDropdown = ( { editor, disabled = false } ) => {
	const [ showDropdown, setShowDropdown ] = useState( false );
	const [ hoveredCell, setHoveredCell ] = useState( { row: 0, col: 0 } );
	const buttonRef = useRef();

	const handleSelect = ( cb ) => {
		if ( disabled ) {
			return;
		}
		cb();
		setShowDropdown( false );
	};

	const isInTable = editor.isActive( 'table' );

	const insertTable = ( rows, cols ) => {
		// Insert table - TrailingParagraph extension will handle adding paragraphs before/after
		editor
			.chain()
			.focus()
			.insertTable( {
				rows,
				cols,
				withHeaderRow: true,
			} )
			.run();

		// Use a timeout to ensure table is inserted before selecting it
		setTimeout( () => {
			const { selection } = editor.state;
			const { $from } = selection;

			// Find the table node
			let tableDepth = null;
			for ( let d = $from.depth; d > 0; d-- ) {
				if ( $from.node( d ).type.name === 'table' ) {
					tableDepth = d;
					break;
				}
			}

			if ( tableDepth !== null ) {
				const tablePos = $from.before( tableDepth );

				// Select the table node
				editor.chain().setNodeSelection( tablePos ).run();
			}
		}, 10 );

		setShowDropdown( false );
	};

	const renderTablePicker = () => {
		const maxRows = 8;
		const maxCols = 10;
		const cells = [];

		for ( let row = 1; row <= maxRows; row++ ) {
			for ( let col = 1; col <= maxCols; col++ ) {
				const isSelected =
					row <= hoveredCell.row && col <= hoveredCell.col;
				cells.push(
					<div
						key={ `${ row }-${ col }` }
						style={ {
							width: '20px',
							height: '20px',
							border: '1px solid #ddd',
							backgroundColor: isSelected ? '#2271b1' : '#fff',
							cursor: 'pointer',
							transition: 'background-color 0.1s ease',
						} }
						onMouseEnter={ () => setHoveredCell( { row, col } ) }
						onClick={ () => insertTable( row, col ) }
					/>
				);
			}
		}

		return (
			<div className="">
				<div
					style={ {
						display: 'grid',
						gridTemplateColumns: `repeat(${ maxCols }, 20px)`,
						gap: '2px',
						padding: '10px',
						border: '1px solid #eee',
						borderRadius: '4px',
						margin: '8px 0',
					} }
					onMouseLeave={ () => setHoveredCell( { row: 0, col: 0 } ) }
				>
					{ cells }
				</div>
				<div
					style={ {
						textAlign: 'center',
						fontSize: '12px',
						color: '#666',
						padding: '4px',
					} }
				>
					{ hoveredCell.row > 0 && hoveredCell.col > 0
						? `${ hoveredCell.row } x ${ hoveredCell.col } Table`
						: 'Select table size' }
				</div>
			</div>
		);
	};

	return (
		<div className="prad-dropdown">
			<button
				ref={ buttonRef }
				className={ `prad-menubar-btn ${
					isInTable ? 'prad-ce-menu-active' : ''
				} ${ disabled ? 'disabled' : '' }` }
				type="button"
				title={ __( 'Table Operations', 'product-addons' ) }
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
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M2 3.33C2 2.6 2.6 2 3.33 2h9.34C13.4 2 14 2.6 14 3.33v9.34c0 .73-.6 1.33-1.33 1.33H3.33C2.6 14 2 13.4 2 12.67V3.33ZM8 2v12M2 8h12"
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
					className="prad-content-editor-dropdown prad-dropdown-list"
					style={ {
						minWidth: isInTable ? 180 : 250,
						padding: '12px',
						paddingTop: '16px',
					} }
				>
					{ ! isInTable && (
						<>
							<div
								style={ {
									padding: '4px 8px',
									fontSize: '12px',
									color: '#666',
									borderBottom: '1px solid #eee',
									marginBottom: 4,
									fontWeight: 'bold',
								} }
							>
								{ __( 'Insert Table', 'product-addons' ) }
							</div>
							{ renderTablePicker() }
						</>
					) }

					{ isInTable && (
						<div
							className="prad-scrollbar"
							style={ {
								maxHeight: '350px',
								overflowY: 'auto',
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
							} }
						>
							<div style={ { display: 'flex', gap: '12px' } }>
								<div className="prad-d-flex prad-flex-column prad-gap-10">
									<div
										className="prad-dropdown-list-heading"
										// style={ {
										// padding: '4px 8px',
										// fontSize: '12px',
										// color: '#666',
										// borderBottom: '1px solid #eee',
										// marginBottom: 4,
										// fontWeight: 'bold',
										// } }
									>
										{ __(
											'Row/Column Options',
											'product-addons'
										) }
									</div>
									<div className="prad-d-flex prad-flex-column prad-gap-10">
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.addRowBefore()
														.run()
												)
											}
										>
											<span className="prad-dropdown-btn-icon-margin">
												↑
											</span>
											{ __(
												'Add Row Above',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.addRowAfter()
														.run()
												)
											}
										>
											<span className="prad-dropdown-btn-icon-margin">
												↓
											</span>
											{ __(
												'Add Row Below',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.addColumnBefore()
														.run()
												)
											}
										>
											<span className="prad-dropdown-btn-icon-margin">
												←
											</span>
											{ __(
												'Add Column Left',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.addColumnAfter()
														.run()
												)
											}
										>
											<span className="prad-dropdown-btn-icon-margin">
												→
											</span>
											{ __(
												'Add Column Right',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left prad-dropdown-btn-danger"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.deleteRow()
														.run()
												)
											}
										>
											<span className="prad-dropdown-btn-icon-margin">
												{ icons.delete }
											</span>
											{ __(
												'Delete Row',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left prad-dropdown-btn-danger"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.deleteColumn()
														.run()
												)
											}
										>
											<span className="prad-dropdown-btn-icon-margin">
												{ icons.delete }
											</span>
											{ __(
												'Delete Column',
												'product-addons'
											) }
										</button>
									</div>
								</div>

								<div
									className="prad-d-flex prad-flex-column prad-gap-10"
									style={ {
										paddingLeft: '12px',
										borderLeft: '1px solid #D5DAD4',
									} }
								>
									<div>
										<div className="prad-dropdown-list-heading">
											{ __(
												'Cell Operations',
												'product-addons'
											) }
										</div>
									</div>
									<div className="prad-d-flex prad-flex-column prad-gap-10">
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.mergeCells()
														.run()
												)
											}
											disabled={
												! editor.can().mergeCells()
											}
										>
											{ /* <span className="prad-dropdown-btn-icon-margin">
												⧉
											</span> */ }
											{ __(
												'Merge Cells',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.splitCell()
														.run()
												)
											}
											disabled={
												! editor.can().splitCell()
											}
										>
											{ /* <span className="prad-dropdown-btn-icon-margin">
												⧄
											</span> */ }
											{ __(
												'Split Cell',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.toggleHeaderRow()
														.run()
												)
											}
										>
											{ /* <span className="prad-dropdown-btn-icon-margin">
												⬜
											</span> */ }
											{ __(
												'Toggle Header Row',
												'product-addons'
											) }
										</button>
										<button
											className="prad-dropdown-btn-left"
											type="button"
											onClick={ () =>
												handleSelect( () =>
													editor
														.chain()
														.focus()
														.toggleHeaderColumn()
														.run()
												)
											}
										>
											{ /* <span className="prad-dropdown-btn-icon-margin">
												⬛
											</span> */ }
											{ __(
												'Toggle Header Column',
												'product-addons'
											) }
										</button>
									</div>
								</div>
							</div>
							<div>
								<button
									className="prad-dropdown-btn-left prad-dropdown-btn-danger prad-dropdown-btn-bold prad-d-flex"
									type="button"
									style={ {
										backgroundColor: '#ff4d4f',
										color: '#fff',
									} }
									onClick={ () =>
										handleSelect( () =>
											editor
												.chain()
												.focus()
												.deleteTable()
												.run()
										)
									}
								>
									<span className="prad-dropdown-btn-icon-margin">
										{ icons.delete }
									</span>
									{ __( 'Delete Table', 'product-addons' ) }
								</button>
							</div>
						</div>
					) }
				</div>
			</Portal>
		</div>
	);
};

export default TableDropdown;
