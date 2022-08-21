import { ToggleControl, PanelBody, Button, Spinner } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { isFunction, isObject, isString } from 'lodash';
import { __ } from '@wordpress/i18n';
import { default as viewports } from './viewports';
import { iframeMarkup } from './iframe-template';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { default as breakpoints } from './breakpoints';

export const filterBlocksAttrs = ( settings, name ) => {
    if ( ! isObject( settings ) || ! isString( name ) ) {
		return settings;
	}

    if ( 'core/embed' !== name ){
        return settings;
    }

    if ( ! settings.attributes ) {
        settings.attributes = {};
    }

    settings.attributes.embedHeightWidth = {
        type: 'object',
        default: {},
    };

    return settings;
}

/**
 * Filters blocks edit function of all blocks.
 *
 * @param {Function} BlockEdit function.
 * @return {Function} Edit function.
 */
export const filterBlocksEdit = ( BlockEdit ) => {
	if ( ! isFunction( BlockEdit ) ) {
		return BlockEdit;
	}

	const EnhancedBlockEdit = ( props ) => {
		const { isSelected, name } = props;

		if ( isSelected && 'core/embed' === name ) {
			return (
				<>
					<BlockEdit { ...props } />
					<CLSTerminatorButton { ...props } />
				</>
			);
		}

		return <BlockEdit { ...props } />;
	};

	return EnhancedBlockEdit;
};


const CLSTerminatorButton = ( props ) => {
    const [ loading, setLoading ] = useState( false );
    const [ calculateText, setCalculateText ] = useState( '' );
    const { attributes, setAttributes } = props;
    
	const terminator = async () => {
        setLoading( true );

        const results = {};

        const { html } =  await apiFetch( {
            path: addQueryArgs( '/oembed/1.0/proxy', { url: attributes.url } ),
        } );

        // for ( const viewport of viewports ) {
        //     setCalculateText( `Measuring embed height and width for viewport ${viewport.height}x${viewport.width}` );
        //     const { height, width } = await calculate( html, viewport );
        //     results.push( { height, width } );

        //     if ( document.getElementById( 'optimized-preview' ) ) {
        //         document.getElementById( 'optimized-preview' ).remove();
        //     }
        // }

        for ( const breakpoint of Object.keys( breakpoints ) ) {
            setCalculateText( `Measuring embed height and width for breakpoint ${breakpoint}` );
            const { height, width } = await calculate( html, breakpoints[ breakpoint ] );
            results[ breakpoint ] = { height, width };

            if ( document.getElementById( 'optimized-preview' ) ) {
                document.getElementById( 'optimized-preview' ).remove();
            }
        }

        setLoading( false );
        setCalculateText( '' );

        setAttributes( {
            embedHeightWidth: results,
        } );
    }

	return (
		<InspectorControls>
			<PanelBody title={ __( 'CLS Terminator Settings', 'wp-cls' ) }>
                <p>{ __( 'Layout shift degrades PX, so add height to the element already.', 'wp-cls' ) }</p>
				<Button
                    variant='primary'
                    text={ loading ? [__( 'Terminating', 'wp-cls' ), <Spinner key={ 'terminator-spinner' } />] : __( 'Terminate Layout Shift', 'wp-cls' ) }
                    onClick={ terminator } 
                />
                <p>
                    { calculateText }
                </p>
			</PanelBody>
		</InspectorControls>
	);
}

const calculate = ( html, breakpoint ) => {
    const viewportMeasureIframe = document.createElement( 'iframe' );
    const markup = iframeMarkup( html );
    const name = 'embed-height-calculator';

    viewportMeasureIframe.id = 'optimized-preview';
    viewportMeasureIframe.src = 'about:blank';
    viewportMeasureIframe.width = breakpoint;
    viewportMeasureIframe.height = '100%';

    if ( ! document.getElementById( 'optimized-preview' ) ) {
        document.body.appendChild( viewportMeasureIframe );
    }

    return new Promise( ( resolve, reject ) => {
        window.addEventListener(
            'message',
            ( event ) => {
                if ( event.source === viewportMeasureIframe.contentWindow && event.data.name === name ) {
                    resolve( event.data );
                }
            },
            { once: true },
        );

        viewportMeasureIframe.contentWindow.document.open();
        viewportMeasureIframe.contentWindow.document.write( markup );
        viewportMeasureIframe.contentWindow.document.close();

        setTimeout( () => {
            reject( new Error( 'Timeout' ) );
        }, 10000 );
    } );
}
