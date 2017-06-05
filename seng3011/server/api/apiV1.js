/*
 * ====================
 *    QUERY HANDLER
 * ====================
 */
handleQueryV1 = function(queryParams, startTime, isRetail, queryHeader) {
    var body = {};
    var data;

    // Check if parameters are given
    if(queryParams.State == null ||
        queryParams.Category == null ||
        queryParams.startDate == null ||
        queryParams.endDate == null){
        
        // Find which parameter is missing
        body = {message: "Missing Parameters"};
        if(queryParams.State == null) body.State = null;
        if(queryParams.Category == null) body.Category = null;
        if(queryParams.startDate == null) body.startDate = null;
        if(queryParams.endDate == null) body.endDate = null;

        // Generate the log and data
        genLog(body, startTime, queryParams, queryHeader, false, "missing parameters");
        data = {
            statusCode: 422,
            headers: {
                'Content-Type': 'application/json'
                },
            body: body
        };
    } else {
        // Check if any parameters are incorrect
        body = {message: "incorrect parameters"};
        var badState = false;
        var badCat = false;
        var badSDate = false;
        var badEDate = false;

        // Get states, categories and dates
        var states = queryParams.State.split(",");
        var cats = queryParams.Category.split(",");
        var startDate = queryParams.startDate.toString();
        var endDate = queryParams.endDate.toString();

        // Check if states are correct
        for (var i in states) {
            var isBad = true;

            // Check if state mapping exists
            for (var j in InputDetails.State) {
                if (states[i] == InputDetails.State[j].id) {
                    isBad = false;
                    break;
                }
            }

            // Mappping doesn't exist, add to incorrect state list
            if (isBad) {
                if (badState) {
                    body.State = body.State.concat(", " + states[i]);
                } else {
                    body.State = states[i];
                    badState = true;
                }
            }
        }

        // Check if categories are correct
        for (var i in cats) {
            var isBad = true;

            // Check if category mapping exists
            if (isRetail) {
                for (var j in InputDetails.Category.Retail) {
                    if (cats[i] == InputDetails.Category.Retail[j].id) {
                        isBad = false;
                        break;
                    }
                }
            } else {
                for (var j in InputDetails.Category.Merchandise) {
                    if (cats[i] == InputDetails.Category.Merchandise[j].id) {
                        isBad = false;
                        break;
                    }
                }
            }

            // Mapping doesnt exist, add to incorrect category list
            if (isBad) {
                if (badCat) {
                    body.Category = body.Category.concat(", " + cats[i]);
                } else {
                    body.Category = cats[i];
                    badCat = true;
                }
            }
        }

        // Check if dates are correct
        var testStart = Date.parse(startDate);
        var testEnd = Date.parse(endDate);

        if (isNaN(testStart) == true || !(/^\d{4}-\d{2}-\d{2}$/.test(startDate))) {
            body.startDate = startDate;
            badSDate = true;
        }

        if (isNaN(testEnd) == true || !(/^\d{4}-\d{2}-\d{2}$/.test(endDate))) {
            body.endDate = endDate;
            badEDate = true;
        }

        if (testStart > testEnd) {
            badSDate = true;
            body.endDate = endDate;
            body.startDate = startDate;
            body.message = body.message.concat(', endDate cannot be before startDate');
        }

        // Check if any parameters were incorrect
        if (badState || badCat || badSDate || badEDate) {
            // Incorrect parameters, generate log and return data
            genLog(body, startTime, queryParams, queryHeader, false, "incorrect parameters");
            data = {
                statusCode: 422,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            };
        } else {
            // Generate the ABS url
            var url = generateUrl(queryParams, isRetail);
            
            // Get API call results and format json
            var resultStat = HTTP.call("GET", url);
            var jsonObject = JSON.parse(resultStat.content);
            body = createJsonResponse(jsonObject, isRetail);

            // Generate log and data
            genLog(body, startTime, queryParams, queryHeader, true);
            var header = {
                'Content-Type' : 'application/json'
            }

            data = {
                statusCode: 200,
                headers: header,
                body: body
            };
        }
    }

    return data;
}

