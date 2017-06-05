import { Mongo } from 'meteor/mongo';
import './apiV1.js';
import './apiV2.js';

// Set up v1 restivus object
var ApiV1 = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  useDefaultAuth: true,
  prettyJson: true,
});

// Set up v2 restivus object
var ApiV2 = new Restivus({
  apiPath: 'api/',
  version: 'v2',
  useDefaultAuth: true,
  prettyJson: true,
});

//Default collection routing
// ApiV1.addCollection(CardInfo);
// ApiV2.addCollection(CardInfo);

/*
 * ====================
 *      API ROUTES
 * ====================
 */
// ApiV1.addRoute('cardinfo', {
//   get: function(){
//     version = 'v1';
//     return CardInfo.find().fetch();
//   }
// });

// V1 retail query handler
ApiV1.addRoute('retail', {
  get: function(){
    version = 'v1';
    var startTime = new Date();
    return handleQueryV1(this.queryParams, startTime, true, this.request.headers);
  }
});

// V1 merchandise query handler
ApiV1.addRoute('merchandise', {
    get: function() {
        version = 'v1';
        var startTime = new Date();
        return handleQueryV1(this.queryParams, startTime, false, this.request.headers);
    }
});

// V1 download handler
ApiV1.addRoute('download', {
    post: function() {
        return downloadHandlerV1(this.queryParams, this.bodyParams);
    }        
});

ApiV2.addRoute('cardinfo', {
  get: function(){
    return CardInfo.find().fetch();
  }
});

// V2 retail query handler
ApiV2.addRoute('retail', {
  get: function(){
    var startTime = new Date();
    return handleQueryV2(this.queryParams, startTime, true, this.request.headers);
  }
});

// V2 merchandise query handler
ApiV2.addRoute('merchandise', {
    get: function() {
        var startTime = new Date();
        return handleQueryV2(this.queryParams, startTime, false, this.request.headers);
    }
});

// V2 download handler
ApiV2.addRoute('download', {
    post: function() {
        return downloadHandlerV2(this.queryParams, this.bodyParams);
    }
});

ApiV2.addRoute('returns', {
    get: function() {
        return handleReturnsQuery(this.queryParams);
    }
});

ApiV2.addRoute('sentiment', {
    get: function() {
        return sentimentAnalysis(this.queryParams);
    }
});
