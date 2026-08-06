import React, { useState, useEffect, useMemo } from 'react';
import { useEditor } from '../../../context/EditorContext';

const { __ } = wp.i18n;

/* ——————————————————————————————————————————
   Inline SVGs matching bsc-wowaddons style
   —————————————————————————————————————————— */
const EditIconSvg = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="13"
		height="13"
		fill="none"
		viewBox="0 0 16 16"
		aria-hidden="true"
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.2"
			d="M9.333 1.333 12 4l-7.333 7.333H2V8.667l7.333-7.334ZM2 14.667h12"
		/>
	</svg>
);

const CheckSvg = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="14"
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M13 5L6.6667 11.3333L4 8.6667"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

/* ——————————————————————————————————————————
   Component
   —————————————————————————————————————————— */
const DuplicateToModal = () => {
	const { duplicateModalState, setDuplicateModalState, optionId } = useEditor();
	const [ optionsLists, setOptionsLists ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ selectedLists, setSelectedLists ] = useState( [] );
	const [ successData, setSuccessData ] = useState( null );
	const [ isDuplicating, setIsDuplicating ] = useState( false );
	const [ error, setError ] = useState( '' );
	const [ filterTerm, setFilterTerm ] = useState( '' );

	useEffect( () => {
		if ( duplicateModalState.open && ! successData ) {
			fetchOptionsLists();
		} else if ( ! duplicateModalState.open ) {
			// Reset state when closing
			setOptionsLists( [] );
			setSelectedLists( [] );
			setSuccessData( null );
			setError( '' );
			setFilterTerm( '' );
		}
	}, [ duplicateModalState.open ] );

	const filteredLists = useMemo( () => {
		const term = filterTerm.trim().toLowerCase();
		if ( ! term ) {
			return optionsLists;
		}
		return optionsLists.filter( ( list ) => {
			const title = ( list.title || '' ).toLowerCase();
			return title.includes( term );
		} );
	}, [ optionsLists, filterTerm ] );

	const fetchOptionsLists = async () => {
		setIsLoading( true );
		try {
			const obj = await wp.apiFetch( {
				method: 'POST',
				path: '/prad/option_list',
				data: {
					wpnonce: pradBackendData?.nonce,
					per_page: -1,
				},
			} );

			if ( obj.success ) {
				// Exclude the current options list from the targets
				const lists = obj.posts.filter(
					( list ) => list.id !== parseInt( optionId )
				);
				setOptionsLists( lists );
			} else {
				setError( __( 'Failed to fetch options lists.', 'flyn-product-options' ) );
			}
		} catch ( err ) {
			setError( err.message || __( 'An error occurred.', 'flyn-product-options' ) );
		}
		setIsLoading( false );
	};

	const handleToggle = ( listId ) => {
		if ( selectedLists.includes( listId ) ) {
			setSelectedLists( selectedLists.filter( ( id ) => id !== listId ) );
		} else {
			setSelectedLists( [ ...selectedLists, listId ] );
		}
	};

	const handleDuplicate = async () => {
		if ( selectedLists.length === 0 ) {
			setError( __( 'Please select at least one options list.', 'flyn-product-options' ) );
			return;
		}

		setIsDuplicating( true );
		setError( '' );

		try {
			const obj = await wp.apiFetch( {
				method: 'POST',
				path: '/prad/duplicate_block_to_lists',
				data: {
					wpnonce: pradBackendData?.nonce,
					list_ids: selectedLists,
					block: duplicateModalState.block_data,
				},
			} );

			if ( obj.success ) {
				setSuccessData( obj.lists );
			} else {
				setError( obj.message || __( 'Failed to duplicate block.', 'flyn-product-options' ) );
			}
		} catch ( err ) {
			setError( err.message || __( 'An error occurred.', 'flyn-product-options' ) );
		}
		setIsDuplicating( false );
	};

	const close = () => {
		setDuplicateModalState( { open: false, block_data: null } );
	};

	if ( ! duplicateModalState.open ) {
		return null;
	}

	return (
		<div className="prad-confirm-modal-overlay">
			<style>{ duplicateToModalStyles }</style>
			<div className="prad-confirm-modal-container prad-duplicate-modal">
				{ ! successData ? (
					<>
						<h3 className="prad-duplicate-modal__title">
							{ __( 'Duplicate Block To', 'flyn-product-options' ) }
						</h3>
						{ error && (
							<div className="prad-duplicate-modal__error">
								{ error }
							</div>
						) }
						{ isLoading ? (
							<p className="prad-duplicate-modal__loading">
								{ __( 'Loading options lists...', 'flyn-product-options' ) }
							</p>
						) : (
							<div className="prad-duplicate-modal__col">
								<input
									type="search"
									className="prad-duplicate-modal__filter"
									placeholder={ __( 'Filter...', 'flyn-product-options' ) }
									value={ filterTerm }
									onChange={ ( e ) => setFilterTerm( e.target.value ) }
								/>
								<ul className="prad-duplicate-modal__list">
									{ filteredLists.length > 0 ? (
										filteredLists.map( ( list ) => {
											const isSelected = selectedLists.includes( list.id );
											return (
												<li
													key={ list.id }
													className={ `prad-duplicate-modal__item${ isSelected ? ' is-selected' : '' }` }
													onClick={ () => handleToggle( list.id ) }
													role="button"
													tabIndex="0"
													onKeyDown={ ( e ) => {
														if ( e.key === 'Enter' || e.key === ' ' ) {
															e.preventDefault();
															handleToggle( list.id );
														}
													} }
												>
													<span className="prad-duplicate-modal__check">
														{ isSelected && <CheckSvg /> }
													</span>
													<span className="prad-duplicate-modal__label">
														{ list.title || `(ID: ${ list.id })` }
													</span>
												</li>
											);
										} )
									) : (
										<li className="prad-duplicate-modal__empty">
											{ filterTerm
												? __( 'No matching options lists.', 'flyn-product-options' )
												: __( 'No other options lists found.', 'flyn-product-options' )
											}
										</li>
									) }
								</ul>
							</div>
						) }

						<div className="prad-confirm-modal-buttons">
							<button
								className="prad-confirm-btn prad-confirm-btn-confirm"
								onClick={ close }
								disabled={ isDuplicating }
							>
								{ __( 'Cancel', 'flyn-product-options' ) }
							</button>
							<button
								className="prad-confirm-btn prad-confirm-btn-cancel"
								onClick={ handleDuplicate }
								disabled={ isDuplicating || selectedLists.length === 0 }
							>
								{ isDuplicating
									? __( 'Duplicating...', 'flyn-product-options' )
									: __( 'Duplicate', 'flyn-product-options' ) }
							</button>
						</div>
					</>
				) : (
					<>
						<h3 className="prad-duplicate-modal__title prad-duplicate-modal__title--success">
							{ __( 'Duplicated Successfully!', 'flyn-product-options' ) }
						</h3>
						<p>{ __( 'The block was duplicated to the following options lists:', 'flyn-product-options' ) }</p>
						<ul className="prad-duplicate-modal__list prad-duplicate-modal__list--success">
							{ successData.map( ( list ) => (
								<li key={ list.id } className="prad-duplicate-modal__item prad-duplicate-modal__item--success">
									<EditIconSvg />
									<a
										href={ list.edit_url }
										target="_blank"
										rel="noreferrer"
										className="prad-duplicate-modal__link"
									>
										{ list.title || `(ID: ${ list.id })` }
									</a>
								</li>
							) ) }
						</ul>

						<div className="prad-confirm-modal-buttons">
							<button
								className="prad-confirm-btn prad-confirm-btn-cancel"
								onClick={ close }
							>
								{ __( 'Close', 'flyn-product-options' ) }
							</button>
						</div>
					</>
				) }
			</div>
		</div>
	);
};

