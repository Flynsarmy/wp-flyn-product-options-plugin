import { useCallback, useEffect, useState, useRef } from 'react';

const { __ } = wp.i18n;

const useFontManager = () => {
	const [ loading, setLoading ] = useState( false );
	const [ fonts, setFonts ] = useState( [] );
	const [ uploading, setUploading ] = useState( false );
	const [ deletingId, setDeletingId ] = useState( null );
	const [ editingFont, setEditingFont ] = useState( null );
	const [ showUploadModal, setShowUploadModal ] = useState( false );
	const [ showEditModal, setShowEditModal ] = useState( false );
	const [ fontTitle, setFontTitle ] = useState( '' );
	const [ fontFamily, setFontFamily ] = useState( '' );
	const [ selectedFile, setSelectedFile ] = useState( null );
	const [ toastMessages, setToastMessages ] = useState( {
		state: false,
		status: '',
		messages: [],
	} );
	const fileInputRef = useRef( null );

	// Fetch fonts from API
	const fetchFonts = useCallback( () => {
		setLoading( true );
		wp.apiFetch( {
			path: '/prad/get_fonts',
			method: 'GET',
		} )
			.then( ( obj ) => {
				if ( obj.success && obj.data ) {
					setFonts( obj.data );
				}
			} )
			.catch( () => {
				setToastMessages( {
					status: 'error',
					messages: [
						__( 'Failed to load fonts', 'product-addons' ),
					],
					state: true,
				} );
			} )
			.finally( () => setLoading( false ) );
	}, [] );

	// Fetch fonts on mount
	useEffect( () => {
		fetchFonts();
	}, [ fetchFonts ] );

	// Handle file selection
	const handleFileSelect = useCallback( ( e ) => {
		const file = e.target.files[ 0 ];
		if ( file ) {
			// Validate file type
			const allowedExtensions = [ 'woff', 'woff2', 'ttf' ];
			const fileExtension = file.name.split( '.' ).pop().toLowerCase();

			if ( ! allowedExtensions.includes( fileExtension ) ) {
				setToastMessages( {
					status: 'error',
					messages: [
						__(
							'Invalid file type. Only WOFF, WOFF2, and TTF files are allowed.',
							'product-addons'
						),
					],
					state: true,
				} );
				return;
			}

			// Validate file size (10MB)
			if ( file.size > 10 * 1024 * 1024 ) {
				setToastMessages( {
					status: 'error',
					messages: [
						__( 'File size exceeds 10MB limit.', 'product-addons' ),
					],
					state: true,
				} );
				return;
			}

			setSelectedFile( file );
		}
	}, [] );

	// Handle font upload
	const handleUpload = useCallback( () => {
		if ( ! selectedFile ) {
			setToastMessages( {
				status: 'error',
				messages: [
					__( 'Please select a font file.', 'product-addons' ),
				],
				state: true,
			} );
			return;
		}

		if ( ! fontTitle.trim() ) {
			setToastMessages( {
				status: 'error',
				messages: [
					__( 'Please enter a font title.', 'product-addons' ),
				],
				state: true,
			} );
			return;
		}

		setUploading( true );

		const formData = new FormData();
		formData.append( 'font_file', selectedFile );
		formData.append( 'font_title', fontTitle );
		formData.append(
			'font_family',
			fontFamily || fontTitle.toLowerCase().replace( /\s+/g, '-' )
		);
		formData.append( 'pradnonce', pradBackendData.nonce || '' );

		wp.apiFetch( {
			path: '/prad/upload_font',
			method: 'POST',
			body: formData,
		} )
			.then( ( obj ) => {
				if ( obj.success ) {
					setToastMessages( {
						status: 'success',
						messages: [
							__(
								'Font uploaded successfully!',
								'product-addons'
							),
						],
						state: true,
					} );
					// Reset form
					setFontTitle( '' );
					setFontFamily( '' );
					setSelectedFile( null );
					setShowUploadModal( false );
					if ( fileInputRef.current ) {
						fileInputRef.current.value = '';
					}
					// Refresh fonts list
					fetchFonts();
				} else {
					setToastMessages( {
						status: 'error',
						messages: [
							obj.message ||
								__( 'Upload failed', 'product-addons' ),
						],
						state: true,
					} );
				}
			} )
			.catch( () => {
				setToastMessages( {
					status: 'error',
					messages: [
						__(
							'Upload failed. Please try again.',
							'product-addons'
						),
					],
					state: true,
				} );
			} )
			.finally( () => setUploading( false ) );
	}, [ selectedFile, fontTitle, fontFamily, fetchFonts ] );

	// Handle font deletion
	const handleDelete = useCallback(
		( fontId ) => {
			// eslint-disable-next-line no-alert, no-restricted-globals
			const confirmed = confirm(
				__(
					'Are you sure you want to delete this font?',
					'product-addons'
				)
			);

			if ( ! confirmed ) {
				return;
			}

			setDeletingId( fontId );

			wp.apiFetch( {
				path: '/prad/delete_font',
				method: 'POST',
				data: { font_id: fontId },
			} )
				.then( ( obj ) => {
					if ( obj.success ) {
						setToastMessages( {
							status: 'success',
							messages: [
								__(
									'Font deleted successfully!',
									'product-addons'
								),
							],
							state: true,
						} );
						fetchFonts();
					} else {
						setToastMessages( {
							status: 'error',
							messages: [
								obj.message ||
									__( 'Delete failed', 'product-addons' ),
							],
							state: true,
						} );
					}
				} )
				.catch( () => {
					setToastMessages( {
						status: 'error',
						messages: [ __( 'Delete failed', 'product-addons' ) ],
						state: true,
					} );
				} )
				.finally( () => setDeletingId( null ) );
		},
		[ fetchFonts ]
	);

	// Close modal and reset form
	const closeModal = useCallback( () => {
		setShowUploadModal( false );
		setFontTitle( '' );
		setFontFamily( '' );
		setSelectedFile( null );
		if ( fileInputRef.current ) {
			fileInputRef.current.value = '';
		}
	}, [] );

	// Handle edit font
	const handleEdit = useCallback( ( font ) => {
		setEditingFont( font );
		setFontTitle( font.title );
		setFontFamily( font.family );
		setShowEditModal( true );
	}, [] );

	// Handle update font
	const handleUpdate = useCallback( () => {
		if ( ! fontTitle.trim() ) {
			setToastMessages( {
				status: 'error',
				messages: [
					__( 'Please enter a font title.', 'product-addons' ),
				],
				state: true,
			} );
			return;
		}

		if ( ! editingFont ) {
			return;
		}

		setUploading( true );

		wp.apiFetch( {
			path: '/prad/update_font',
			method: 'POST',
			data: {
				font_id: editingFont.id,
				font_title: fontTitle,
				font_family: fontFamily || fontTitle,
			},
		} )
			.then( ( obj ) => {
				if ( obj.success ) {
					setToastMessages( {
						status: 'success',
						messages: [
							__(
								'Font updated successfully!',
								'product-addons'
							),
						],
						state: true,
					} );
					setShowEditModal( false );
					setEditingFont( null );
					setFontTitle( '' );
					setFontFamily( '' );
					fetchFonts();
				} else {
					setToastMessages( {
						status: 'error',
						messages: [
							obj.message ||
								__( 'Update failed', 'product-addons' ),
						],
						state: true,
					} );
				}
			} )
			.catch( () => {
				setToastMessages( {
					status: 'error',
					messages: [
						__(
							'Update failed. Please try again.',
							'product-addons'
						),
					],
					state: true,
				} );
			} )
			.finally( () => setUploading( false ) );
	}, [ fontTitle, fontFamily, editingFont, fetchFonts ] );

	// Close edit modal
	const closeEditModal = useCallback( () => {
		setShowEditModal( false );
		setEditingFont( null );
		setFontTitle( '' );
		setFontFamily( '' );
	}, [] );

	return {
		// State
		loading,
		fonts,
		uploading,
		deletingId,
		editingFont,
		showUploadModal,
		showEditModal,
		fontTitle,
		fontFamily,
		selectedFile,
		toastMessages,
		fileInputRef,

		// Setters
		setShowUploadModal,
		setFontTitle,
		setFontFamily,
		setToastMessages,

		// Handlers
		handleFileSelect,
		handleUpload,
		handleEdit,
		handleUpdate,
		handleDelete,
		closeModal,
		closeEditModal,
	};
};

export default useFontManager;
