export const iframeMarkup = (html) => {
	const name = 'embed-height-calculator';
	const markup = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <style>
        /* Add border to prevent margin collapsing. */
        /*body > div { border: solid 1px transparent; }*/
    </style>
    </head>
    <body>
    <div>${html}</div>
    <script>
    function watchForEmbedLoaded( container ) {
        const windowLoaded = new Promise( ( resolve ) => {
            window.addEventListener( 'load', resolve );
        } );
    
        const startTime = new Date();
    
        return new Promise( ( resolve, reject ) => {
            const resolveWithResolution = () => {
                resolve( {
                    name: '${name}',
                    duration: new Date().valueOf() - startTime.valueOf(),
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                } );
            };
    
            // Allow up to 5 seconds to size the embed.
            setTimeout( resolveWithResolution, 5000 );
    
            // If there is no JS script in the embed, resolve once window loaded.
            // This allows us to obtain dimensions for an image/video that lacks
            // width/height attributes.
            const script = container.querySelector(
                'script:not([type]), script[type="module"], script[type~="javascript"], *[onload]',
            );
            if ( ! script ) {
                const dimensionLessVideo = container.querySelector(
                    'video:not([width][height])',
                );
                if ( dimensionLessVideo ) {
                    if ( dimensionLessVideo.videoWidth && dimensionLessVideo.videoHeight ) {
                        resolveWithResolution();
                    } else {
                        dimensionLessVideo.addEventListener(
                            'loadedmetadata',
                            resolveWithResolution,
                        );
                    }
                } else {
                    windowLoaded.then( resolveWithResolution );
                }
                return;
            }
    
            // Start listening for DOM changes, and stop once a 2.5-second pause is encountered.
            let resolveTimeoutId = 0;
            const mutationObserver = new MutationObserver( () => {
                clearTimeout( resolveTimeoutId );
    
                const complete = () => {
                    mutationObserver.disconnect();
                    resolveWithResolution();
                };
    
                resolveTimeoutId = setTimeout( complete, 2500 );
            } );
            mutationObserver.observe( container, {
                subtree: true,
                childList: true,
                attributes: true,
            } );
        } );
    }
    (
        async () => {
            const data = await watchForEmbedLoaded( document.querySelector( 'div' ) );
            parent.postMessage( data );
        }
    )();
    </script>
    </body>
    </html>
`;

	return markup;
};
