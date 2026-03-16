<?php
/**
 * Plugin Name: Flyn Product Options for WooCommerce
 * Description: The ultimate WooCommerce product addons plugin to add extra product options, including, swatches, image uploads, text area, and more!
 * Version:     1.5.9
 * Author:      Flyn San, WPXPO
 * Author URI:  https://www.wpxpo.com/about
 * Text Domain: flyn-product-options
 * License:     GPLv3
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package WowAddons
 */

require_once __DIR__ . '/vendor/autoload.php';

use Flyn\ProductOptions\Blocks\BlocksBootstrap;
use Flyn\ProductOptions\Common\Functions;
use Flyn\ProductOptions\Initialization;

defined( 'ABSPATH' ) || exit;

// Define Vars.
define( 'FLYNPO_VER', '1.5.9' );
define( 'FLYNPO_URL', plugin_dir_url( __FILE__ ) );
define( 'FLYNPO_BASE', plugin_basename( __FILE__ ) );
define( 'FLYNPO_PATH', plugin_dir_path( __FILE__ ) );

if ( ! function_exists( 'flynpo_product_options' ) ) {
	function flynpo_product_options() {
		return new Functions();
	}
}

add_action( 'plugins_loaded', 'flynpo_init', 10 );
function flynpo_init() {
	new Initialization();
	$bootstrap = BlocksBootstrap::get_instance();
	$bootstrap->init();
}

