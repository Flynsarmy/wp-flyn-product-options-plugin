const { __ } = wp.i18n;
import FieldToggle from '../../../common/FieldToggle';
import Button from '../../../../../components/Button';
import Select from '../../../../../components/Select';
import {
	processConditionData,
	returnComarisonOptions,
} from './conditionHelper';
import RenderCompareValue from './RenderCompareValue';

const Conditions = ( props ) => {
	const { toolbarSetData, settings, fieldData } = props;

	const { en_logic, fieldConditions = [] } = settings;

	const handleConditions = ( type, value ) => {
		toolbarSetData( type, value );
	};
	const handleConditionOptions = ( layer, key, value, pos ) => {
		let newFieldConditions = { ...fieldConditions };
		if ( layer === 'condition' ) {
			newFieldConditions = {
				...newFieldConditions,
				condition: {
					...newFieldConditions.condition,
					[ key ]: value,
				},
			};
		} else if (
			layer === 'rules' &&
			Array.isArray( newFieldConditions.rules )
		) {
			const data = {
				...newFieldConditions,
				rules: newFieldConditions.rules.map( ( rule, index ) => {
					if ( index === pos ) {
						if ( key === 'field' ) {
							return {
								...rule,
								[ key ]: value,
								value: '',
								compare: '',
							};
						} else if ( key === 'compare' ) {
							return {
								...rule,
								[ key ]: value,
								value: '',
							};
						}
						return { ...rule, [ key ]: value };
					}
					return rule;
				} ),
			};
			newFieldConditions = { ...data };
		}
		handleConditions( 'fieldConditions', newFieldConditions );
	};
	const handleDelete = ( position ) => {
		const newFieldConditions = { ...fieldConditions };
		newFieldConditions?.rules?.splice( position, 1 );
		handleConditions( 'fieldConditions', newFieldConditions );
	};

	const processedConditionField = processConditionData( fieldData );
	const conditionOptions = processedConditionField.all;
	// conditionOptions = conditionOptions[ settings.sectionid ?? 'common' ];

	return (
		<div className="">
			<div className="prad-d-flex prad-gap-8 prad-item-center prad-mb-24">
				<FieldToggle
					fieldKey={ 'en_logic' }
					checked={ en_logic }
					label={ __(
						'Enable Conditional Logic for this Element',
						'product-addons'
					) }
					handleChange={ ( value ) =>
						handleConditions( 'en_logic', value )
					}
				/>
			</div>
			<div className="prad-mlg-item-start prad-mlg-flex-column prad-d-flex prad-item-center prad-gap-16 prad-font-14 prad-mb-24">
				<div className="prad-d-flex prad-item-center prad-gap-16">
					<Select
						options={ [
							{ value: 'show', label: 'Show' },
							{ value: 'hide', label: 'Hide' },
						] }
						onChange={ ( val ) => {
							handleConditionOptions(
								'condition',
								'visibility',
								val.value
							);
						} }
						width="158px"
						selectedOption={
							fieldConditions?.condition?.visibility
						}
						defaultValue="Select visibility"
						valueClass="prad-ellipsis"
					/>
					<span className="prad-color-text-medium">
						{ __( 'this field if', 'product-addons' ) }
					</span>
				</div>
				<div className="prad-d-flex prad-item-center prad-gap-16">
					<Select
						options={ [
							{ value: 'any', label: 'Any' },
							{ value: 'all', label: 'All' },
						] }
						onChange={ ( val ) => {
							handleConditionOptions(
								'condition',
								'match',
								val.value
							);
						} }
						width="138px"
						selectedOption={ fieldConditions?.condition?.match }
						defaultValue="Select match"
						valueClass="prad-ellipsis"
					/>
					<span className="prad-color-text-medium">
						{ __( 'of these rules match:', 'product-addons' ) }
					</span>
				</div>
			</div>
			<div className="prad-field prad-border-default prad-br-smd">
				<div className="prad-field-header prad-conditional-row prad-font-14 prad-font-semi">
					<div>{ __( 'Field', 'product-addons' ) }</div>
					<div className="prad-d-flex prad-item-center prad-gap-12">
						<div
							className="prad-w-full"
							style={ {
								maxWidth: `145px`,
							} }
						>
							{ __( 'Comparison', 'product-addons' ) }
						</div>
						<div className={ `prad-w-full prad-opacity-full` }>
							{ __( 'Value', 'product-addons' ) }
						</div>
					</div>
					<div></div>
				</div>
				<div className="prad-relative prad-p-20">
					{ fieldConditions?.rules?.map( ( val, k ) => {
						const selectedBlock =
							conditionOptions?.filter(
								( el ) => el.blockid === val.field
							)[ 0 ] ?? {};

						const blockList = conditionOptions
							?.map( ( option ) =>
								option.blockid !== settings.blockid &&
								! [
									'heading',
									'section',
									'shortcode',
									'separator',
									'spacer',
									'custom_formula',
									'products',
									'content',
								].includes( option.type )
									? {
											value: option.blockid,
											label: `${
												option.label ||
												'Field ' +
													'( ' +
													option.type +
													' )'
											}`,
									  }
									: null
							)
							.filter( Boolean );
						blockList.unshift( {
							value: '',
							label: 'Select Field',
						} );

						return (
							<div
								key={ k }
								className="prad-conditional-row prad-mb-12"
							>
								<Select
									options={ blockList }
									onChange={ ( option ) => {
										handleConditionOptions(
											'rules',
											'field',
											option.value,
											k
										);
									} }
									width="100%"
									selectedOption={ val?.field }
									dropdownMaxHeight="20vh"
									dropdownClass="prad-overflow-y-auto prad-scrollbar"
									valueClass="prad-ellipsis"
								/>
								<div className="prad-d-flex prad-item-center prad-gap-12">
									<Select
										options={ returnComarisonOptions( {
											block: selectedBlock,
										} ).map( ( _opt ) => _opt ) }
										onChange={ ( option ) => {
											handleConditionOptions(
												'rules',
												'compare',
												option.value,
												k
											);
										} }
										width="100%"
										maxWidth="145px"
										selectedOption={ val?.compare }
										dropdownMaxHeight="20vh"
										dropdownClass="prad-overflow-y-auto prad-scrollbar"
										valueClass="prad-ellipsis"
									/>
									<RenderCompareValue
										handleConditionOptions={
											handleConditionOptions
										}
										propsData={ {
											k,
											val,
											selectedBlock,
										} }
									/>
								</div>
								<Button
									onlyIcon={ true }
									iconName="delete"
									background="base2"
									fontHeight="0"
									borderRadius="100"
									className="prad-btn-close"
									borderColor="transparent"
									onClick={ () => handleDelete( k ) }
								/>
							</div>
						);
					} ) }
				</div>
				<div className="prad-plr-20 prad-mb-20">
					<Button
						value={ __( 'Add New', 'product-addons' ) }
						iconName="plus_20"
						background="primary"
						onClick={ () => {
							handleConditions( 'fieldConditions', {
								...fieldConditions,
								rules: [
									...( fieldConditions.rules || [] ),
									{ field: '', compare: '', value: '' },
								],
							} );
						} }
					/>
				</div>
			</div>
		</div>
	);
};

export default Conditions;
