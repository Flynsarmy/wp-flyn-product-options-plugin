import { useEffect, useState } from 'react';
import Icons from '../Icons';

const Toast = ( { delay, toastMessages, setToastMessages } ) => {
	const [ visible, setVisible ] = useState( true );
	const [ show, setShow ] = useState( 'prad-show' );

	const deleteMessage = ( idx ) => {
		let copy = [ ...toastMessages.messages ];
		copy = copy.filter( ( row, index ) => {
			return index !== idx;
		} );
		setToastMessages( {
			...toastMessages,
			messages: copy,
		} );
	};

	useEffect( () => {
		const timer = setTimeout( () => {
			setVisible( false );
			setShow( '' );
			setToastMessages( {
				state: false,
				status: '',
			} );
		}, delay );
		return () => clearTimeout( timer );
	}, [ delay ] );

	return (
		<div className="prad-toast">
			{ visible &&
				toastMessages.status &&
				toastMessages.messages.length > 0 && (
					<div className="prad-toastMessages">
						{ toastMessages.messages.map( ( message, index ) => {
							return (
								<span
									key={ `toast_${ Date.now().toString() }_${ index }` }
								>
									<div className={ `prad-toaster ${ show }` }>
										<span>
											{ toastMessages.status ===
											'error' ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 52 52"
													className="prad-animation"
												>
													<circle
														cx="26"
														cy="26"
														r="25"
														fill="none"
														className="prad-circle prad-cross"
													></circle>
													<path
														fill="none"
														d="M 12,12 L 40,40 M 40,12 L 12,40"
														className="prad-check"
													></path>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 52 52"
													className="prad-animation"
												>
													<circle
														className="prad-circle"
														cx="26"
														cy="26"
														r="25"
														fill="none"
													/>
													<path
														className="prad-check"
														fill="none"
														d="M14.1 27.2l7.1 7.2 16.7-16.8"
													/>
												</svg>
											) }
										</span>
										<span className="itmCenter">
											{ message }
										</span>
										<span
											className="itmLast prad-btn-close"
											onClick={ () =>
												deleteMessage( index )
											}
											role="button"
											tabIndex="-1"
											onKeyDown={ ( e ) => {
												if ( e.key === 'Enter' ) {
													deleteMessage( index );
												}
											} }
										>
											{ Icons.cross_20 }
										</span>
									</div>
								</span>
							);
						} ) }
					</div>
				) }
		</div>
	);
};

export default Toast;
