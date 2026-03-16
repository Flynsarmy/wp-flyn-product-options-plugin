import { createContext, useContext, useEffect, useState } from 'react';

const AddonsContext = createContext();

export const AddonsProvider = ( { children } ) => {
	const [ fieldData, setFieldData ] = useState( [] );
	const [ selectedBlock, setSelectedBlock ] = useState( '' );
	const [ draggData, setDraggData ] = useState( {} );
	const [ editHistory, setEditHistory ] = useState( {
		undoStack: [],
		redoStack: [],
	} );
	const [ hasUnsavedChanges, setHasUnsavedChanges ] = useState( false );
	const [ drawer, setDrawer ] = useState( {} );

	const updateFieldData = ( newData ) => {
		setHasUnsavedChanges( true );
		setEditHistory( ( prevHistory ) => ( {
			undoStack: [ ...prevHistory.undoStack, fieldData ],
			redoStack: [],
		} ) );
		setFieldData( newData );
	};

	const updateDraggData = ( newData ) => {
		setDraggData( ( prevState ) => ( {
			...prevState,
			...newData,
		} ) );
	};

	const updateDrawer = ( newData ) => {
		setDrawer( ( prevDrawer ) => ( {
			...prevDrawer,
			...( typeof newData === 'function'
				? newData( prevDrawer )
				: newData ),
		} ) );
	};

	useEffect( () => {
		const abortControl = new AbortController();
		const handleBeforeUnload = ( e ) => {
			if ( hasUnsavedChanges ) {
				e.preventDefault();
				e.returnValue = '';
				return '';
			}
		};

		window.addEventListener( 'beforeunload', handleBeforeUnload, {
			signal: abortControl.signal,
		} );

		return () => {
			abortControl.abort();
		};
	}, [ hasUnsavedChanges ] );

	const upDateSelectedBlock = ( id ) => {
		setSelectedBlock( id );
		if ( id ) {
			setDrawer( {
				open: true,
				compo: 'blockSettingsDrawer',
			} );
		} else {
			setDrawer( {
				open: false,
				compo: '',
			} );
		}
	};

	const handleBlockUpdate = ( data, blockid, updateData ) => {
		return data.map( ( block ) => {
			if ( block.blockid === blockid ) {
				return { ...block, ...updateData };
			}
			if (
				Array.isArray( block.innerBlocks ) &&
				block.innerBlocks.length > 0
			) {
				return {
					...block,
					innerBlocks: handleBlockUpdate(
						block.innerBlocks,
						blockid,
						updateData
					),
				};
			}
			return block;
		} );
	};

	const updateBlockById = ( blockid, updateData ) => {
		const data = [ ...fieldData ];
		const newData = handleBlockUpdate( data, blockid, updateData );
		setFieldData( newData );
		setHasUnsavedChanges( true );
		return newData;
	};

	const value = {
		fieldData,
		setFieldData,
		updateFieldData,
		selectedBlock,
		upDateSelectedBlock,
		editHistory,
		setEditHistory,
		draggData,
		updateDraggData,
		drawer,
		updateDrawer,
		hasUnsavedChanges,
		setHasUnsavedChanges,
		setDrawer,
		setSelectedBlock,
		updateBlockById,
	};

	return (
		<AddonsContext.Provider value={ value }>
			{ children }
		</AddonsContext.Provider>
	);
};

export const useAddons = () => {
	const context = useContext( AddonsContext );
	if ( ! context ) {
		throw new Error( 'useAddons must be used within an AddonProvider' );
	}
	return context;
};
