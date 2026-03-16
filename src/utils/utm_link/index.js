const configObj = {
	example: {
		source: 'db-wowaddons-featurename',
		medium: 'block-feature',
		campaign: 'wowaddons-dashboard',
	},
	db_doc: {
		source: 'db-wowaddons-started',
		medium: 'docs',
		campaign: 'wowaddons-dashboard',
	},
	db_hellobar: {
		source: 'db-wowaddons',
		medium: 'summer-hellobar',
		campaign: 'wowaddons-dashboard',
	},
	final_hour_sale: {
		source: 'db-wowaddons-hellobar',
		medium: 'black-friday-sale',
		campaign: 'wowaddons-dashboard',
	},
	massive_sale: {
		source: 'db-wowaddons-hellobar',
		medium: 'massive-sale',
		campaign: 'wowaddons-dashboard',
	},
	flash_sale: {
		source: 'db-wowaddons-hellobar',
		medium: 'flash-sale',
		campaign: 'wowaddons-dashboard',
	},
	exclusive_deals: {
		source: 'db-wowaddons-hellobar',
		medium: 'exclusive-deals',
		campaign: 'wowaddons-dashboard',
	},
};

const DEFAULT_URL = 'https://www.wpxpo.com/product-addons-for-woocommerce/';
const UTMLinkGenerator = ( params ) => {
	const { url, utmKey, affiliate, hash } = params;

	const baseUrl = new URL( url || DEFAULT_URL );

	const utmConfig = configObj[ utmKey ];

	if ( utmConfig ) {
		baseUrl.searchParams.set( 'utm_source', utmConfig.source );
		baseUrl.searchParams.set( 'utm_medium', utmConfig.medium );
		baseUrl.searchParams.set( 'utm_campaign', utmConfig.campaign );
	}

	if ( affiliate ) {
		baseUrl.searchParams.set( 'ref', affiliate );
	}

	if ( hash ) {
		baseUrl.hash = hash.startsWith( '#' ) ? hash : `#${ hash }`;
	}

	return baseUrl.toString();
};

export default UTMLinkGenerator;
