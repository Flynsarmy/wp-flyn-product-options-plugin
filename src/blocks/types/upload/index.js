const { __ } = wp.i18n;
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import icons from '../../../utils/Icons';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Upload = ( props ) => {
	const { settings } = props;

	const sizeErrorStatus = [ false, true, false ];

	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-upload prad-w-full ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionPriceWithPosition() }
				<div className="prad-upload-wrapper">
					<div className="">
						<div className="prad-block-upload-title prad-d-flex prad-item-center prad-gap-4 prad-w-full">
							{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
							<label
								className="prad-disable prad-m-0 prad-cursor-pointer prad-upload-container prad-drop-zone prad-w-full"
								htmlFor={ `prad_block_upload_${ settings.blockid }` }
							>
								<div className="prad-d-flex prad-item-center prad-gap-12">
									<div className="prad-block-upload-icon prad-d-flex prad-item-center prad-gap-6">
										<svg
											width="20"
											height="20"
											viewBox="0 0 20 20"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M4.86323 8.44885C3.02865 8.8851 1.66406 10.5347 1.66406 12.5026C1.66406 14.8039 3.52948 16.6693 5.83073 16.6693C6.22531 16.6693 6.6074 16.6143 6.96948 16.5118M15.0203 8.44885C16.8549 8.8851 18.2191 10.5347 18.2191 12.5026C18.2191 14.8039 16.3536 16.6693 14.0524 16.6693C13.6578 16.6693 13.2757 16.6143 12.9141 16.5118M14.9974 8.33594C14.9974 5.57469 12.7586 3.33594 9.9974 3.33594C7.23615 3.33594 4.9974 5.57469 4.9974 8.33594M7.10781 11.6197L9.9974 8.72094L12.9691 11.6693M9.9974 15.8359C9.9974 15.8359 9.9974 11.9813 9.9974 9.77844"
												stroke="white"
												strokeWidth="1.04167"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>

										<div>
											{ settings.uploadText ||
												__(
													'Upload',
													'product-addons'
												) }
										</div>
									</div>
									<div className="prad-block-upload-text prad-block-upload-title">
										<input
											id={ `prad_block_upload_${ settings.blockid }` }
											className="prad-input-hidden"
											type="file"
										/>
										<div>
											{ settings.dragDropText ||
												__(
													'Click or drag and drop',
													'product-addons'
												) }
										</div>
									</div>
								</div>
							</label>
						</div>
					</div>
					<div className="prad-upload-result">
						<div className="prad-upload-item">
							<div className="prad-d-flex prad-item-center prad-gap-4 prad-lh-0">
								<div
									className="prad-upload-item-close prad-btn-close prad-border-none"
									role="button"
									tabIndex="-1"
								>
									{ icons.cross }
								</div>
								<div className="prad-upload-item-image">
									<img
										style={ {
											width: '64px',
											height: '64px',
											maxWidth: 'none',
										} }
										src={
											pradBackendData.url +
											'assets/img/default-product.svg' // use upload file image, if there is no image than this default image will be shown
										}
										alt="empty cart"
										className="prad-br-sm"
									/>
								</div>
							</div>
							<div className="prad-w-full">
								<div className="prad-d-flex prad-item-center prad-justify-between prad-gap-8 prad-font-14 prad-lh-extra">
									<div className="prad-upload-item-name prad-color-text-dark">
										{ __(
											'Uploaded product name',
											'product-addons'
										) }
									</div>
									{ /* uploaded file size */ }
									<div
										className={ `prad-upload-item-size prad-text-upper ${
											sizeErrorStatus[ 0 ]
												? 'prad-block-error'
												: 'prad-color-text-dark'
										}` }
									>
										0.200 MB
									</div>
								</div>
								{ ! sizeErrorStatus[ 0 ] && ( // use index of the upload file instead of 0
									<progress
										className="prad-upload-item-progress prad-progress-custom"
										value={ 50 }
										max="100"
									/>
								) }
								{ sizeErrorStatus[ 0 ] && ( // use index of the upload file instead of 0
									<div className="prad-upload-error-size prad-mt-8 prad-font-12">
										<div className="prad-upload-error-massage prad-block-error prad-mb-4">
											{ settings.sizeError }
										</div>
										{ settings.sizePrefix && (
											<div className="prad-upload-error-condition prad-color-text-body">
												{ settings.sizePrefix.replace(
													'[max_size]',
													`${ settings.maxSize }MB`
												) }
											</div>
										) }
									</div>
								) }
							</div>
						</div>
						<div className="prad-upload-item">
							<div className="prad-d-flex prad-item-center prad-gap-4 prad-lh-0">
								<div className="prad-btn-close prad-border-none prad-upload-item-close">
									{ icons.cross }
								</div>
								<div className="prad-upload-item-image">
									<img
										style={ {
											width: '64px',
											height: '64px',
											maxWidth: 'none',
										} }
										src={
											pradBackendData.url +
											'assets/img/default-product.svg' // use upload file image, if there is no image than this default image will be shown
										}
										alt="empty cart"
										className="prad-br-sm"
									/>
								</div>
							</div>
							<div className="prad-w-full">
								<div className="prad-d-flex prad-item-center prad-justify-between prad-gap-8 prad-font-14 prad-lh-extra">
									<div className="prad-color-text-dark">
										{ __(
											'Uploaded product name',
											'product-addons'
										) }
									</div>
									<div
										className={ `prad-text-upper ${
											sizeErrorStatus[ 1 ]
												? 'prad-block-error'
												: 'prad-color-text-dark'
										}` }
									>
										{ Number( settings.maxSize ) + 5 }
										MB
									</div>
								</div>
								{ ! sizeErrorStatus[ 1 ] && ( // use index of the upload file instead of 0
									<progress
										className="prad-upload-item-progress prad-progress-custom"
										value={ 50 }
										max="100"
									/>
								) }
								{ sizeErrorStatus[ 1 ] && ( // use index of the upload file instead of 0
									<div className="prad-upload-error-size prad-mt-8 prad-font-12">
										<div className="prad-upload-error-massage prad-block-error prad-mb-4">
											{ settings.sizeError }
										</div>
										{ settings.sizePrefix && (
											<div className="prad-upload-error-condition prad-color-text-body">
												{ settings.sizePrefix.replace(
													'[max_size]',
													`${ settings.maxSize }MB`
												) }
											</div>
										) }
									</div>
								) }
							</div>
						</div>
					</div>
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default Upload;
