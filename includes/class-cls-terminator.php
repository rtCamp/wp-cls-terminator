<?php
/**
 * Handle CLS Terminator Ops
 *
 * @package WP_CLS_Terminator
 */

namespace WP_CLS_Terminator;

/**
 * Class CLS_Terminator
 */
class CLS_Terminator {

		/**
		 * Init
		 */
	public function init() {
		add_filter( 'render_block', [ $this, 'filter_rendered_block' ], 0, 2 );
	}

	/**
	 * Filters the content embed blocks to remove the layout shift.
	 *
	 * @param string $block_content The block content about to be appended.
	 * @param array  $block         The full block, including name and attributes.
	 * @return string Filtered block content.
	 */
	public function filter_rendered_block( $block_content, $block ) {
		if ( ! isset( $block['blockName'] ) ) {
			return $block_content;
		}

		if ( 'core/embed' !== $block['blockName'] ) {
			return $block_content;
		}

		if ( ! isset( $block['attrs']['url'] ) || ! isset( $block['attrs']['embedHeightWidth'] ) ) {
			return $block_content;
		}

		$device_breakpoints = [
			'desktop' => 1920,
			'laptop'  => 1280,
			'tablet'  => 768,
			'mobile'  => 375,
		];

		$class_name = sprintf( 'cls-terminator-%s', md5( $block['attrs']['url'] ) );

		$css = '';

		foreach ( $block['attrs']['embedHeightWidth'] as $breakpoint => $dimensions ) {
			$css .= sprintf(
				"\n\t@media (min-width: %spx) {\n\t\t.{$class_name} { min-height: %spx; }\n\t}\n",
				$device_breakpoints[ $breakpoint ],
				$dimensions['height'],
				$dimensions['width']
			);
		}

		$block_content = sprintf(
			'<style>%s</style><div class="%s">%s</div>',
			$css,
			$class_name,
			$block_content
		);

		return $block_content;
	}
}
