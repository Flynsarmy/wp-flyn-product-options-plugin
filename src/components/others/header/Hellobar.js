import { useState } from 'react';
import UTMLinkGenerator from '../../../utils/utm_link';
const { __ } = wp.i18n;

const Hellobar = () => {
	const [ helloBar, setHelloBar ] = useState( pradBackendData.helloBar );

	const helloBarAction = ( duration ) => {
		setHelloBar( 'hide' );
		wp.apiFetch( {
			path: '/prad/hello_bar',
			method: 'POST',
			data: { type: 'hello_bar', duration },
		} );
	};

	if ( helloBar === 'hide' || pradBackendData.isActive ) {
		return null;
	}

	const helloBarNotice = [
		{
			title: __( 'Booming Black Friday Deals:', 'product-addons' ),
			subtitle: __( 'Enjoy', 'product-addons' ),
			offer: __( 'up to 65% OFF', 'product-addons' ),
			product: __( 'on WowAddons Pro -', 'product-addons' ),
			link_text: __( 'Get it Now!', 'product-addons' ),
			utmKey: 'final_hour_sale',
			startDate: new Date( '2025-11-05' ),
			endDate: new Date( '2025-12-10' ),
		},
	];

	const activeNotice = helloBarNotice.find( ( notice ) => {
		const now = new Date();
		return now >= notice.startDate && now <= notice.endDate;
	} );

	let durationSeconds = 0;
	if ( activeNotice ) {
		const now = new Date();
		durationSeconds = Math.floor( ( activeNotice.endDate - now ) / 1000 );
	}

	return (
		<div>
			<style>
				{ `.prad-setting-hellobar {
                    background: #86a62c;
                    padding: 6px 0;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 14px;
                }

                .prad-setting-hellobar a {
                    margin-left: 4px;
                    font-weight: 700;
                    font-size: 14px;
                    color: #fff;
                }

                .prad-setting-hellobar strong {
                    color: #fff;
                    font-weight: 700;
                }
                .prad-ring {
                    -webkit-animation: ring 4s .7s ease-in-out infinite;
                    -moz-animation: ring 4s .7s ease-in-out infinite;
                    animation: ring 4s .7s ease-in-out infinite;
                    margin-right: 5px;
                    font-size: 20px;
                    position: relative;
                    top: 2px;
                    color: #fff;
                }
                .helobarClose {
                    position: absolute;
                    cursor: pointer;
                    right: 15px;
                    svg {
                        height: 16px;
                        color: #fff;
                    }
                }
                @keyframes ring {
                    0% { transform: rotate(0); }
                    1% { transform: rotate(30deg); }
                    3% { transform: rotate(-28deg); }
                    5% { transform: rotate(34deg); }
                    7% { transform: rotate(-32deg); }
                    9% { transform: rotate(30deg); }
                    11% { transform: rotate(-28deg); }
                    13% { transform: rotate(26deg); }
                    15% { transform: rotate(-24deg); }
                    17% { transform: rotate(22deg); }
                    19% { transform: rotate(-20deg); }
                    21% { transform: rotate(18deg); }
                    23% { transform: rotate(-16deg); }
                    25% { transform: rotate(14deg); }
                    27% { transform: rotate(-12deg); }
                    29% { transform: rotate(10deg); }
                    31% { transform: rotate(-8deg); }
                    33% { transform: rotate(6deg); }
                    35% { transform: rotate(-4deg); }
                    37% { transform: rotate(2deg); }
                    39% { transform: rotate(-1deg); }
                    41% { transform: rotate(1deg); }
                    43% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }` }
			</style>
			<div>
				{ activeNotice && (
					<div className="prad-setting-hellobar">
						<span className="dashicons dashicons-bell prad-ring"></span>
						{ activeNotice.title } { activeNotice.subtitle }{ ' ' }
						<strong>{ activeNotice.offer }</strong>{ ' ' }
						{ activeNotice.product }{ ' ' }
						<a
							href={ UTMLinkGenerator( {
								utmKey: activeNotice.utmKey,
								hash: 'pricing',
							} ) }
							target="_blank"
							rel="noreferrer"
						>
							{ activeNotice.link_text } &nbsp; &#10148;
						</a>
						<button
							type="button"
							className="helobarClose"
							onClick={ () => helloBarAction( durationSeconds ) }
							aria-label={ __(
								'Close notification',
								'product-addons'
							) }
							style={ {
								background: 'none',
								border: 'none',
								padding: 0,
								cursor: 'pointer',
							} }
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									d="M15 5 5 15M5 5l10 10"
								/>
							</svg>
						</button>
					</div>
				) }
			</div>
		</div>
	);
};

export default Hellobar;
