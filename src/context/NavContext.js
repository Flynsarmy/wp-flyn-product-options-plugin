import { createContext, useContext, useEffect, useState } from 'react';

const NavContext = createContext();
const handlePageHash = ( url ) => {
	let hash = 'dashboard';
	if ( url ) {
		if ( window.location.href?.includes( 'page=flynpo-dashboard#' ) ) {
			const pageUrl = url.split( 'page=flynpo-dashboard#' );
			if ( pageUrl[ 1 ] ) {
				hash = pageUrl[ 1 ];
			}
		}
	}
	return hash;
};

( function ( history ) {
	const pushState = history.pushState;
	const replaceState = history.replaceState;

	function fireEvent( type ) {
		window.dispatchEvent( new Event( type ) );
	}

	history.pushState = function ( state, title, url ) {
		const result = pushState.apply( this, arguments );
		fireEvent( 'pushstate' );
		fireEvent( 'pradlocationchange' );
		return result;
	};

	history.replaceState = function ( state, title, url ) {
		const result = replaceState.apply( this, arguments );
		fireEvent( 'replacestate' );
		fireEvent( 'pradlocationchange' );
		return result;
	};

	window.addEventListener( 'popstate', () =>
		fireEvent( 'pradlocationchange' )
	);
} )( window.history );

export const NavProvider = ( { children } ) => {
	const onLoadPage = handlePageHash( window.location?.href );
	const [ currentNav, setCurrentNav ] = useState( onLoadPage );

	const value = {
		currentNav,
		setCurrentNav,
		handlePageHash,
	};

	useEffect( () => {
		if ( currentNav === 'lists' ) {
			if ( ! window.location.hash?.includes( `#${ currentNav }` ) ) {
				window.location.hash = currentNav;
			}
		} else if ( window.location.hash !== `#${ currentNav }` ) {
			window.location.hash = currentNav;
		}
		document
			.querySelectorAll( '#toplevel_page_flynpo-dashboard ul li' )
			.forEach( ( li ) => li.classList.remove( 'current' ) );

		const targetMenuItem = document.querySelector(
			`#toplevel_page_flynpo-dashboard ul li a[href$="#${ currentNav }"]`
		);
		if ( targetMenuItem ) {
			targetMenuItem.closest( 'li' ).classList.add( 'current' );
		}
	}, [ currentNav ] );

	useEffect( () => {
		const abortControl = new AbortController();
		const checkUrlChange = () => {
			let hash = window.location.hash;
			hash = hash.includes( '#lists/' ) ? hash.split( '/' )[ 0 ] : hash;
			setCurrentNav( hash.replace( '#', '' ) );
		};

		window.addEventListener( 'pradlocationchange', checkUrlChange, {
			signal: abortControl.signal,
		} );
		checkUrlChange();

		return () => {
			abortControl.abort();
		};
	}, [] );

	return (
		<NavContext.Provider value={ value }>{ children }</NavContext.Provider>
	);
};

export const useNav = () => {
	const context = useContext( NavContext );
	if ( ! context ) {
		throw new Error( 'useNav must be used within an AddonProvider' );
	}
	return context;
};