/* ——————————————————————————————————————————
   Scoped styles — matching bsc-wowaddons
   product tab dual-list appearance
   —————————————————————————————————————————— */
const duplicateToModalStyles = `
.prad-duplicate-modal {
	width: 480px;
	max-width: 90%;
}

.prad-duplicate-modal .prad-confirm-btn:disabled,
.prad-duplicate-modal .prad-confirm-btn[disabled] {
	opacity: 0.5;
	cursor: not-allowed !important;
	background-color: #f6f7f7 !important;
	color: #a7aaad !important;
	border: 1px solid #dcdcde !important;
	box-shadow: none !important;
}

.prad-duplicate-modal__title {
	margin: 0 0 12px 0;
	font-size: 15px;
	font-weight: 600;
	color: #1d2327;
}

.prad-duplicate-modal__title--success {
	color: #4caf50;
}

.prad-duplicate-modal__error {
	color: #d63638;
	margin-bottom: 10px;
	font-size: 13px;
}

.prad-duplicate-modal__loading {
	font-size: 13px;
	color: #50575e;
}

.prad-duplicate-modal__col {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
}

/* Filter — matches .bsc-wowaddons-filter */
.prad-duplicate-modal__filter {
	width: 100%;
	box-sizing: border-box;
	padding: 5px 8px;
	font-size: 12px;
	border: 1px solid #c3c4c7;
	border-radius: 4px;
	background: #fff;
	color: #1d2327;
}

.prad-duplicate-modal__filter:focus {
	outline: none;
	border-color: #2271b1;
	box-shadow: 0 0 0 1px #2271b1;
}

/* List — matches .bsc-wowaddons-list */
.prad-duplicate-modal__list {
	list-style: none;
	margin: 0;
	padding: 6px;
	min-height: 80px;
	max-height: 300px;
	overflow-y: auto;
	border: 1px solid #c3c4c7;
	border-radius: 4px;
	background: #f6f7f7;
}

.prad-duplicate-modal__list--success {
	min-height: auto;
	margin-bottom: 16px;
}

/* Item — matches .bsc-wowaddons-item */
.prad-duplicate-modal__item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 10px;
	margin: 3px 0;
	background: #fff;
	border: 1px solid #dcdcde;
	border-radius: 4px;
	font-size: 13px;
	color: #1d2327;
	user-select: none;
	cursor: pointer;
	transition: box-shadow 0.1s ease, border-color 0.1s ease, background 0.1s ease;
}

.prad-duplicate-modal__item:hover {
	box-shadow: 0 1px 4px rgba(0,0,0,0.12);
	border-color: #a7aaad;
}

.prad-duplicate-modal__item.is-selected {
	background: #e8f0fe;
	border-color: #4285f4;
}

.prad-duplicate-modal__item--success {
	cursor: default;
}

.prad-duplicate-modal__item--success:hover {
	box-shadow: none;
	border-color: #dcdcde;
}

/* Check indicator */
.prad-duplicate-modal__check {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	border: 1px solid #c3c4c7;
	border-radius: 3px;
	background: #fff;
	color: #2271b1;
	transition: border-color 0.1s ease, background 0.1s ease;
}

.prad-duplicate-modal__item.is-selected .prad-duplicate-modal__check {
	background: #2271b1;
	border-color: #2271b1;
	color: #fff;
}

/* Label — matches .bsc-wowaddons-label */
.prad-duplicate-modal__label {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* Edit link in success list */
.prad-duplicate-modal__link {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #2271b1;
	text-decoration: none;
}

.prad-duplicate-modal__link:hover {
	color: #135e96;
	text-decoration: underline;
}

.prad-duplicate-modal__item--success svg {
	flex-shrink: 0;
	color: #a7aaad;
}

/* Empty state — matches .bsc-wowaddons-empty */
.prad-duplicate-modal__empty {
	font-size: 12px;
	color: #a7aaad;
	text-align: center;
	padding: 16px 8px;
	pointer-events: none;
}
`;

export default DuplicateToModal;
