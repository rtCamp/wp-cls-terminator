<?php
/**
 * Plugin Name: WP CLS Terminator
 * Description: Terminate Layout Shift from Embeds
 * Plugin URI:  https://rtcamp.com
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Version:     1.0
 * Text Domain: wp-cls-terminator
 *
 * @package WP_CLS_Terminator
 */

define( 'WP_CLS_TERMINATOR_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'WP_CLS_TERMINATOR_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

require_once WP_CLS_TERMINATOR_PATH . '/includes/class-cls-terminator.php';
require_once WP_CLS_TERMINATOR_PATH . '/includes/class-asset.php';

$cls_terminator = new WP_CLS_Terminator\CLS_Terminator();
$cls_terminator->init();

$assets = new WP_CLS_Terminator\Asset();
$assets->init();
