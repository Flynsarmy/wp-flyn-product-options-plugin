import { memo, useRef, useState } from 'react';
import Button from '../../../components/Button';
import TextField from '../../../components/text_field';
import icons from '../../../utils/Icons';

const { __ } = wp.i18n;

const FontUploadModal = ( {
	isOpen,
	onClose,
	fontTitle,
	setFontTitle,
	fontFamily,
	setFontFamily,
	selectedFile,
	onFileSelect,
	uploading,
	onUpload,
	fileInputRef,
} ) => {
	const [ isDragOver, setIsDragOver ] = useState( false );
	const dragCounter = useRef( 0 );

	if ( ! isOpen ) {
		return null;
	}

	return (
		<div
			className="prad-modal-overlay prad-d-flex prad-item-center prad-justify-center"
			onClick={ onClose }
		>
			<div
				className="prad-modal prad-bg-base1 prad-p-32 prad-br-md prad-shadow-lg prad-scrollbar"
				style={ { maxWidth: '500px', width: '90%' } }
				onClick={ ( e ) => e.stopPropagation() }
			>
				<div className="prad-d-flex prad-justify-between prad-item-center prad-mb-24">
					<div className="prad-font-20 prad-font-bold">
						{ __( 'Upload Custom Font', 'product-addons' ) }
					</div>
					<div
						className="prad-cursor-pointer prad-color-base7 prad-hover-color-base9"
						style={ {
							border: '1px solid black',
							display: 'flex',
							padding: '4px',
							borderRadius: '4px',
						} }
						onClick={ onClose }
					>
						{ icons.cross_20 }
					</div>
				</div>

				<div className="prad-d-flex prad-flex-column prad-gap-20">
					<div>
						<label
							htmlFor="font_title"
							className="prad-font-14 prad-font-bold prad-mb-8 prad-d-block"
						>
							{ __( 'Font Title *', 'product-addons' ) }
						</label>
						<TextField
							// inline={ true }
							name="font_title"
							value={ fontTitle }
							onChange={ setFontTitle }
							placeholder={ __(
								'e.g., My Custom Font',
								'product-addons'
							) }
						/>
					</div>

					<div>
						<label
							htmlFor="font_family"
							className="prad-font-14 prad-font-bold prad-mb-8 prad-d-block"
						>
							{ __( 'Font Family Name', 'product-addons' ) }
						</label>
						<TextField
							// inline={ true }
							name="font_family"
							value={ fontFamily }
							onChange={ setFontFamily }
							placeholder={ __(
								'e.g., my-custom-font (optional)',
								'product-addons'
							) }
						/>
						<div className="prad-help-message prad-mt-4">
							{ __(
								'CSS font-family name. Auto-generated if left empty.',
								'product-addons'
							) }
						</div>
					</div>

					<div>
						<label
							htmlFor="font_file"
							className="prad-font-14 prad-font-bold prad-mb-8 prad-d-block"
						>
							{ __( 'Font File *', 'product-addons' ) }
						</label>
						<div
							className="prad-file-input-wrapper prad-br-md"
							onDragOver={ ( e ) => {
								e.preventDefault();
								e.stopPropagation();
							} }
							onDragEnter={ ( e ) => {
								e.preventDefault();
								e.stopPropagation();
								dragCounter.current += 1;
								if ( dragCounter.current === 1 ) {
									setIsDragOver( true );
								}
							} }
							onDragLeave={ ( e ) => {
								e.preventDefault();
								e.stopPropagation();
								dragCounter.current -= 1;
								if ( dragCounter.current === 0 ) {
									setIsDragOver( false );
								}
							} }
							onDrop={ ( e ) => {
								e.preventDefault();
								e.stopPropagation();
								setIsDragOver( false );
								dragCounter.current = 0;
								const files = e.dataTransfer.files;
								if ( files.length > 0 ) {
									onFileSelect( { target: { files } } );
								}
							} }
							style={ { position: 'relative' } }
						>
							<input
								id="font_file"
								ref={ fileInputRef }
								type="file"
								accept=".woff,.woff2,.ttf"
								onChange={ onFileSelect }
								className="prad-file-input "
								style={ { display: 'none' } }
							/>
							<div
								className="prad-file-upload-area"
								onClick={ () => fileInputRef.current?.click() }
								style={ {
									// width: '100%',
									padding: '20px',
									border: `2px dashed ${
										isDragOver ? '#007cba' : '#8c8f94'
									}`,
									borderRadius: '4px',
									background: isDragOver
										? '#f0f8ff'
										: '#f9f9f9',
									color: '#666',
									fontSize: '14px',
									cursor: 'pointer',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'all 0.3s ease',
									textAlign: 'center',
								} }
							>
								<span
									style={ {
										marginBottom: '8px',
										fontSize: '16px',
									} }
								>
									{ icons.upload }
								</span>
								{ selectedFile ? (
									<div>
										<strong>{ selectedFile.name }</strong> (
										{ ( selectedFile.size / 1024 ).toFixed(
											2
										) }{ ' ' }
										KB)
									</div>
								) : (
									<div>
										<strong>
											{ __(
												'Choose Font File',
												'product-addons'
											) }
										</strong>
										<br />
										{ __(
											'or drag and drop here',
											'product-addons'
										) }
									</div>
								) }
							</div>
						</div>
						<div className="prad-help-message prad-mt-4">
							{ __(
								'Accepted formats: WOFF, WOFF2, TTF (Max: 10MB)',
								'product-addons'
							) }
						</div>
					</div>
				</div>

				<div className="prad-d-flex prad-gap-12 prad-mt-32">
					<Button
						value={
							uploading
								? __( 'Uploading…', 'product-addons' )
								: __( 'Upload Font', 'product-addons' )
						}
						onClick={ onUpload }
						background="primary"
						fontSize="14"
						className="prad-flex-grow"
						disable={ uploading }
					/>
					<Button
						value={ __( 'Cancel', 'product-addons' ) }
						onClick={ onClose }
						// background="error"
						// color="base9"
						fontSize="14"
						className="prad-flex-grow"
						style={ { color: 'black' } }
					/>
				</div>
			</div>
		</div>
	);
};

export default memo( FontUploadModal );
