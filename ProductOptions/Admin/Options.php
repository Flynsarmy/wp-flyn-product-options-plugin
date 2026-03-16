<?php //phpcs:ignore
/**
 * Options Action.
 *
 * @package PRAD\Options
 * @since v.1.0.0
 */

namespace Flyn\ProductOptions\Admin;

defined( 'ABSPATH' ) || exit;

use Flyn\ProductOptions\Xpo;

/**
 * Options class.
 */
class Options {

	/**
	 * Setup class.
	 *
	 * @since v.1.0.0
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'handle_external_redirects' ) );
		add_action( 'admin_menu', array( $this, 'menu_page_callback' ) );
		add_action( 'in_admin_header', array( $this, 'remove_all_notices' ) );

		add_filter( 'plugin_action_links_' . FLYNPO_BASE, array( $this, 'plugin_action_links_callback' ) );
		add_filter( 'plugin_row_meta', array( $this, 'plugin_settings_meta' ), 10, 2 );
	}

	/**
	 * Adds quick action links below the plugin name.
	 * **YOU NEED TO CUSTOMIZE THIS FUNCTION**
	 *
	 * @param array $links Default plugin action links.
	 * @return array Modified plugin action links.
	 */
	public function plugin_action_links_callback( $links ) {
		$setting_link                 = array();
		$setting_link['prad_options'] = '<a href="' . esc_url( admin_url( 'admin.php?page=flynpo-dashboard#lists' ) ) . '">' . esc_html__( 'Options', 'flyn-product-options' ) . '</a>';
		$upgrade_link                 = array();

		return array_merge( $setting_link, $links, $upgrade_link );
	}

	/**
	 * Adds extra links to the plugin row meta on the plugins page.
	 * **YOU NEED TO CUSTOMIZE THIS FUNCTION**
	 *
	 * @param array  $links Existing plugin meta links.
	 * @param string $file  Plugin file path.
	 * @return array Modified plugin meta links.
	 */
	public function plugin_settings_meta( $links, $file ) {
		if ( strpos( $file, 'flyn-product-options.php' ) !== false ) {
			$new_links = array(
				'prad_docs'    => '<a href="https://wpxpo.com/docs/wowaddons/?utm_source=db-wowaddons-plugin&utm_medium=doc&utm_campaign=wowaddons-dashboard" target="_blank">' . esc_html__( 'Docs', 'flyn-product-options' ) . '</a>',
				'prad_support' => '<a href="https://www.wpxpo.com/contact/" target="_blank">' . esc_html__( 'Support', 'flyn-product-options' ) . '</a>',
			);
			$links     = array_merge( $links, $new_links );
		}
		return $links;
	}

	/**
	 * Admin Menu Option Page
	 *
	 * @since v.1.0.0
	 * @return void
	 */
	public static function menu_page_callback() {
		$menupage_cap = Xpo::prad_old_view_permisson_handler();

		add_menu_page(
			__( 'Product Options', 'flyn-product-options' ),
			__( 'Product Options', 'flyn-product-options' ),
			$menupage_cap,
			'flynpo-dashboard',
			array( self::class, 'tab_page_content' ),
			FLYNPO_URL . '/assets/img/logo-menu.svg',
			58.5
		);

		add_submenu_page(
			'flynpo-dashboard',
			__( 'WowAddons Dashboard', 'flyn-product-options' ),
			__( 'Dashboard', 'flyn-product-options' ),
			$menupage_cap,
			'flynpo-dashboard'
		);

		$menu_lists              = array();
		$menu_lists['lists']     = esc_html__( 'Option Lists', 'flyn-product-options' );
		$menu_lists['analytics'] = esc_html__( 'Analytics', 'flyn-product-options' );
		$menu_lists['settings']  = esc_html__( 'Settings', 'flyn-product-options' );

		add_submenu_page(
			'edit.php?post_type=product',
			__( 'Product Options', 'flyn-product-options' ),
			__( 'Product Options', 'flyn-product-options' ),
			$menupage_cap,
			'wowaddons-page',
			array( __CLASS__, 'render_main' )
		);

		foreach ( $menu_lists as $key => $val ) {
			add_submenu_page(
				'flynpo-dashboard',
				$val,
				$val,
				$menupage_cap,
				'flynpo-dashboard#' . $key,
				array( __CLASS__, 'render_main' )
			);
		}
	}

	/**
	 * Go to Pro URL Redirect
	 *
	 * @since v.1.0.0
	 * @return NULL
	 */
	public function handle_external_redirects() {
        if ( empty( $_GET['page'] ) ) {     // @codingStandardsIgnoreLine
			return;
		}
        if ( 'go_prad_pro' === sanitize_text_field( $_GET['page'] ) ) {   // @codingStandardsIgnoreLine
			wp_safe_redirect( 'https://www.wpxpo.com/flyn-product-options-for-woocommerce/' );
			die();
		}
	}

	/**
	 * Initial Plugin Setting
	 *
	 * @since v.1.0.0
	 * @return void
	 */
	public static function tab_page_content() {
		echo wp_kses( '<div id="flynpo-dashboard-wrap"></div>', apply_filters( 'get_prad_allowed_html_tags', array() ) );
	}

	/**
	 * Remove All Notification From Menu Page
	 *
	 * @since v.1.0.0
	 * @return void
	 */
	public static function remove_all_notices() {
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash($_GET['page']) ) : ''; // phpcs:ignore
		if ( 'flynpo-dashboard' === $page ) {
			remove_all_actions( 'admin_notices' );
			remove_all_actions( 'all_admin_notices' );
			remove_all_actions( 'in_admin_header' );
		}
	}
}
