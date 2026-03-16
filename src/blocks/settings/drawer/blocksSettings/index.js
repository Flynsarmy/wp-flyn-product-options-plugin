const { __ } = wp.i18n;
import { useState, useEffect, useRef } from 'react';
import TabContainer from '../../../../components/TabContainer';
import Conditions from './conditions';
import { findBlockItem, updateBlockAttr } from '../../../../utils/Utils';
import Button from '../../../../components/Button';
import BlockGeneralSettings from './general';
import BlockStyles from './styles';
import { useAddons } from '../../../../context/AddonsContext';
import icons from '../../../../utils/Icons';

const BlockSettingsDrawer = () => {
	const wrapperRef = useRef( null );
	const containerRef = useRef( null );

	const [ currentTab, setCurrentTab ] = useState( 'general' );
	const { selectedBlock, updateDrawer, fieldData, updateFieldData } =
		useAddons();

	useEffect( () => {
		if ( wrapperRef.current ) {
			wrapperRef.current.style.setProperty(
				'padding-right',
				'8px',
				'important'
			);
		}
		if ( containerRef.current ) {
			containerRef.current.style.setProperty(
				'padding-bottom',
				'100px',
				'important'
			);
		}
	}, [] );

	useEffect( () => {
		setCurrentTab( 'general' );
	}, [ selectedBlock ] );

	const currentBlock = findBlockItem( [ ...fieldData ], selectedBlock ) || {};
	const settings = currentBlock.block || {};
	const disabledTab = [ 'separator', 'spacer' ].includes( currentBlock.type );

	const toolbarSetData = ( type, val ) => {
		updateFieldData( ( prevState ) => {
			let final = [ ...prevState ];
			if ( settings.sectionid ) {
				final = updateBlockAttr( {
					allBlocks: [ ...final ],
					blockid: settings.blockid,
					objKey: type,
					objValue: val,
				} );
			} else {
				const _val = { ...settings, [ type ]: val };
				final.splice( currentBlock.position, 1, _val );
			}
			return final;
		} );
	};

	const hasStylesTab = [
		'textfield',
		'email',
		'range',
		'number',
		'textarea',
		'color_picker',
		'url',
		'telephone',
		'radio',
		'checkbox',
		'select',
		'button',
		'switch',
		'img_switch',
		'color_switch',
		'section',
		'products',
		'datetime',
		'font_picker',
		'upload',
		'content',
		'popup',
	].includes( currentBlock.type );

	const getBlockIcon = () => {
		let iconName = currentBlock.type;
		switch ( currentBlock.type ) {
			case 'custom_formula':
				iconName = 'customFormula';
				break;
			case 'img_switch':
				iconName = 'imageSwatch';
				break;
			case 'color_switch':
				iconName = 'colorSwatch';
				break;
			case 'color_picker':
				iconName = 'colorPicker';
				break;
			case 'datetime':
				iconName = 'dateTime';
				break;
			case 'time':
				iconName = 'dateTime';
				break;
		}

		if ( iconName && icons[ iconName ] ) {
			return icons[ iconName ];
		}
	};

	return (
		<div className="">
			<div className="prad-d-flex prad-item-center prad-justify-between prad-text-color prad-mb-12">
				<div className="prad-d-flex prad-item-center prad-gap-8">
					<div className="prad-d-flex prad-block-settings-icon">
						{ getBlockIcon() }
					</div>
					<div className="prad-font-16 prad-font-semi prad-color-text-dark">
						<span className="prad-text-capital">
							{ currentBlock.type
								?.replace( 'img_switch', 'image_swatch' )
								.replace( 'color_switch', 'color_swatch' )
								.replace( 'textfield', 'text' )
								.replace( 'textarea', 'text_area' )
								.replace( 'datetime', 'date_time' )
								.replaceAll( '_', ' ' ) }
						</span>{ ' ' }
						{ __( 'Settings', 'product-addons' ) }
					</div>
					{ currentBlock.type === 'font_picker' && (
						<div className="prad-block-settings-docs">
							<a
								className="prad-d-flex"
								href={
									'https://wpxpo.com/docs/wowaddons/product-addons-custom-fields/font-picker-field/'
								}
								target="_blank"
								rel="noopener noreferrer"
							>
								{ icons.doc }
							</a>
						</div>
					) }
				</div>
				<Button
					onlyIcon={ true }
					iconName="cross_24"
					borderBtn={ true }
					color="dark"
					padding="3.2px"
					className="prad-btn-close"
					onClick={ () =>
						updateDrawer( ( prevDrawer ) => ( {
							...prevDrawer,
							open: ! prevDrawer.open,
							compo: 'blockSettingsDrawer',
						} ) )
					}
				/>
			</div>
			{ ! disabledTab && (
				<TabContainer
					tabItems={ [
						{
							key: 'general',
							label: 'General',
						},
						...( hasStylesTab
							? [
									{
										key: 'styles',
										label: 'Styles',
									},
							  ]
							: [] ),
						{
							key: 'conditional',
							label: 'Conditional Logic',
						},
					] }
					initialTabItem={ currentTab }
					onTabSelect={ ( tab ) => {
						setCurrentTab( tab.key );
					} }
					type="secondary"
				/>
			) }
			<div
				ref={ wrapperRef }
				className="prad-scrollbar prad-overflow-y-auto prad-overflow-x-hidden prad-mt-24"
				style={ { maxHeight: '84vh' } }
			>
				<div ref={ containerRef }>
					{ currentTab === 'general' && (
						<BlockGeneralSettings
							toolbarSetData={ toolbarSetData }
							settings={ settings }
							currentBlock={ currentBlock }
							hasStylesTab={ hasStylesTab }
						/>
					) }
					{ ! disabledTab &&
						hasStylesTab &&
						currentTab === 'styles' && (
							<BlockStyles toolbarSetData={ toolbarSetData } />
						) }
					{ ! disabledTab && currentTab === 'conditional' && (
						<Conditions
							toolbarSetData={ toolbarSetData }
							fieldData={ fieldData }
							settings={ settings }
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default BlockSettingsDrawer;
