<?php
/**
 * Enqueue Assets
 *
 * @package WP_CLS_Terminator
 */

namespace WP_CLS_Terminator;

/**
 * Class Assets
 */
class Assets {
	/**
	 * Init
	 */
	public function init() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueue Assets
	 */
	public function enqueue_assets() {
		$deps = require(WP_CLS_TERMINATOR_PATH . '/assets/build/js/cls-terminator.asset.php');

		wp_enqueue_script(
			'wp-cls-terminator',
			WP_CLS_TERMINATOR_URL . '/assets/build/js/cls-terminator.js',
			$deps['dependencies'],
			filemtime( WP_CLS_TERMINATOR_PATH . '/assets/build/js/cls-terminator.js' ),
		);

		wp_enqueue_style(
			'wp-cls-terminator',
			WP_CLS_TERMINATOR_URL . '/assets/build/css/cls-terminator.css',
			array(),
			filemtime( WP_CLS_TERMINATOR_PATH . '/assets/build/css/cls-terminator.css' )
		);
	}
}
