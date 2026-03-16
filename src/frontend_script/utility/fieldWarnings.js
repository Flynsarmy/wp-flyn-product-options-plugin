import pradFrontendState from '../state';
const __ = wp?.i18n?.__ || ( ( text ) => text );
const sprintf =
	wp?.i18n?.sprintf ||
	( ( text, ...args ) => text.replace( /%[sd]/g, () => args.shift() ) );

const $ = jQuery;

const initFieldWarnings = () => {
	$( document ).on(
		'click',
		'form.cart .single_add_to_cart_button',
		function ( e ) {
			handleFormSubmission( e, 'addcart' );
		}
	);
	$( document ).on( 'submit', 'form.cart', function ( e ) {
		handleFormSubmission( e, 'submit' );
	} );

	$( document ).on( 'keydown', '.prad-parent input', function ( e ) {
		if ( e.key === 'Enter' || e.keyCode === 13 ) {
			if (
				$( this ).hasClass( 'prad-input' ) &&
				[ 'text', 'email', 'url', 'number', 'tel' ].includes(
					$( this ).attr( 'type' )
				)
			) {
				e.preventDefault();
				return false;
			}
		}
	} );
};

function handleFormSubmission( e ) {
	const reqWarnings = showReqWarnings( 'addcart' );
	if ( reqWarnings ) {
		e.preventDefault();
		e.stopImmediatePropagation();
		handleElessiAjax( reqWarnings );
		return false;
	}
	const hasWarnings = showMinMaxWarnings( 'addcart' );
	if ( hasWarnings ) {
		e.preventDefault();
		e.stopImmediatePropagation();
		handleElessiAjax( hasWarnings );
		return false;
	}
	return true;
}

function handleWoostifyTheme( type = 'add' ) {
	if ( type === 'add' ) {
		$( '.wp-theme-woostify .single_add_to_cart_button' ).addClass(
			'disabled prad-handle-woostify'
		);
	} else {
		$(
			'.wp-theme-woostify .single_add_to_cart_button.prad-handle-woostify'
		).removeClass( 'disabled prad-handle-woostify' );
	}
}

// Elessi Theme compatibility
function handleElessiAjax( _handler ) {
	if ( _handler ) {
		handleWoostifyTheme( 'add' );
		setTimeout( () => {
			handleWoostifyTheme( 'remove' );
		}, 200 );
	}
	if ( $( 'input[name="nasa-enable-addtocart-ajax"]' ).length ) {
		$( 'input[name="nasa-enable-addtocart-ajax"]' ).val( _handler ? 0 : 1 );
	}
	return false;
}

function showToasterAlert( message, type = 'warning' ) {
	// Remove any existing toaster
	$( '.prad-toaster-warning' ).remove();

	const toasterClass = `prad-toaster-warning prad-toaster-warning-${ type }`;

	// Detect RTL direction
	const isRTL =
		$( 'body' ).css( 'direction' ) === 'rtl' ||
		$( 'html' ).css( 'direction' ) === 'rtl';
	const translateDirection = isRTL ? 'translateX(-100%)' : 'translateX(100%)';
	const positionProperty = isRTL ? 'left: 20px;' : 'right: 20px;';

	const toaster = $(
		`<div class="${ toasterClass }" style="
			${ positionProperty }
			transform: ${ translateDirection };
			transition: transform 0.3s ease-in-out;
		">
			<div class="prad-toaster-waring-content">
				<div class="prad-toaster-waring-icon">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<path fill="#fff" fill-rule="evenodd" d="M9.62 3.63a2.74 2.74 0 0 1 4.76 0l8 14a2.75 2.75 0 0 1-2.37 4.12H3.99a2.75 2.75 0 0 1-2.37-4.12l8-14ZM11 9v4a1 1 0 1 0 2 0V9a1 1 0 1 0-2 0Zm0 7.5v.5a1 1 0 1 0 2 0v-.5a1 1 0 1 0-2 0Z" clip-rule="evenodd"/>
					</svg>
				</div>
				<div class="prad-toaster-waring-message">
				${ message }
				</div>
			</div>
		</div>`
	);

	$( 'body' ).append( toaster );

	// Animate in immediately using requestAnimationFrame for smooth animation
	requestAnimationFrame( () => {
		toaster.css( {
			transform: 'translateX(0)',
		} );
	} );

	setTimeout( () => {
		toaster.css( {
			opacity: '0',
			transform: `${ translateDirection } scale(0.95)`,
			transition: 'all 0.4s ease-in-out',
		} );
		setTimeout( () => {
			toaster.remove();
		}, 300 );
	}, 1500 );
}

const renderFieldWarning = () => {
	$( '.prad-parent' ).each( function () {
		const $this = $( this );
		const bid = $this.data( 'bid' );
		const bType = $this.data( 'btype' );
		const isRequired = $this.data( 'required' );

		if (
			[
				'checkbox',
				'img_switch',
				'color_switch',
				'button',
				'products',
			].includes( bType )
		) {
			const minSelect = $this.attr( 'data-minselect' );
			const maxSelect = $this.attr( 'data-maxselect' );
			if ( minSelect !== undefined || maxSelect !== undefined ) {
				pradFrontendState.updateMinMaxWarning( bid, {
					min: minSelect,
					max: maxSelect,
				} );
			}
		}

		if ( isRequired === 'yes' ) {
			pradFrontendState.addRequiredField( bid );
		}
	} );
};

