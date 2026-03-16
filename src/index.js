import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/others/header';
import { AddonsProvider } from './context/AddonsContext';
import { EditorProvider } from './context/EditorContext';
import { NavProvider, useNav } from './context/NavContext';
import Analytics from './dashboard/analytics';
import Editor from './dashboard/editor/Editor';
import OptionList from './dashboard/option_list';
import Overview from './dashboard/overview';
import Settings from './dashboard/settings';
import CustomFonts from './dashboard/fonts';

const Dashboard = () => {
	const pageHash = window.location.hash;
	const [ isListing, setIsListing ] = useState(
		pageHash.includes( '#lists/' ) ? false : true
	);
	const pageOptionid = pageHash.includes( '#lists/' )
		? pageHash?.split( '/' )[ 1 ]
		: '';
	const [ optionId, setOptionId ] = useState( pageOptionid );

	useEffect( () => {
		const hash = window.location.hash;
		const splited = hash?.split( '/' );
		if ( hash && splited.length > 1 ) {
			setOptionId( splited[ 1 ] );
			setIsListing( false );
		}
	}, [] );

	const stateRef = useRef( { isListing, optionId } );
	useEffect( () => {
		stateRef.current = { isListing, optionId };
	}, [ isListing, optionId ] );

	useEffect( () => {
		const abortControl = new AbortController();

		const checkUrlChange = () => {
			const hash = window.location.hash;
			const splited = hash?.split( '/' );
			const newOptionId = hash && splited.length > 1 ? splited[ 1 ] : '';

			if ( stateRef.current.isListing ) {
				if ( newOptionId ) {
					setOptionId( newOptionId );
					setIsListing( false );
				}
			} else if ( ! stateRef.current.isListing && ! newOptionId ) {
				setIsListing( true );
			}
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
		<>
			{ isListing && <Header /> }
			<div>
				<style id="prad-global-css"></style>
				{ isListing ? (
					<OptionList
						setIsListing={ setIsListing }
						setOptionId={ setOptionId }
					/>
				) : (
					<EditorProvider optionId={ optionId }>
						<Editor
							setIsListing={ setIsListing }
							setOptionId={ setOptionId }
							optionId={ optionId }
						/>
					</EditorProvider>
				) }
			</div>
		</>
	);
};

// Route configuration object
const routeConfig = {
	dashboard: { component: Overview, showHeader: true },
	analytics: { component: Analytics, showHeader: true },
	settings: { component: Settings, showHeader: true },
	fonts: { component: CustomFonts, showHeader: true },
};

// Route wrapper component
const RouteWrapper = ( { children, showHeader = false } ) => (
	<>
		{ showHeader && <Header /> }
		{ children }
	</>
);

// Custom hook for route rendering
const useRouteRenderer = ( currentNav ) => {
	// Handle special case for lists route
	if ( currentNav === 'lists' || currentNav.includes( 'lists' ) ) {
		return { component: Dashboard, showHeader: false };
	}

	// Return configured route or null
	return routeConfig[ currentNav ] || null;
};

const App = () => {
	const { currentNav, setCurrentNav, handlePageHash } = useNav();
	const routeData = useRouteRenderer( currentNav );

	const _fetchQuery = () => {
		const pageUrl = window.location.href;
		if ( pageUrl.includes( 'page=flynpo-dashboard#' ) ) {
			setCurrentNav( handlePageHash( pageUrl ) );
		}
	};

	const handleClickOutside = ( e ) => {
		if (
			e.target &&
			! e.target.classList?.contains( 'ultp-reserve-button' )
		) {
			if ( e.target.href ) {
				if ( e.target.href.indexOf( 'page=flynpo-dashboard#' ) > 0 ) {
					const slug = e.target.href.split( '#' );
					if ( slug[ 1 ] ) {
						setCurrentNav( slug[ 1 ] );
						window.scrollTo( { top: 0, behavior: 'smooth' } );
					}
				}
			}
		}
	};

	useEffect( () => {
		const abortControl = new AbortController();
		_fetchQuery();
		document.addEventListener( 'mousedown', handleClickOutside, {
			signal: abortControl.signal,
		} );
		return () => abortControl.abort();
	}, [] );

	// Render the route component
	const renderRoute = () => {
		if ( ! routeData ) {
			return null;
		}

		const RouteComponent = routeData.component;
		return (
			<RouteWrapper showHeader={ routeData.showHeader }>
				<RouteComponent />
			</RouteWrapper>
		);
	};

	return (
		<AddonsProvider>
			<div>
				<style id="prad-global-css"></style>
				{ renderRoute() }
			</div>
		</AddonsProvider>
	);
};

if (
	document.body.contains( document.getElementById( 'flynpo-dashboard-wrap' ) )
) {
	const container = document.getElementById( 'flynpo-dashboard-wrap' );
	const root = createRoot( container );
	root.render(
		<NavProvider>
			<App />
		</NavProvider>
	);
}
