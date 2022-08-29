/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import { filterBlocksEdit, filterBlocksAttrs } from './helpers';

addFilter('blocks.registerBlockType', 'wp-cls/addAttrs', filterBlocksAttrs);
addFilter('editor.BlockEdit', 'wp-cls/filterEdit', filterBlocksEdit, 20);
