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

  var spaceId = command.valueForKey_onDocument_forPluginIdentifier(
    'spaceId',
    docData,
    'contentful'
  );

  var cdaToken = command.valueForKey_onDocument_forPluginIdentifier(
    'cdaToken',
    docData,
    'contentful'
  );

  if ( spaceId.trim() == '' || cdaToken.trim() == '' ) {
    log( 'in it' );
    return context.api().message(
      'Please define Space Id and Content Delivery API token in the settings'
    );
  }

  var fieldLayers = page.children().forEach( function( kid ) {
    var connectedEntry = kid.name().match( /{entry:(.+?)}/ );

    if ( connectedEntry ) {
      var data = fetchJSON(
        'https://cdn.contentful.com/spaces/' + spaceId + '/entries?access_token=' + cdaToken + '&sys.id=' + connectedEntry[ 1 ]
      ).items[ 0 ];

      kid.children().forEach( function( layer ) {
        var connectedField = layer.name().match( /{fields:(.+?)}/ );

        if ( connectedField ) {
          if ( /^<MSTextLayer:/.test( layer.toString() ) ) {
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
