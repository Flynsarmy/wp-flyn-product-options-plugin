import ToolBar from '../../../dashboard/toolbar/ToolBar';
import { useState, useEffect } from 'react';
import { getPriceHtml } from '../../../utils/Utils';
import { useAbstractBlock } from '../../block_helper/useAbstractBlock';
import icons from '../../../utils/Icons';
import { useEditor } from '../../../context/EditorContext';
import FontStyles from '../../../dashboard/fonts/components/FontStyles';
const { __ } = wp.i18n;

const FontPicker = ( props ) => {
	const { customFonts } = useEditor();
	const { settings } = props;
	const [ isOpen, setIsOpen ] = useState( false );

	const generateLabel = ( item ) => {
		const currentFont = findCurrentFont( item?.fontFamily );
		const label =
			currentFont.title || __( 'Unknown Font', 'product-addons' );

		return (
			<div className="prad-d-flex prad-item-center prad-gap-8">
				<div
					className="prad-block-content prad-d-flex prad-item-center"
					style={ { fontFamily: `"${ currentFont.family }"` } }
				>
					<div className="prad-ellipsis-2" title={ label }>
						{ label }
					</div>
				</div>
				{ item?.type !== 'no_cost' && (
					<div className="prad-block-price prad-text-upper">
						{ getPriceHtml( {
							regular: item?.regular,
							sale: item?.sale,
							type: item?.type,
						} ) }
					</div>
				) }
			</div>
		);
	};

	const findCurrentFont = ( fontId ) => {
		const font = customFonts.find( ( f ) => f.id === fontId ) || {};
		return font;
	};

	const [ selected, setSelected ] = useState(
		settings.defval &&
			( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
			? generateLabel( settings._options[ settings.defval[ 0 ] ] )
			: __( 'Select Font', 'product-addons' )
	);

	useEffect( () => {
		setSelected(
			settings.defval &&
				( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
				? generateLabel( settings._options[ settings.defval[ 0 ] ] )
				: __( 'Select Font', 'product-addons' )
		);
	}, [ settings.defval, settings._options, customFonts ] );

	useEffect( () => {
		if (
			settings.defval &&
			( settings.defval[ 0 ] || settings.defval[ 0 ] === 0 )
		) {
			const currentObj = settings._options[ settings.defval[ 0 ] ];
			handleFontsEffect( currentObj );
		}
	}, [ settings.defval ] );

	const handleFontsEffect = ( currentObj ) => {
		const currentFont = findCurrentFont( currentObj?.fontFamily );

		if ( ! settings.toApplyFields?.length || ! currentFont?.family ) {
			return;
		}

		const sanitizedFont = currentFont.family.replace(
			/^['"]+|['"]+$/g,
			''
		);
		const cssFont = `"${ sanitizedFont }"`;

		settings.toApplyFields.forEach( ( _id ) => {
			const parentField = document.querySelector(
				`.prad-block-${ _id }`
			);
			if ( ! parentField ) {
				return;
			}

			const input =
				parentField.querySelector( 'input[type="text"]' ) ||
				parentField.querySelector( 'textarea' );

			if ( input ) {
				input.style.fontFamily = cssFont;
			}
		} );
	};

	const blockObject = useAbstractBlock( settings, { ...props } );

	return (
		<>
			<ToolBar { ...props } />
			<div
				id={ `prad-bid-${ settings.blockid }` }
				className={ `prad-block-font_picker prad-w-full prad-block-${ settings.blockid } ${ settings.class }` }
			>
				{ blockObject.renderTitleDescriptionNoPrice() }
				<FontStyles fonts={ customFonts } />
				<div className="prad-custom-select prad-w-full">
					<div
						className={ `prad-select-box prad-block-input prad-block-content prad-select-${
							isOpen ? 'open' : 'close'
						}` }
						onClick={ () => setIsOpen( ! isOpen ) }
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								setIsOpen( ! isOpen );
							}
						} }
					>
						{ selected }
						<div className="prad-icon">{ icons.angleDown }</div>
					</div>
					<div
						className="prad-select-options"
						style={ { display: isOpen ? 'block' : 'none' } }
					>
						{ settings._options.map( ( item, i ) => (
							<div
								key={ i }
								className="prad-select-option"
								onClick={ () => {
									setIsOpen( ! isOpen );
									setSelected( generateLabel( item ) );
									handleFontsEffect( item );
								} }
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' ) {
										setIsOpen( ! isOpen );
									}
								} }
							>
								{ generateLabel( item ) }
							</div>
						) ) }
					</div>
				</div>
				{ blockObject.renderDescriptionBelowField() }
			</div>
		</>
	);
};

export default FontPicker;