downloadHandlerV1 = function(queryParams, bodyParams) {
    var header;
    var body = bodyParams.request;
    body = JSON.parse(body);

    if (body == null) {
        return 'no data';
    }

    var date = new Date();

    // Check the format of the file
    if (queryParams.format == 'txt') {
        header = {
            'Content-Type' : 'text/plain',
            'Content-Disposition' : 'attachment; filename=electricstats' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '.txt'
        };

        body = JSON.stringify(body, null, 2);
    } else if (queryParams.format == 'json') {
        header = {
            'Content-Type' : 'application/json',
            'Content-Disposition' : 'attachment; filename=electricstats' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '.json'
        };
    } else if (queryParams.format == 'csv') {
        // Convert json to csv
        var str = '';
        for (var i = 0; i < body.data.length; i++) {
            var line = '';
            for (var index in body.data[i]) {
                if (line != '') line += ',';
                line += body.data[i][index];
            }
            str += line + '\r\n';
        }

        header = {
            'Content-Type' : 'text/csv',
            'Content-Disposition' : 'attachment; filename=electricstats' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '.csv'
        }

        body = str;
    }

    var data = {
        statusCode: 200,
        headers: header,
        body: body
    };
    
    return data;    
}

/* ====================
 * FORMATTING FUNCTIONS
 * ====================
 */
function generateUrl(queryParams, isRetail){
  var states = null;
  var categories = null;

  var paramStates = []; //Used to store state values we will use in url
  var paramCategories = []; //Used to store category values we will use in url

  if(queryParams.State != null){ //Check if we received any state params
    states = queryParams.State.split(","); //Split our string list into an array
  }

  if(queryParams.Category != null){
    categories = queryParams.Category.split(",");
  }

  if(states != null){ //Check if we have state params
    var stateList = InputDetails.State; //Get our state list

    for(var i in states){ //Loop through the state params
      for(var j in stateList){ //Loop through our state list
        if(stateList[j].id == states[i]){ //Check for a match
          //console.log(stateList[j]);
          if (isRetail || states[i] != "AUS") {
            paramStates.push(stateList[j].value); //Push that match
          } else {
            paramStates.push("-");
          }
        }
      }
    }
  }
    
  // Map passed in categories
  if(categories != null){
    var catList;
    if (isRetail) {
      catList = InputDetails.Category.Retail;
    } else {
      catList = InputDetails.Category.Merchandise;
    }

    for(var i in categories){
      for(var j in catList){
        if(catList[j].id == categories[i]){
          paramCategories.push(catList[j].value);
        }
      }
    }
  }

  // Format dates
  var startDate = queryParams.startDate.toString().replace(/-\d\d$/, '');
  var endDate = queryParams.endDate.toString().replace(/-\d\d$/, '');

  // Convert state and category lists to string
  var stateString = paramStates.join('+');
  var catString = paramCategories.join('+');

  // Generate the urls
  var url;
  if (isRetail) {
    url = "http://stat.data.abs.gov.au/sdmx-json/data/RT/" +
                                              stateString  + "." +
                              InputDetails.Datatype.Retail + "." +
                                                catString  + "." +
                            InputDetails.Adjustment.Retail + "." +
                            InputDetails.TimePeriod.Retail +
                                                       "/all?";
  } else {
    url = "http://stat.data.abs.gov.au/sdmx-json/data/MERCH_EXP/" +
                                                     stateString + "." +
                                                       catString + "." +
                            InputDetails.IndOfOrigin.Merchandise + "." +
                          InputDetails.CountryOfDest.Merchandise + "." +
                             InputDetails.TimePeriod.Merchandise + "/all?";
  }

  // Add the dates
  if(startDate != null){
    url = url + "startTime=" + startDate + "&";
  }

  if(endDate != null){
    url = url + "endTime=" + endDate + "&";
  }

  url = url + "dimensionAtObservation=allDimensions";
  return url;
}

