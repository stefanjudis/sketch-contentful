@import 'utils.js';


/**
 * Populate all layers in a document
 */
function populateData( context ) {
  initContext( context );

  layersSuccessfulFilled = 0;
  errors = [];

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
              if ( typeof data.fields[ connectedField[ 1 ] ] === 'string' ) {
                layer.setStringValue( data.fields[ connectedField[ 1 ] ] );

                layersSuccessfulFilled++;
              } else {
                errors.push(
                  '`' + connectedField[ 1 ] + '` in entry `' + connectedEntry[ 1 ] + '` is not a string value'
                );
              }
            } else {
              errors.push(
                'Could not find `' + connectedField[ 1 ] + '` in data for `' + connectedEntry[ 1 ] + '`'
              );
            }
          }
        }
      } );
    }
  } );

  if ( errors.length ) {
    createErrorReportWindow( errors ).runModal();
  } else {
    context.api().message(
      layersSuccessfulFilled + ' layer(s) populated.'
    );
  }
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
