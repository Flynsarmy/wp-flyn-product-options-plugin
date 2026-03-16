import BlockSettingsDrawer from '../../blocks/settings/drawer/blocksSettings';
import SelectProduct from '../../components/SelectProduct';
import { useAddons } from '../../context/AddonsContext';
import BlockCanvas from './components/BlockCanvas';
import BlockList from './components/BlockList';
import Global from './Global';

export default function Builder( { isLoading } ) {
	const { drawer } = useAddons();

	return (
		<div className="prad-builder-wrap">
			<div
				className={ `prad-drawer prad-${
					drawer.open ? 'active' : 'inactive'
				}` }
				style={ {
					maxWidth:
						window.innerWidth < 650
							? '100vw'
							: drawer.compo === 'blockList'
							? '676px'
							: '676px',
				} }
			>
				{ drawer.compo === 'blockList' && <BlockList /> }
				{ drawer.compo === 'global' && <Global /> }
				{ drawer.compo === 'blockSettingsDrawer' && (
					<BlockSettingsDrawer />
				) }
				{ drawer.compo === 'assigned' && <SelectProduct /> }
			</div>
			<BlockCanvas shift={ drawer.open } isLoading={ isLoading } />
		</div>
	);
}
