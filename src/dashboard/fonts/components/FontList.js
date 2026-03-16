import { memo } from 'react';
import Skeleton from '../../../utils/Skeleton';
import EmptyState from './EmptyState';
import FontItem from './FontItem';

const FontList = ( {
	fonts,
	loading,
	deletingId,
	onEditFont,
	onDeleteFont,
} ) => {
	if ( loading ) {
		return (
			<div className="prad-d-flex prad-flex-column prad-gap-16">
				{ [ ...Array( 3 ) ].map( ( _, i ) => (
					<Skeleton height={ 80 } key={ i } />
				) ) }
			</div>
		);
	}

	if ( fonts.length === 0 ) {
		return <EmptyState />;
	}

	return (
		<div className="prad-fonts-list prad-d-flex prad-flex-column prad-gap-16">
			{ fonts.map( ( font ) => (
				<FontItem
					key={ font.id }
					font={ font }
					onEdit={ onEditFont }
					onDelete={ onDeleteFont }
					isDeleting={ deletingId === font.id }
				/>
			) ) }
		</div>
	);
};

export default memo( FontList );
