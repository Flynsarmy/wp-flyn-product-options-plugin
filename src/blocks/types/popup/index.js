import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ToolBar from '../../../dashboard/toolbar/ToolBar';

const PopUp = ( props ) => {
	const { settings } = props;
	const [ isOpen, setIsOpen ] = useState( false );
	const contentRef = useRef( null );

	const togglePopup = () => {
		setIsOpen( ! isOpen );
	};

	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		const controller = new AbortController();
		const { signal } = controller;

		function handleClickOutside( event ) {
			if (
				contentRef.current &&
				! contentRef.current.contains( event.target )
			) {
				setIsOpen( false );
			}
		}

		document.addEventListener( 'mousedown', handleClickOutside, {
			signal,
		} );

		return () => controller.abort();
	}, [ isOpen ] );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-parent prad-block-popup  prad-w-full prad-block-${ settings.blockid } ${ settings.class }  ` }
			>
				<div className="prad-block-popup-wrapper">
					<div
						className="prad-block-popup-header"
						onClick={ () => togglePopup() }
					>
						{ settings.label }
					</div>
					{ isOpen &&
						ReactDOM.createPortal(
							<div
								className={ `prad-block-popup-overlay ${
									isOpen ? 'active' : ''
								}` }
							>
								<div
									className={ `prad-block-popup-content-wrapper ${
										isOpen ? 'active' : ''
									}` }
									ref={ contentRef }
								>
									<div
										className="prad-block-popup-content-close"
										onClick={ () => setIsOpen( false ) }
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												fillRule="evenodd"
												d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25ZM8.707 7.293a1 1 0 0 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 1 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 0 0-1.414-1.414L12 10.586 8.707 7.293Z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div
										className="prad-block-popup-content prad-scrollbar prad-overflow-y-auto prad-overflow-x-hidden"
										dangerouslySetInnerHTML={ {
											__html: settings.popupContent || '',
										} }
									></div>
								</div>
							</div>,
							document.body
						) }
					<div className={ `prad-block-popup-content-wrapper` }>
						<div
							className="prad-block-popup-content prad-scrollbar prad-overflow-y-auto prad-overflow-x-hidden"
							dangerouslySetInnerHTML={ {
								__html: settings.popupContent || '',
							} }
						></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PopUp;
