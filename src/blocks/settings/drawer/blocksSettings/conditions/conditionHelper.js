const processConditionData = ( data ) => {
	let result = {};
	const all = [];
	function handleData( arr ) {
		arr.forEach( ( element ) => {
			if ( element.innerBlocks ) {
				handleData( element.innerBlocks );
			} else {
				const key = element.sectionid ?? 'common';
				const value = [ ...( result[ key ] || [] ), element ];
				all.push( element );
				result = { ...result, [ key ]: value };
			}
			return element;
		} );
	}
	handleData( data );
	return { result, all };
};

const returnComarisonOptions = ( data ) => {
	const { block } = data;
	const _is = [
		{ value: '_is', label: 'Is' },
		{ value: '_not_is', label: 'Not Is' },
	];
	const _in = [
		{ value: '_in', label: 'In' },
		{ value: '_not_in', label: 'Not In' },
	];
	const _empty = [
		{ value: '_empty', label: 'Is Empty' },
		{ value: '_not_empty', label: 'Is Not Empty' },
	];
	const _contains = [
		{ value: '_contains', label: 'Contains' },
		{ value: '_not_contains', label: 'Not Contains' },
	];
	const _lg = [
		{ value: '_less', label: 'Less than' },
		{ value: '_less_equal', label: 'Less or Equal than' },
		{ value: '_greater', label: 'Greater than' },
		{ value: '_greater_equal', label: 'Great or Equal than' },
	];
	const _date = [
		{ value: '_date_is', label: 'Is' },
		{ value: '_date_not_is', label: 'Not Is' },
		{ value: '_date_in', label: 'In' },
		{ value: '_date_not_in', label: 'Not In' },
		{ value: '_date_between', label: 'Between' },
		{ value: '_date_less', label: 'Less than' },
		{ value: '_date_greater', label: 'Greater than' },
	];
	const _time = [
		{ value: '_time_before', label: 'Before(Time)' },
		{ value: '_time_after', label: 'After(Time)' },
	];

	if ( block.type ) {
		switch ( block.type ) {
			case 'color_picker':
				return [
					{ value: '', label: 'Select Relation' },
					..._is,
					..._in,
					..._empty,
				];
			case 'datetime':
				return [
					{ value: '', label: 'Select Relation' },
					..._date,
					..._time,
				];
			case 'time':
				return [ { value: '', label: 'Select Relation' }, ..._time ];
			case 'date':
				return [ { value: '', label: 'Select Relation' }, ..._date ];
			case 'radio':
			case 'checkbox':
			case 'select':
			case 'color_switch':
			case 'button':
			case 'img_switch':
			case 'img_switch-1':
				return [
					{ value: '', label: 'Select Relation' },
					..._is,
					..._in,
					..._empty,
				];
			case 'switch':
				return [ { value: '', label: 'Select Relation' }, ..._is ];
			case 'upload':
				return [ { value: '', label: 'Select Relation' }, ..._empty ];
			case 'number':
			case 'range':
				return [
					{ value: '', label: 'Select Relation' },
					..._is,
					..._empty,
					..._lg,
				];
			case 'telephone':
			case 'url':
			case 'textfield':
			case 'textarea':
			case 'email':
				return [
					{ value: '', label: 'Select Relation' },
					..._is,
					..._empty,
					..._contains,
				];
		}
	}
	return [];
};

export { processConditionData, returnComarisonOptions };
