import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { generateGlobalCss } from '../blocks/helper/cssGenerator';
import { iniGlobalStyle } from '../utils/common_data/commonData';

const EditorContext = createContext();
const assignType = [
	{ value: 'all_product', label: 'All Products' },
	{ value: 'specific_product', label: 'Specific Products' },
	{ value: 'specific_category', label: 'Specific Categories' },
	{
		value: 'specific_tag',
		label: 'Specific Tags',
		isPro: true,
		proDisabled: ! pradBackendData.isActive,
	},
	{
		value: 'specific_brand',
		label: 'Specific Brands',
		isPro: true,
		proDisabled: ! pradBackendData.isActive,
	},
];

export const EditorProvider = ( { optionId, children } ) => {
	const [ assignedData, setAssignedData ] = useState( {} );
	const [ selectProductData, setSelectProductData ] = useState( {} );
	const currentPostCss = useRef( '' );
	const [ globalStyles, setGlobalStyles ] = useState( iniGlobalStyle );
	const [ updateProductImageData, setUpdateProductImageData ] = useState(
		{}
	);
	const [ customFonts, setCustomFonts ] = useState( [] );

	const handleAssignedData = ( type, data ) => {
		// type can be aType, includes, excludes
		setAssignedData( {
			...assignedData,
			[ type ]: data,
			...( type === 'aType' && { includes: [], excludes: [] } ),
		} );
	};

	const setAssignedProducts = ( _data ) => {
		const { id, type } = _data || {};
		if ( optionId === 'new' && ! id ) {
			return;
		}

		const mergedIds = [
			...new Set( Object.values( updateProductImageData ).flat() ),
		];

		wp.apiFetch( {
			method: 'POST',
			path: '/prad/set_assign',
			data: {
				option_id: type === 'newforce' && id ? id : optionId,
				product_image: mergedIds,
				raw_data: {
					aType: assignedData.aType || 'specific_product',
					includes:
						assignedData.includes?.map( ( val ) => val.item_id ) ||
						[],
					excludes:
						assignedData.excludes?.map( ( val ) => val.item_id ) ||
						[],
				},
			},
		} ).then( () => {} );
	};

	const saveGlobalStyles = () => {
		wp.apiFetch( {
			method: 'POST',
			path: '/prad/set_global',
			data: {
				style: globalStyles,
				css: generateGlobalCss( globalStyles ),
			},
		} ).then( () => {} );
	};

	useEffect( () => {
		generateGlobalCss( globalStyles );
	}, [ globalStyles ] );

	const mergeByKey = ( key, one, two ) => ( {
		...( one?.[ key ] || {} ),
		...( two?.[ key ] || {} ),
	} );

	useEffect( () => {
		wp.apiFetch( {
			method: 'GET',
			path: '/prad/get_global',
		} ).then( ( obj ) => {
			if ( obj.success && obj.response ) {
				const merged = {
					...globalStyles,
					...( obj.response || {} ),
					common: mergeByKey( 'common', globalStyles, obj.response ),
					field_comp: mergeByKey(
						'field_comp',
						globalStyles,
						obj.response
					),
				};
				setGlobalStyles( { ...merged } );
			} else {
				saveGlobalStyles();
			}
		} );
	}, [] );

	const value = {
		optionId,
		assignType,
		assignedData,
		setAssignedData,
		handleAssignedData,
		setAssignedProducts,
		selectProductData,
		setSelectProductData,
		currentPostCss,
		globalStyles,
		setGlobalStyles,
		saveGlobalStyles,
		updateProductImageData,
		setUpdateProductImageData,
		customFonts,
		setCustomFonts,
	};

	return (
		<EditorContext.Provider value={ value }>
			{ children }
		</EditorContext.Provider>
	);
};

export const useEditor = () => {
	const context = useContext( EditorContext );
	if ( ! context ) {
		throw new Error( 'Editor must be used within an Editor' );
	}
	return context;
};
