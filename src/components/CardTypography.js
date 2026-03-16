const { __ } = wp.i18n;
import Select from './Select';
import Icons from '../utils/Icons';

const getOptionLabel = ( key ) => {
	const optionLabel = {
		_size: __( 'Font Size', 'product-addons' ),
		_height: __( 'Line Height', 'product-addons' ),
		_space: __( 'Letter Spacing', 'product-addons' ),
		_weight: __( 'Font Weight', 'product-addons' ),
		_style: __( 'Font Style', 'product-addons' ),
		_decoration: __( 'Text Decoration', 'product-addons' ),
	};
	return optionLabel[ key ];
};

const fontWeight = [
	{ value: '900', label: '900' },
	{ value: '800', label: '800' },
	{ value: '700', label: '700' },
	{ value: '600', label: '600' },
	{ value: '500', label: '500' },
	{ value: '400', label: '400' },
	{ value: '300', label: '300' },
	{ value: '200', label: '200' },
	{ value: '100', label: '100' },
];

function CardTypography( {
	options = {},
	onChange,
	isDisable,
	className = '',
	style,
} ) {
	const _style = options._style;
	const _decoration = options._decoration;

	const handleTypoChange = ( key, value ) => {
		const shallow = { ...options, [ key ]: value };
		onChange( 'typo', shallow );
	};

	return (
		<div
			className={ `prad-card prad-bg-base1 ${ className }` }
			style={ { ...style } }
		>
			<div className="prad-card-body prad-typography-container">
				{ [ '_size', '_height', '_space', '_weight' ].map( ( key ) => {
					const optionValue = options[ key ];
					return (
						<div key={ key }>
							<div className="prad-font-12 prad-color-text-dark prad-mb-8">
								{ getOptionLabel( key ) }
							</div>
							{ key !== '_weight' ? (
								<div className="prad-global-settings-item">
									<input
										id={ key }
										name={ key }
										type="number"
										min={ key === '_space' ? 'auto' : '0' }
										value={ optionValue?.val }
										onChange={ ( e ) =>
											handleTypoChange( key, {
												val: e.target.value,
												unit: 'px',
											} )
										}
										disabled={ isDisable ? true : false }
										className={ `prad-input` }
									/>
									<div className="prad-global-settings-unit">
										{ optionValue?.unit }
									</div>
								</div>
							) : (
								<Select
									options={ fontWeight }
									onChange={ ( option ) =>
										handleTypoChange( key, option.value )
									}
									borderColor="base3"
									padding="5px 10px"
									selectedOption={
										options._weight || fontWeight[ 5 ].value
									}
								/>
							) }
						</div>
					);
				} ) }
			</div>

			<div className="prad-card-footer">
				<div className="prad-btn-group prad-gap-2">
					<div
						className={ `prad-p-6 prad-br-smd prad-cursor-pointer prad-lh-0 ${
							_style === 'italic'
								? 'prad-bg-text-dark prad-color-text-reverse'
								: 'prad-bg-transparent prad-color-text-dark'
						}` }
						onClick={ () =>
							handleTypoChange(
								'_style',
								_style === 'italic' ? '' : 'italic'
							)
						}
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								handleTypoChange(
									'_style',
									_style === 'italic' ? '' : 'italic'
								);
							}
						} }
					>
						{ Icons.italic_20 }
					</div>
					<div
						className={ `prad-p-6 prad-br-smd prad-cursor-pointer prad-lh-0 ${
							_decoration === 'underline'
								? 'prad-bg-text-dark prad-color-text-reverse'
								: 'prad-bg-transparent prad-color-text-dark'
						}` }
						onClick={ () =>
							handleTypoChange(
								'_decoration',
								_decoration !== 'underline' ? 'underline' : ''
							)
						}
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								handleTypoChange(
									'_decoration',
									_decoration !== 'underline'
										? 'underline'
										: ''
								);
							}
						} }
					>
						{ Icons.underline_20 }
					</div>
					<div
						className={ `prad-p-6 prad-br-smd prad-cursor-pointer prad-lh-0 ${
							_decoration === 'line-through'
								? 'prad-bg-text-dark prad-color-text-reverse'
								: 'prad-bg-transparent prad-color-text-dark'
						}` }
						onClick={ () =>
							handleTypoChange(
								'_decoration',
								_decoration !== 'line-through'
									? 'line-through'
									: ''
							)
						}
						role="button"
						tabIndex="-1"
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' ) {
								handleTypoChange(
									'_decoration',
									_decoration !== 'line-through'
										? 'line-through'
										: ''
								);
							}
						} }
					>
						{ Icons.lineThrough_20 }
					</div>
				</div>
			</div>
		</div>
	);
}

export default CardTypography;