function createJsonResponse(json, isRetail){
    var observations = json.dataSets[0].observations;
    var dimensionObservations = json.structure.dimensions.observation;
    var data = {data: []}
    
    for(var key in observations){
      var item = {};
      var price = observations[key][0];
      var series = key;
      var vals = series.split(':');
      
      if (isRetail) {
        item.Turnover = price;
      } else {
        item.Value = price;
      }

      for(var i = 0; i < vals.length; i++){
        var detailId = dimensionObservations[i].values[vals[i]].id;
        var dimension = dimensionObservations[i];
        var details = dimension.id;
        
        // Format dates
        if(details == "TIME_PERIOD"){
          var retYear = dimension.values[vals[i]].id.toString().replace(/-.*/, '');
          var retMonth = dimension.values[vals[i]].id.toString().replace(/^\d*?-/, '');
          var retDate = new Date(retYear, retMonth, 0);
          item.Date = retDate.getFullYear() + '-' + (retDate.getMonth() + 1) + '-' + retDate.getDate();
        }


        var outputValues;

        // Map ABS data to our format
        if (isRetail) {
          outputValues = RetailDetails[details];
        } else {
          outputValues = MerchandiseDetails[details];
        }

        for(var j in outputValues){
          var tempDetail = outputValues[j];
          if(tempDetail.id == detailId){
            item[tempDetail.output] = tempDetail.value;
            break;
          }
        }
      }
      
      data.data.push(item);
    }
    
    return data;
}

/*
 * ====================
 *  PARAMETER MAPPINGS
 * ====================
 */
var InputDetails = {
  "State":[{"id":"AUS", "value":0},
           {"id":"NSW", "value":1},
           {"id":"VIC", "value":2},
           {"id":"QLD", "value":3},
           {"id":"SA", "value":4},
           {"id":"WA", "value":5},
           {"id":"TAS", "value":6},
           {"id":"NT", "value":7},
           {"id":"ACT", "value":8}],
   "Category":{
     "Retail":[{"id":"Total", "value":20},
               {"id":"Food", "value":41},
               {"id":"HouseholdGood", "value":42},
               {"id":"ClothingFootwareAndPersonalAccessory", "value":43},
               {"id":"DepartmentStores", "value":44},
               {"id":"Other", "value":45},
               {"id":"CafesRestaurantsAndTakeawayFood", "value":46}],
     "Merchandise":[{"id":"Total", "value":-1},
                    {"id":"FoodAndLiveAnimals", "value":0},
                    {"id":"BeveragesAndTobacco", "value":1},
                    {"id":"CrudeMaterialAndInedible", "value":2},
                    {"id":"MineralFuelLubricantAndRelatedMaterial", "value":3},
                    {"id":"AnimalAndVegetableOilFatAndWaxes", "value":4},
                    {"id":"ChemicalsAndRelatedProducts", "value":5},
                    {"id":"ManufacturedGoods", "value":6},
                    {"id":"MachineryAndTransportEquipments", "value":7},
                    {"id":"OtherManufacturedArticles", "value":8},
                    {"id":"Unclassified", "value":9}]
   },
   "Datatype":{
     "Retail":2
   },
   "Adjustment":{
     "Retail":10
   },
   "IndOfOrigin":{
     "Merchandise":-1
   },
   "CountryOfDest":{
     "Merchandise":"-"
   },
   "TimePeriod":{
     "Retail":'M',
     "Merchandise":'M'
   }
};