function showReqWarnings( src = '' ) {
	if ( src === 'addcart' ) {
		$( '.prad-req-warning-message' ).remove();
		let hasWarnings = false;
		let showToast = false;

		pradFrontendState.getRequiredFields().forEach( function ( fieldKey ) {
			const $block = $( '.prad-parent[data-bid="' + fieldKey + '"]' );
			let message = pradFrontendState.getOptionPriceObjValue( fieldKey )
				? ''
				: __( 'This field is required', 'product-addons' );
			const parentSectionHidden = $block.closest(
				'.prad-parent.prad-section-block.prad-field-none'
			);

			if (
				$block.data( 'btype' ) === 'datetime' &&
				$block.data( 'field-variant' ) === 'datetime'
			) {
				const fieldValue =
					pradFrontendState.getOptionPriceObjValue( fieldKey );
				if (
					fieldValue &&
					( ! fieldValue.value?.date || ! fieldValue.value?.time )
				) {
					message = __( 'This field is required', 'product-addons' );
				}
			}

			if (
				$block.length &&
				message &&
				! $block.hasClass( 'prad-field-none' ) &&
				parentSectionHidden.length === 0
			) {
				if ( ! showToast && ! $( '.prad-toaster-warning' ).length ) {
					showToasterAlert(
						__(
							'Please fill all required fields',
							'product-addons'
						),
						'error'
					);
					showToast = true;
				}
				$block.addClass( 'prad-has-req-warning' );
				hasWarnings = true;
				const warningMsg = $(
					`<div class="prad-req-warning-message">${ message }. </div>`
				);
				$block.append( warningMsg.hide().fadeIn( 600 ) );
			}
		} );

		return hasWarnings;
	} else if ( src && pradFrontendState.getOptionPriceObjValue( src ) ) {
		const $block = $( '.prad-parent[data-bid="' + src + '"]' );
		$block.removeClass( 'prad-has-req-warning' );
		$block.find( '.prad-req-warning-message' ).remove();
	}
}

function showMinMaxWarnings( src = '' ) {
	if ( src === 'addcart' ) {
		$( '.prad-minmax-warning-message' ).remove();
		let hasWarnings = false;
		let showToast = false;
		for ( const key in pradFrontendState.minMaxWarnings ) {
			const { min, max } = pradFrontendState.minMaxWarnings[ key ];
			const targetValue =
				pradFrontendState.getOptionPriceObjValue( key )?.value || [];
			let message = '';

			if ( min && targetValue.length < min ) {
				message = sprintf(
					// translators: %d: Minimum number of options to select.
					__( 'Select at least %d options', 'product-addons' ),
					min
				);
			} else if ( max && targetValue.length > max ) {
				message = sprintf(
					// translators: %d: Maximum number of options to select.
					__( 'Select at most %d options', 'product-addons' ),
					max
				);
			}

			const $block = $( '.prad-parent[data-bid="' + key + '"]' );

			if (
				$block.length &&
				message &&
				! $block.hasClass( 'prad-field-none' )
			) {
				if (
					src === 'addcart' &&
					! showToast &&
					! $( '.prad-toaster-warning' ).length
				) {
					showToasterAlert(
						__( 'Please check selection limits', 'product-addons' ),
						'warning'
					);
					showToast = true;
				}
				hasWarnings = true;
				const warningMsg = $(
					`<div class="prad-minmax-warning-message">${ message }. </div>`
				);
				$block.append( warningMsg );
				setTimeout( function () {
					$block
						.find( '.prad-minmax-warning-message' )
						.addClass( 'prad-animate-waring' );
				}, 10 );
			}
		}
		return hasWarnings;
	} else if ( src && pradFrontendState.minMaxWarnings[ src ] ) {
		const { min, max } = pradFrontendState.minMaxWarnings[ src ];
		const targetValue =
			pradFrontendState.getOptionPriceObjValue( src )?.value || [];
		let message = '';

		if ( min && targetValue.length < min ) {
			message = sprintf(
				// translators: %d: Minimum number of options to select.
				__( 'Select at least %d options', 'product-addons' ),
				min
			);
		} else if ( max && targetValue.length >= max ) {
			message = sprintf(
				// translators: %d: Maximum number of options to select.
				__( 'Select at most %d options', 'product-addons' ),
				max
			);
		}

		const $parent = $( '.prad-parent[data-bid="' + src + '"]' );
		const bType = $parent.attr( 'data-btype' );
		let itemSelector = '.prad-swatch-item-wrapper';

		if ( bType === 'button' ) {
			itemSelector = '.prad-button-container';
		} else if ( bType === 'checkbox' ) {
			itemSelector = '.prad-checkbox-item-wrapper';
		}

		$parent.find( itemSelector ).each( function () {
			const $item = $( this );
			let pradActive = false;

			if ( bType === 'button' ) {
				pradActive = $item.hasClass( 'prad-active' );
			} else if ( bType === 'checkbox' ) {
				pradActive = $item
					.find( 'input[type="checkbox"]' )
					.is( ':checked' );
			} else {
				pradActive = $item
					.find( '.prad-swatch-container' )
					.hasClass( 'prad-active' );
			}

			$item.removeClass( 'prad-disabled' );

			if ( ! pradActive && max && targetValue.length >= max ) {
				$item.addClass( 'prad-disabled' );
			}
		} );
		const $block = $( '.prad-parent[data-bid="' + src + '"]' );
		$block.find( '.prad-minmax-warning-message' ).remove();
		if ( $block.length && message ) {
			const warningMsg = $(
				`<div class="prad-minmax-warning-message">${ message }. </div>`
			);

			$block.append( warningMsg );
			setTimeout( function () {
				$block
					.find( '.prad-minmax-warning-message' )
					.addClass( 'prad-animate-start' );
			}, 10 );
		}
	}
}

export const fieldWarning = {
	renderFieldWarning,
	initFieldWarnings,
	showReqWarnings,
	showMinMaxWarnings,
	handleFormSubmission,
};
