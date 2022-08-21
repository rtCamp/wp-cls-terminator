import { addFilter } from '@wordpress/hooks';
import { filterBlocksEdit, filterBlocksAttrs, filterBlocksSave } from './helpers'

addFilter( 'blocks.registerBlockType', 'wp-cls/addAttrs', filterBlocksAttrs );
addFilter( 'editor.BlockEdit', 'wp-cls/filterEdit', filterBlocksEdit, 20 );
// addFilter( 'blocks.getSaveElement', 'wp-cls/filterSave', filterBlocksSave );
