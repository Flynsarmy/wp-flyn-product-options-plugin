<?php // phpcs:ignore
/**
 * Initialization Action.
 *
 * @package PRAD
 * @since 1.0.0
 */
namespace Flyn\ProductOptions;

use Flyn\ProductOptions\Admin\Notice;
use Flyn\ProductOptions\Admin\Options;
use Flyn\ProductOptions\Admin\Product\ProductEdit;
use Flyn\ProductOptions\Common\Hooks;
use Flyn\ProductOptions\Common\SafeMathEvaluator;
use Flyn\ProductOptions\Compatibility\Compatibility;
use Flyn\ProductOptions\Compatibility\ShopCompatibility;
use Flyn\ProductOptions\Order\CartPage;
use Flyn\ProductOptions\Order\CheckoutPage;
use Flyn\ProductOptions\RestAPI\RequestApi;

use Flyn\ProductOptions\Cron\Cleanup;

defined( 'ABSPATH' ) || exit;

/**
 * Initialization class.
 */
class Initialization {

	/**
	 * Setup class.
	 *
	 * @since v.1.0.0
	 */
	public function __construct() {
		$this->requires();
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts_callback' ) );
		add_action( 'activated_plugin', array( $this, 'activation_redirect' ) );
	}

	/**
	 * Necessary Requires Class
	 *
	 * @since v.1.0.0
	 * @return void
	 */
	public function requires() {

		new Deactive();
		new PostType();
		new Analytics();
		new Xpo();

		new Options();
		new Notice();

		new ProductEdit();

		new CartPage();
		new CheckoutPage();

		new Hooks();
		new RequestApi();
		new Compatibility();
		new ShopCompatibility();
		new SafeMathEvaluator();

		new Cleanup();
	}


	/**
	 * Only Backend CSS and JS Scripts
	 *
	 * @since v.1.0.0
	 * @return void
	 */
	public function admin_scripts_callback() {
		global $pagenow;
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : ''; //phpcs:ignore
		wp_enqueue_style( 'prad-admin-style', FLYNPO_URL . 'assets/css/prad-admin.css', array(), FLYNPO_VER );
		wp_enqueue_script( 'prad-admin-script', FLYNPO_URL . 'assets/js/prad-admin.js', array( 'jquery' ), FLYNPO_VER, true );

		if ( 'admin.php' === $pagenow ) {
			wp_localize_script(
				'prad-admin-script',
				'prad_admin',
				array(
					'license' => get_option( 'edd_prad_license_key' ),
				)
			);
			if ( 'flynpo-dashboard' === $page ) {
				$user_info = get_userdata( get_current_user_id() );
				wp_enqueue_style( 'prad-editor-css', FLYNPO_URL . 'assets/css/wowaddons-backend.css', array(), FLYNPO_VER );
				wp_enqueue_style( 'prad-blocks-css', FLYNPO_URL . 'assets/css/wowaddons-blocks.css', array(), FLYNPO_VER );
				$asset_file = include FLYNPO_PATH . 'assets/js/wowaddons.asset.php';
				wp_enqueue_script( 'prad-editor-script', FLYNPO_URL . 'assets/js/wowaddons.js', $asset_file['dependencies'], $asset_file['version'], true );
				wp_enqueue_script( 'prad-date-script', FLYNPO_URL . 'assets/js/wowdate-min.js', array( 'jquery' ), FLYNPO_VER, true );
				wp_enqueue_media();
				wp_localize_script(
					'prad-editor-script',
					'pradBackendData',
					array_merge(
						array(
							'url'             => FLYNPO_URL,
							'db_url'          => admin_url( 'admin.php?page=flynpo-dashboard#' ),
							'ajax'            => admin_url( 'admin-ajax.php' ),
							'version'         => FLYNPO_VER,
							'nonce'           => wp_create_nonce( 'prad-nonce' ),
							'decimal_sep'     => get_option( 'woocommerce_price_decimal_sep', '.' ),
							'num_decimals'    => get_option( 'woocommerce_price_num_decimals', '2' ),
							'currency_pos'    => get_option( 'woocommerce_currency_pos', 'left' ),
							'currencySymbol'  => function_exists( 'get_woocommerce_currency_symbol' ) ? get_woocommerce_currency_symbol() : '$',
							'userInfo'        => array(
								'name'  => $user_info->first_name ? $user_info->first_name . ( $user_info->last_name ? ' ' . $user_info->last_name : '' ) : $user_info->user_login,
								'email' => $user_info->user_email,
							),
							'helloBar'        => flynpo_product_options()->get_transient_without_cache( 'prad_helloBar_newyr26' ),
							'uploadFileTypes' => flynpo_product_options()->prad_get_upload_allowed_file_types(),
						),
						flynpo_product_options()->get_wow_products_details()
					)
				);
				wp_set_script_translations( 'prad-editor-script', 'flyn-product-options', FLYNPO_PATH . 'languages/' );
			}
		}
	}

	/**
	 * Redirect After Active Plugin
	 *
	 * @since v.1.0.0
	 *
	 * @param string $plugin Plugin name.
	 *
	 * @return void
	 */
	public function activation_redirect( $plugin ) {
		if ( 'flyn-product-options/flyn-product-options.php' === $plugin ) {
			if ( wp_doing_ajax() || is_network_admin() || isset( $_GET['activate-multi'] ) || isset( $_POST['action'] ) && 'activate-selected' == $_POST['action'] ) { // phpcs:ignore
				return;
			}
			exit( wp_safe_redirect( admin_url( 'admin.php?page=flynpo-dashboard#dashboard' ) ) ); // phpcs:ignore
		}
	}
}
