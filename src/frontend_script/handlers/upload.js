import pradFrontendState from '../state';
import { fieldPrice } from '../utility/priceHandler';

const $ = jQuery;
export const initBlockUpload = () => {
	$( document ).ready( function () {
		$( '.prad-file-name' ).on( 'click', function () {
			handleFiles( [], $( this ) );
		} );
		$( document ).on( 'click', '.prad-btn-close', function () {
			const imgId = $( this ).attr( 'data-imgid' );
			const parentBid = $( this )
				.closest( '.prad-parent' )
				?.attr( 'data-bid' );

			if ( parentBid && pradFrontendState.optionPriceObj[ parentBid ] ) {
				pradFrontendState.optionPriceObj[ parentBid ].value =
					pradFrontendState.optionPriceObj[ parentBid ].value.filter(
						( item ) => item.id !== imgId
					);

				if (
					pradFrontendState.optionPriceObj[ parentBid ].value &&
					pradFrontendState.optionPriceObj[ parentBid ].value
						.length === 0
				) {
					pradFrontendState.deleteOptionPriceObj( parentBid );
				}
			}
			fieldPrice.updateOptionPrice( parentBid );
			$( this ).closest( '.prad-upload-item' ).remove();
		} );

		const dropZone = $( '.prad-drop-zone' );
		const fileInput = $( '.prad-upload-input' );

		dropZone.on( 'dragover', function ( event ) {
			event.preventDefault();
			event.stopPropagation();
			$( this ).addClass( 'prad-drag-over' );
		} );

		dropZone.on( 'dragleave', function ( event ) {
			event.preventDefault();
			event.stopPropagation();
			$( this ).removeClass( 'prad-drag-over' );
		} );

		dropZone.on( 'drop', function ( event ) {
			event.preventDefault();
			event.stopPropagation();
			$( this ).removeClass( 'prad-drag-over' );

			const files = event.originalEvent.dataTransfer.files;
			handleFiles( files, $( this ) );
		} );

		fileInput.on( 'change', function () {
			handleFiles( this.files, $( this ) );
		} );

		function handleFiles( files, that ) {
			if ( files.length === 0 ) {
				const bid = $( that )
					.closest( '.prad-parent' )
					?.attr( 'data-bid' );

				pradFrontendState.deleteOptionPriceObj( bid );
				fieldPrice.updateOptionPrice( bid );
				$( that )
					.closest( '.prad-parent' )
					.find( '.prad-file-name' )
					.removeClass( 'prad-file-active' )
					.html( '' );

				return;
			}

			const $parent = $( that ).closest( '.prad-parent' );
			const maxSize = $parent.attr( 'data-max_size' );
			const sizePrefix = $parent.attr( 'data-size_prefix' );
			const sizeError = $parent.attr( 'data-size_error' );

			const numberPrefix = $parent.attr( 'data-number_prefix' );
			const maxNumber = $parent.attr( 'data-max_number' );
			const numberError = $parent.attr( 'data-number_error' );
			let allowedTypes = $parent.attr( 'data-allowed' );
			allowedTypes = allowedTypes ? allowedTypes : [];

			const previewContainer = $parent.find( '.prad-upload-result' );

			[ ...files ]?.forEach( ( file, i ) => {
				const imageId = Math.random().toString( 36 ).substring( 2, 10 );
				const reader = new FileReader();
				const uploads =
					pradFrontendState.optionPriceObj[
						$parent.attr( 'data-bid' )
					]?.value;

				let sizeErrorMessage = '';
				const fileExtension = file.name
					.split( '.' )
					.pop()
					.toLowerCase();

				if ( maxSize * 1024 * 1024 < file.size ) {
					sizeErrorMessage = $( `
						<div class="prad-mt-8 prad-font-12">
							<div class="prad-upload-error-massage prad-block-error prad-mb-4">
								${ sizeError || 'File size exceeds maxsize' }
							</div>
							${
								sizePrefix
									? `<div class="prad-upload-error-condition prad-color-text-body">
										${ sizePrefix.replace( '[max_size]', `${ maxSize }MB` ) }
									</div>`
									: ''
							}
						</div>
					` );
				} else if ( ! allowedTypes?.includes( fileExtension ) ) {
					sizeErrorMessage = $( `
						<div class="prad-mt-8 prad-font-12">
							<div class="prad-upload-error-massage prad-block-error prad-mb-4">
								File type is not allowed. Allowed types: ${
									typeof allowedTypes === 'string'
										? allowedTypes
										: allowedTypes?.join( ', ' )
								}
							</div>
						</div>
					` );
				} else if (
					i + 1 > maxNumber ||
					uploads?.length >= maxNumber
				) {
					sizeErrorMessage = $( `
						<div class="prad-font-12">
							<div class="prad-upload-error-massage prad-block-error prad-mb-4">
								${ numberError || 'Number exceeds the maximum allowed' }
							</div>
							${
								numberPrefix
									? `
								<div class="prad-upload-error-condition prad-color-text-body">
									${ numberPrefix.replace( '[max_files]', maxNumber ) }
								</div>
							`
									: ''
							}
						</div>
					` );
				}

				const progress = $(
					`<progress data-imgid=${ imageId } class="prad-upload-item-progress prad-progress-custom" value="5" max="100"></progress>`
				);

				reader.onload = function ( event ) {
					const contentPreview = file.type.startsWith( 'image/' )
						? $( `
							<div class="prad-upload-item-image">
								<img
									style="width: 64px; height: 64px;max-width: none;"
									src="${ event.target.result }"
									alt="file preview"
									class="prad-br-sm"
								/>
							</div>
						` )
						: '';

					const fileItem = $( `
						<div class="prad-upload-item">
							<div class="prad-d-flex prad-item-center prad-gap-4 prad-lh-0">
								<div data-imgid=${ imageId } class="prad-upload-item-close prad-btn-close" role="button" tabIndex="-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="none"
										viewBox="0 0 20 20"
									>
										<path stroke="currentColor" d="M15 5 5 15M5 5l10 10" />
									</svg>
								</div>
								${ contentPreview[ 0 ]?.outerHTML || '' }
							</div>
							<div class="prad-w-full">
								<div class="prad-d-flex prad-item-center prad-justify-between prad-gap-8 prad-font-14 prad-lh-extra">
									<div class="prad-upload-item-name prad-color-text-dark">${ file.name }</div>
									<div class="prad-upload-item-size prad-text-upper ${
										maxSize * 1024 * 1024 < file.size
											? 'prad-block-error'
											: 'prad-color-text-dark'
									}">${ formatFileSize( file.size ) }</div>
								</div>
								<div class="prad-upload-size-error"></div>
								<div class="prad-upload-progress"></div>
							</div>
						</div>
					` );

					// Append either the error message or the progress bar
					if ( sizeErrorMessage ) {
						fileItem
							.find( '.prad-upload-size-error' )
							.append( sizeErrorMessage );
					} else {
						fileItem
							.find( '.prad-upload-progress' )
							.append( progress );
					}

					previewContainer.append( fileItem );
				};

				reader.readAsDataURL( file );

				$( that )
					.closest( '.prad-parent' )
					.find( '.prad-file-name' )
					.addClass( 'prad-file-active' );
				$( that )
					.closest( '.prad-parent' )
					.find( '.prad-file-name' )
					.html( file.name );

				if ( sizeErrorMessage ) {
					return;
				}

				const formData = new FormData();
				formData.append( 'prad_file', file );
				formData.append( 'pradnonce', prad_option_front.nonce );

				// Show Progressbar
				let currentValue = 5;
				const interval = setInterval( function () {
					if ( currentValue < 80 ) {
						currentValue += 2;
						progress.val( currentValue );
					} else {
						clearInterval( interval );
					}
				}, 100 );

				wp.apiFetch( {
					path: '/prad/upload-file',
					method: 'POST',
					body: formData,
				} )
					.then( ( response ) => {
						if ( response.success ) {
							clearInterval( interval );
							const newinterval = setInterval( function () {
								if ( currentValue < 100 ) {
									currentValue += 5;
									progress.val( currentValue );
								} else {
									clearInterval( newinterval );
								}
							}, 10 );
							const _data = {
								type: 'upload',
								label: $parent.attr( 'data-label' ),
								optionid: $parent
									.closest( '.prad-blocks-container' )
									.attr( 'data-optionid' ),
								sectionid: $parent.attr( 'data-sectionid' ),
								value: [
									...( pradFrontendState.optionPriceObj[
										$parent.attr( 'data-bid' )
									]?.value || [] ),
									{
										name: file.name,
										id: imageId,
										path: response?.data?.file?.url ?? '',
									},
								],
								cost: fieldPrice.calculatePriceTypeBaseCost( {
									pType: $parent.attr( 'data-ptype' ),
									value: {
										name: file.name,
										path: response?.data?.file?.url ?? '',
									},
									cost: Number( $parent.attr( 'data-val' ) ),
								} ),
							};
							fieldPrice.updateOptionPriceObj(
								$parent.attr( 'data-bid' ),
								_data
							);
						} else {
							// eslint-disable-next-line no-console
							console.error(
								'Upload failed:',
								response.data.message
							);
						}
					} )
					.catch( ( error ) => {
						// eslint-disable-next-line no-console
						console.error( 'Error:', error );
					} )
					.finally( () => {
						$( that ).val( '' );
					} );
			} );
		}
	} );
};

function formatFileSize( size ) {
	if ( size < 1024 ) {
		return `${ size } B`; // Bytes
	} else if ( size < 1024 * 1024 ) {
		return `${ ( size / 1024 ).toFixed( 2 ) } KB`; // Kilobytes
	}
	return `${ ( size / ( 1024 * 1024 ) ).toFixed( 2 ) } MB`; // Megabytes
}
