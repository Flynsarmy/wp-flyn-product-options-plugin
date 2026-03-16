import { useEffect, useRef, useState } from 'react';
import ToolBar from '../../../dashboard/toolbar/ToolBar';
import Icons from '../../../utils/Icons';
import Label from '../../helper/fields/Label';
import { useAddons } from '../../../context/AddonsContext';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';

const Section = ( props ) => {
	const { settings, children } = props;
	const [ openAccordions, setOpenAccordions ] = useState( {
		[ settings.blockid ]: true,
	} );
	const [ elementHeight, setElementHeight ] = useState( 0 );

	const contentRef = useRef( null );
	const { draggData } = useAddons();

	const toggleAccordion = ( key ) => {
		setOpenAccordions( ( prevState ) => ( {
			...prevState,
			[ key ]: ! prevState[ key ],
		} ) );
	};

	useEffect( () => {
		const abortControl = new AbortController();
		const updateHeight = () => {
			if ( openAccordions[ settings.blockid ] ) {
				setElementHeight(
					contentRef.current?.scrollHeight +
						contentRef.current?.offsetHeight
				);
			}
		};

		window.addEventListener( 'resize', updateHeight, {
			signal: abortControl.signal,
		} );
		updateHeight();
		setTimeout( () => updateHeight(), 700 );

		return () => abortControl.abort();
	}, [ openAccordions, settings.blockid, children ] );

	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-section-wrapper prad-w-full prad-block-${
					settings.blockid
				} ${ settings.class } ${
					draggData.type === 'blocks' &&
					draggData.id === settings.blockid
						? 'prad-section-dragging'
						: ''
				}` }
			>
				<div
					className={ `prad-section-header prad-accordion-header prad-cursor-${
						settings.showAccordion === true ? 'pointer' : 'default'
					} prad-section-head-${
						settings.showAccordion || ! settings.hide
							? 'active'
							: 'inactive'
					}` }
					onClick={ ( e ) =>
						settings.showAccordion === true
							? toggleAccordion( settings.blockid )
							: e.preventDefault()
					}
					role="button"
					tabIndex="-1"
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' ) {
							return settings.showAccordion === true
								? toggleAccordion( settings.blockid )
								: e.preventDefault();
						}
					} }
				>
					{ settings.hide === false && (
						<div className="prad-section-title">
							<div className="prad-d-flex prad-gap-10 prad-item-center">
								<Label
									editAble={ true }
									noSpace={ true }
									{ ...props }
								/>
								{ blockObject.renderDescriptionTooltip() }
							</div>
							{ blockObject.renderDescriptionBelowTitle() }
						</div>
					) }
					{ settings.hide && settings.showAccordion && <div></div> }
					{ settings.showAccordion === true && (
						<div className={ `prad-section-accordion` }>
							<div
								className={ `prad-accordion-icon prad-${
									openAccordions[ settings.blockid ]
										? 'active'
										: 'inactive'
								}` }
							>
								{ Icons.angleDown }
							</div>
						</div>
					) }
				</div>
				<div
					ref={ contentRef }
					className={ `prad-section-body ${
						settings.showAccordion || ! settings.hide
							? 'prad-block-border-top'
							: ''
					} prad-${
						openAccordions[ settings.blockid ]
							? 'active'
							: 'inactive'
					}` }
					style={ {
						maxHeight: openAccordions[ settings.blockid ]
							? `${ elementHeight }px`
							: '0',
					} }
				>
					<div className="prad-section-container">{ children }</div>
				</div>
			</div>
		</>
	);
};

export default Section;
