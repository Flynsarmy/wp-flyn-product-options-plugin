document.addEventListener( 'DOMContentLoaded', function () {
	const $ = jQuery;
	const __ = wp?.i18n?.__ || ( ( text ) => text );

	const moreText = __( 'Show More', 'product-addons' );
	const lessText = __( 'Show Less', 'product-addons' );

	function runCartStyles() {
		// Handle both <dl> and <ul> cases
		const selectors = [
			'dl.variation',
			'ul.wc-block-components-product-details',
			'ul.wc-item-meta',
		];

		$( selectors.join( ',' ) ).each( function () {
			const container = this;
			const $container = $( container );

			// Prevent double processing
			if ( $container.hasClass( 'prad-processed' ) ) {
				return;
			}
			$container.addClass( 'prad-processed' );

			let items = [];

			if ( container.tagName.toLowerCase() === 'dl' ) {
				// Group dt/dd pairs
				const children = Array.from( container.children );
				for ( let i = 0; i < children.length; i += 2 ) {
					const pair = children.slice( i, i + 2 );
					if ( pair.length === 2 ) {
						items.push( pair );
					}
				}
			} else if ( container.tagName.toLowerCase() === 'ul' ) {
				// Each <li> is a separate item
				items = Array.from( container.children ).map( function ( li ) {
					return [ li ];
				} );
			}

			if ( items.length > 3 ) {
				// Wrap the container if not already wrapped
				if (
					! $container.parent().hasClass( 'prad-variation-container' )
				) {
					$container.wrap(
						'<div class="prad-variation-container"></div>'
					);
				}

				// Measure expanded height first
				$container.css( 'max-height', 'none' );
				const expandedHeight = $container.outerHeight();

				// Hide extra items
				for ( let i = 3; i < items.length; i++ ) {
					items[ i ].forEach( function ( element ) {
						element.classList.add( 'prad-collapsed-hidden' );
					} );
				}

				// Measure collapsed height
				const collapsedHeight = $container.outerHeight();

				// Set initial collapsed state
				$container.css( {
					'max-height': collapsedHeight,
					transition: 'max-height 0.4s ease',
				} );

				// Create toggle button
				const $toggle = $(
					'<div class="prad-show-more-btn">' + moreText + '</div>'
				);
				$toggle.css( 'padding-left', $container.css( 'padding-left' ) );

				// Store expanded state
				let isExpanded = false;

				$container.parent().append( $toggle );

				$toggle.on( 'click', function ( e ) {
					e.stopPropagation();

					if ( ! isExpanded ) {
						// Expand
						items.forEach( function ( itemGroup ) {
							itemGroup.forEach( function ( element ) {
								element.classList.remove(
									'prad-collapsed-hidden'
								);
							} );
						} );
						$container.css( 'max-height', expandedHeight );
						$toggle.text( lessText );
						isExpanded = true;
					} else {
						// Collapse
						$container.css( 'max-height', collapsedHeight );
						$toggle.text( moreText );
						isExpanded = false;

						// After transition, hide again
						const onTransitionEnd = function () {
							if ( ! isExpanded ) {
								for ( let i = 3; i < items.length; i++ ) {
									items[ i ].forEach( function ( element ) {
										element.classList.add(
											'prad-collapsed-hidden'
										);
									} );
								}
							}
							container.removeEventListener(
								'transitionend',
								onTransitionEnd
							);
						};

						container.addEventListener(
							'transitionend',
							onTransitionEnd
						);
					}
				} );
			}
		} );
	}

	// Set initial opacity low
	$( document )
		.find( '.variation, .wc-block-components-product-details' )
		.css( 'opacity', 0.3 );

	// Run collapsing behavior
	runCartStyles();

	// Restore opacity after initial setup
	setTimeout( function () {
		$( document )
			.find( '.variation, .wc-block-components-product-details' )
			.css( 'opacity', 1 );
	}, 300 );

	// General MutationObserver for dynamic WooCommerce changes
	const observerTargets = [
		'.woocommerce-checkout-review-order',
		'.woocommerce-cart-form',
		'.woocommerce',
		'body', // <- last resort
	];

	observerTargets.forEach( function ( selector ) {
		const $target = $( selector );

		if ( $target.length > 0 ) {
			const observer = new MutationObserver( function ( mutations ) {
				let shouldRun = false;

				mutations.forEach( function ( mutation ) {
					if (
						mutation.addedNodes.length > 0 ||
						mutation.type === 'childList'
					) {
						shouldRun = true;
					}
				} );

				if ( shouldRun ) {
					setTimeout( runCartStyles, 50 );
				}
			} );

			const config = { childList: true, subtree: true };
			observer.observe( $target[ 0 ], config );
		}
	} );
} );
