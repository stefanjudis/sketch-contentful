@import 'utils.js';


/**
 * Populate all layers in a document
 */
function populateData( context ) {
  initContext( context );

  var counts = {
    successful : 0,
    failed     : 0
  };

  var fieldLayers = page.children().forEach( function( kid ) {
    var connectedEntry = kid.name().match( /{entry:(.+?)}/ );

    if ( connectedEntry ) {
      var data = fetchJSON( 'https://cdn.contentful.com/spaces/f20lfrunubsq/entries?access_token=0f72dc3f46a2fd76a80145a476ef0f9daf5adce19462787499c1b0f4f2d1c98e&sys.id=' + connectedEntry[ 1 ] ).items[ 0 ];

      log( data );

      kid.children().forEach( function( layer ) {
        var connectedField = layer.name().match( /{fields:(.+?)}/ );

        if ( connectedField ) {
          if ( /^<MSTextLayer:/.test( layer.toString() ) ) {
            log( connectedField[ 1 ] );
            if ( data.fields[ connectedField[ 1 ] ] ) {
              layer.setStringValue( data.fields[ connectedField[ 1 ] ] );

              counts.successful++;
            } else {
              counts.failed++;
            }
          }
        }
      } );
    }
  } );

  context.api().message(
    counts.successful + ' layer(s) populated. ' + counts.failed + ' layer(s) failed.'
  );
}


/**
 * Fetch JSON from a given URL
 */
function fetchJSON( url ) {
  var request = NSMutableURLRequest.new();
  [request setHTTPMethod:@"GET"];
  [request setURL:[NSURL URLWithString:url]];

  var error = NSError.new();
  var responseCode = null;

  var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

  var dataString = [[NSString alloc] initWithData:oResponseData encoding:NSUTF8StringEncoding];

  return JSON.parse( dataString );
}
