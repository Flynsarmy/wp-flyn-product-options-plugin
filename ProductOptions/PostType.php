<?php // phpcs:ignore
/**
 * PostType Action.
 *
 * @package PRAD\Options
 * @since v.1.0.0
 */
namespace Flyn\ProductOptions;

defined( 'ABSPATH' ) || exit;

/**
 * PostType class.
 */
class PostType {

	/**
	 * Setup class.
	 *
	 * @since v.1.0.0
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'post_type_callback' ) );
	}


	/**
	 * Option PostType
	 *
	 * @since v.1.0.0
	 */
	public function post_type_callback() {
		$labels = array(
			'name'               => _x( 'Option', 'Option', 'flyn-product-options' ),
			'singular_name'      => _x( 'Option', 'Option', 'flyn-product-options' ),
			'menu_name'          => __( 'Option', 'flyn-product-options' ),
			'parent_item_colon'  => __( 'Parent Option', 'flyn-product-options' ),
			'all_items'          => __( 'Option', 'flyn-product-options' ),
			'view_item'          => __( 'View Option', 'flyn-product-options' ),
			'add_new_item'       => __( 'Add New', 'flyn-product-options' ),
			'add_new'            => __( 'Add New', 'flyn-product-options' ),
			'edit_item'          => __( 'Edit Option', 'flyn-product-options' ),
			'update_item'        => __( 'Update Option', 'flyn-product-options' ),
			'search_items'       => __( 'Search Option', 'flyn-product-options' ),
			'not_found'          => __( 'No Option Found', 'flyn-product-options' ),
			'not_found_in_trash' => __( 'Not Option found in Trash', 'flyn-product-options' ),
		);
		$args   = array(
			'labels'              => $labels,
			'show_in_rest'        => true,
			'supports'            => array( 'title', 'editor' ),
			'hierarchical'        => false,
			'public'              => false,
			'rewrite'             => false,
			'show_ui'             => false,
			'show_in_menu'        => false,
			'show_in_nav_menus'   => false,
			'exclude_from_search' => true,
			'capability_type'     => 'page',
		);
		register_post_type( 'prad_option', $args );
	}
}
