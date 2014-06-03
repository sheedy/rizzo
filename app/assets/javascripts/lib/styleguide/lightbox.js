require([ "jquery" ], function($) {
  "use strict";

  $("#js-row--content").on(":lightbox/open", function( ) {
    $("#js-row--content").trigger( ":lightbox/renderContent", "<img src='http://images-resrc.staticlp.com/S=W600M/http://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br><img src='http://images-resrc.staticlp.com/S=W600M/http://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br><img src='http://images-resrc.staticlp.com/S=W600M/http://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br><img src='http://images-resrc.staticlp.com/S=W600M/http://media.lonelyplanet.com/assets/3882f3ac175d4fca7ef032f0a2bb9920346cc6e2077a3060b64b3ee5309628f7/1494f259491a4d9b222e2e4d37d3b9895d7068c52ba005f1c0424b431a538bd4.jpg'  /><br>" );
  });

});