var RetailDetails = {
  "IND_R":[{"id":20, "value":"Total", "output":"RetailIndustry"},
           {"id":41, "value":"Food", "output":"RetailIndustry"},
           {"id":42, "value":"HouseholdGood", "output":"RetailIndustry"},
           {"id":43, "value":"ClothingFootwareAndPersonalAccessory", "output":"RetailIndustry"},
           {"id":44, "value":"DepartmentStores", "output":"RetailIndustry"},
           {"id":45, "value":"Other", "output":"RetailIndustry"},
           {"id":46, "value":"CafesRestaurantsAndTakeawayFood", "output":"RetailIndustry"}],
  "ASGC_2010":[{"id":0, "value":"AUS", "output":"State"},
               {"id":1, "value":"NSW", "output":"State"},
               {"id":2, "value":"VIC", "output":"State"},
               {"id":3, "value":"QLD", "output":"State"},
               {"id":4, "value":"SA", "output":"State"},
               {"id":5, "value":"WA", "output":"State"},
               {"id":6, "value":"TAS", "output":"State"},
               {"id":7, "value":"NT", "output":"State"},
               {"id":8, "value":"ACT", "output":"State"}]
};

var MerchandiseDetails = {
    "SITC_REV3":[{"id":-1, "value":"Total", "output":"Commodity"},
                 {"id":0, "value":"FoodAndLiveAnimals", "output":"Commodity"},
                 {"id":1, "value":"BeveragesAndTobacco", "output":"Commodity"},
                 {"id":2, "value":"CrudeMaterialAndInedible", "output":"Commodity"},
                 {"id":3, "value":"MineralFuelLubricantAndRelatedMaterial", "output":"Commodity"},
                 {"id":4, "value":"AnimalAndVegetableOilFatAndWaxes", "output":"Commodity"},
                 {"id":5, "value":"ChemicalsAndRelatedProducts", "output":"Commodity"},
                 {"id":6, "value":"ManufacturedGoods", "output":"Commodity"},
                 {"id":7, "value":"MachineryAndTransportEquipments", "output":"Commodity"},
                 {"id":8, "value":"OtherManufacturedArticles", "output":"Commodity"},
                 {"id":9, "value":"Unclassified", "output":"Commodity"}],
    "REGION":[{"id":'-', "value":"AUS", "output":"State"},
              {"id":1, "value":"NSW", "output":"State"},
              {"id":2, "value":"VIC", "output":"State"},
              {"id":3, "value":"QLD", "output":"State"},
              {"id":4, "value":"SA", "output":"State"},
              {"id":5, "value":"WA", "output":"State"},
              {"id":6, "value":"TAS", "output":"State"},
              {"id":7, "value":"NT", "output":"State"},
              {"id":8, "value":"ACT", "output":"State"}]
};


/*
 * ====================
 *      API LOGGER
 * ====================
 */
function genLog(body, startTime, queryParams, queryHeader, wasSuccessful, error) {
    var log = {};
    log.team = 'Electric Boogaloo';
    log.api_version = 'v1';
    log.parameters = {};
    
    // Get passed in parameters
    for (var param in queryParams) {
        log.parameters[param] = queryParams[param];
    }

    // Get execution start and end date
    var startDate = startTime.getUTCDate() + "/" + (startTime.getUTCMonth() + 1) + "/" + startTime.getUTCFullYear() + " " + startTime.getUTCHours() + ":" + startTime.getUTCMinutes() + ":" + startTime.getUTCSeconds() + " UTC";
    log.execution_start = startDate;

    endTime = new Date();
    var endDate = endTime.getUTCDate() + "/" + (endTime.getUTCMonth() + 1) + "/" + endTime.getUTCFullYear() + " " + endTime.getUTCHours() + ":" + endTime.getUTCMinutes() + ":" + endTime.getUTCSeconds() + " UTC";
    log.execution_end = endDate;

    // Get elapsed time
    var elapsed = (endTime.getTime() - startTime.getTime()) / 1000;
    log.elapsed_seconds = elapsed;

    // Check if call was successful
    if (wasSuccessful) {
        log.call_result = 'success'
    } else {
        log.call_result = 'failure'
        log.call_error = error;
    }

    // Add log to returned body
    body.log = Object.assign({}, log);

    // Get user ip and agent
    log.user_ip = queryHeader['x-forwarded-for'];
    log.user_agent = queryHeader['user-agent'];
    delete log.team;

    // Insert log into db
    // logCollection.insert(log);
};
