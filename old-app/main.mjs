/**
 * Internal dependencies
 */
import { default as viewportSizes } from './viewports.mjs';

document.addEventListener( 'DOMContentLoaded', () => {
	const run = async () => {
		const markup = `
		<blockquote class="twitter-tweet">
		<p lang="en" dir="ltr">Native &lt;img&gt; lazy-loading is coming to the web! <a href="https://t.co/LgF7F1iMgR">https://t.co/LgF7F1iMgR</a> &lt;img loading=lazy&gt; defers offscreen images until the user scrolls near them. Shipping in Chrome ~75 <a href="https://t.co/4gR7lvx4zx">https://t.co/4gR7lvx4zx</a> <a href="https://t.co/luCHEfLkKD">pic.twitter.com/luCHEfLkKD</a></p>
		— Addy Osmani (@addyosmani) <a href="https://twitter.com/addyosmani/status/1114777583302799360?ref_src=twsrc%5Etfw">April 7, 2019</a>
		</blockquote>
		<script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		`;
		const results = await calculate( { markup } );
		console.log( results );
	};
	run();
} );

async function calculate( { markup } ) {
	const results = [];

	for ( const viewportSize of viewportSizes ) {
		const data = await calculateViewportSize( {
			markup,
			...viewportSize,
		} );

		results.push( {
			...data,
			viewportSize,
		} );
	}
	return results;
}

async function calculateViewportSize( { width, height, markup } ) {
	const oldIframe = document.querySelector( 'iframe' );
	const iframeWrapper = oldIframe.parentNode;

	console.log( oldIframe );
	console.log( iframeWrapper );
	console.log( 'running' );

	const iframe = document.createElement( 'iframe' );
	iframe.src = 'about:blank';
	iframe.width = width;
	iframe.height = height;
	iframeWrapper.replaceChild( iframe, oldIframe );

	// keep the iframe hidden from outside view
	iframe.style.display = 'none';

	const html = `
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
      <div>${ markup }</div>
      <hr>
      <script type="module">
      import { watchForEmbedLoaded } from "./measurement.mjs";
      (async () => {
        const data = await watchForEmbedLoaded(document.querySelector('div'));
        parent.postMessage(data);
      })();
      </script>
    </body>
    </html>
  `;

	return new Promise( ( resolve, reject ) => {
		window.addEventListener(
			'message',
			( event ) => {
				if ( event.source === iframe.contentWindow ) {
					resolve( event.data );
				}
			},
			{ once: true },
		);
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write( html );
		iframe.contentWindow.document.close();

		setTimeout( reject, 10000 );
	} );
}
