import { memo } from 'react';
import Button from '../../components/Button';
import Toast from '../../utils/toaster/Toast';
import FontEditModal from './components/FontEditModal';
import FontList from './components/FontList';
import FontStyles from './components/FontStyles';
import FontUploadModal from './components/FontUploadModal';
import useFontManager from './hooks/useFontManager';
import './style.scss';

const { __ } = wp.i18n;

const CustomFonts = () => {
	const {
		loading,
		fonts,
		uploading,
		deletingId,
		showUploadModal,
		showEditModal,
		fontTitle,
		fontFamily,
		selectedFile,
		toastMessages,
		fileInputRef,
		setShowUploadModal,
		setFontTitle,
		setFontFamily,
		setToastMessages,
		handleFileSelect,
		handleUpload,
		handleEdit,
		handleUpdate,
		handleDelete,
		closeModal,
		closeEditModal,
	} = useFontManager();

	return (
		<>
			<div className="prad-container prad-plr-32 prad-d-flex prad-justify-between prad-item-center prad-mb-24 prad-mt-32">
				<div className="prad-font-24 prad-font-semi">
					{ __( 'Custom Fonts', 'product-addons' ) }
				</div>
				<Button
					value={ __( 'Add New Font', 'product-addons' ) }
					onClick={ () => setShowUploadModal( true ) }
					background="primary"
					iconName="IconPlus"
					iconPosition="before"
					fontSize="14"
				/>
			</div>
			<div className="prad-fonts-page flynpo-dashboard prad-container prad-mlg-plr-16 prad-plr-32 prad-mt-40">
				<div className="prad-w-full">
					<FontList
						fonts={ fonts }
						loading={ loading }
						deletingId={ deletingId }
						onEditFont={ handleEdit }
						onDeleteFont={ handleDelete }
					/>

					{ toastMessages.state && (
						<Toast
							delay={ 3000 }
							toastMessages={ toastMessages }
							setToastMessages={ setToastMessages }
						/>
					) }
				</div>

				<FontUploadModal
					isOpen={ showUploadModal }
					onClose={ closeModal }
					fontTitle={ fontTitle }
					setFontTitle={ setFontTitle }
					fontFamily={ fontFamily }
					setFontFamily={ setFontFamily }
					selectedFile={ selectedFile }
					onFileSelect={ handleFileSelect }
					uploading={ uploading }
					onUpload={ handleUpload }
					fileInputRef={ fileInputRef }
				/>

				<FontEditModal
					isOpen={ showEditModal }
					onClose={ closeEditModal }
					fontTitle={ fontTitle }
					setFontTitle={ setFontTitle }
					fontFamily={ fontFamily }
					setFontFamily={ setFontFamily }
					uploading={ uploading }
					onUpdate={ handleUpdate }
				/>

				<FontStyles fonts={ fonts } />
			</div>
		</>
	);
};

export default memo( CustomFonts );
