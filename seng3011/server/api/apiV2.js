import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1';
import Future from 'fibers/future';

var cookie = 'B=7qonscpcifjl8&b=3&s=v8';
var crumb = 'ULuZabrseyt';

/*
 * ====================
 *    QUERY HANDLER
 * ====================
 */
handleQueryV2 = function(queryParams, startTime, isRetail, queryHeader) {
    var body = {};
    var data;
    
    // Check if parameters are correct
    if(queryParams.State == null ||
        queryParams.Category == null ||
        queryParams.startDate == null ||
        queryParams.endDate == null){
        // Set up data object
        body = {message: "Missing Parameters"};

        // Figure out which parameters are missing
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
        body = {message: "incorrect parameters"};
        var badState = false;
        var badCat = false;
        var badSDate = false;
        var badEDate = false;

        // Get states, categories, start date and end date
        var states = queryParams.State.split(",");
        var cats = queryParams.Category.split(",");
        var startDate = queryParams.startDate.toString();
        var endDate = queryParams.endDate.toString();

        // Chech if all passsed in states are correct
        for (var i in states) {
            var isBad = true;

            // Find mapping for state
            for (var j in InputDetails.State) {
                if (states[i] == InputDetails.State[j].id) {
                    isBad = false;
                    break;
                }
            }

            // If no mapping was found, add to incorrect state list
            if (isBad) {
                if (badState) {
                    body.State = body.State.concat(", " + states[i]);
                } else {
                    body.State = states[i];
                    badState = true;
                }
            }
        }

        // Check if all passed in categories are correct
        for (var i in cats) {
            var isBad = true;

            // Find mapping for category
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

            // If no mapping was found, add to incorrect category list
            if (isBad) {
                if (badCat) {
                    body.Category = body.Category.concat(", " + cats[i]);
                } else {
                    body.Category = cats[i];
                    badCat = true;
                }
            }
        }

        var testStart = Date.parse(startDate);
        var testEnd = Date.parse(endDate);

        // Check if start date is a correct date
        if (isNaN(testStart) == true || !(/^\d{4}-\d{2}-\d{2}$/.test(startDate))) {
            body.startDate = startDate;
            badSDate = true;
        }

        // Check if end date is a correct date
        if (isNaN(testEnd) == true || !(/^\d{4}-\d{2}-\d{2}$/.test(endDate))) {
            body.endDate = endDate;
            badEDate = true;
        }

        // Check if start is after end
        if (testStart > testEnd) {
            badSDate = true;
            body.endDate = endDate;
            body.startDate = startDate;
            body.message = body.message.concat(', endDate cannot be before startDate');
        }
        
        if (badState || badCat || badSDate || badEDate) {
            // Bad parameters were found, generate log and data
            genLog(body, startTime, queryParams, queryHeader, false, "incorrect parameters");
            data = {
                statusCode: 422,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            };
        } else {
            states.sort();
            cats.sort();

            var stateString = states.join(',');
            var catString = cats.join(',');

            var cacheHit = statCache.findOne({'States' : stateString, 'Categories' : catString, 'StartDate' : queryParams.startDate, 'EndDate' : queryParams.endDate});

            if (cacheHit) {
                body = cacheHit.data;
            } else {
                // Generate ABS url
                var url = generateUrl(queryParams, isRetail);
            
                // Get call results
                var resultStat = HTTP.call("GET", url);
            
                // Parse the result
                var jsonObject = JSON.parse(resultStat.content);
                body = createJsonResponse(jsonObject, isRetail);

                var cacheData = {'States' : stateString, 'Categories' : catString, 'StartDate' : queryParams.startDate, 'EndDate' : queryParams.endDate, 'data' : body};
                statCache.insert(cacheData);
            }

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

downloadHandlerV2 = function(queryParams, bodyParams) {
    var header;
    var body = bodyParams.request;
    body = JSON.parse(body);

    // Check if there is data
    if (body == null) {
        return 'no data';
    }

    var date = new Date();

    // Check what format was requested
    if (queryParams.format == 'txt') {
        header = {
            'Content-Type' : 'text/plain',
            'Content-Disposition' : 'attachment; filename=electricstats' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '.txt'
        };

        body = JSON.stringify(body, null, 2);
    } else if (this.queryParams.format == 'json') {
        header = {
            'Content-Type' : 'application/json',
            'Content-Disposition' : 'attachment; filename=electricstats' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '.json'
        };
    } else if (this.queryParams.format == 'csv') {
        var str = '';
        // Convert the json to csv
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

handleReturnsQuery = function(queryParams) {
    if (queryParams.InstrumentID == null ||
        queryParams.ListOfVar == null ||
        queryParams.UpperWindow == null ||
        queryParams.LowerWindow == null ||
        queryParams.DateOfInterest == null ||
        !(/^\d{2}\/\d{2}\/\d{4}$/.test(queryParams.DateOfInterest))) {
        return {
            statusCode: 422,
            headers: {
                'Content-Type': 'application/json'
            },
            body: 'Incorrect Parameters'
        };
    } else {
        var dateArr = /(\d{2})\/(\d{2})\/(\d{4})/.exec(queryParams.DateOfInterest);

        var startDate = new Date(dateArr[3], dateArr[2] - 1, dateArr[1]);
        var endDate = new Date(dateArr[3], dateArr[2] - 1, dateArr[1]);
        startDate.setDate(startDate.getDate() - 2 * queryParams.LowerWindow - 1)
        endDate.setDate(endDate.getDate() + 2 * queryParams.UpperWindow);
        
        var instruments = queryParams.InstrumentID.split(',');
        var data = {'CompanyReturns' : []};

        for (var i in instruments) {
            data['CompanyReturns'].push({'InstrumentID' : instruments[i], 'Data' : []}); 
            var cacheHit = retCache.findOne({'InstrumentID' : instruments[i], 'DOI' : queryParams.DateOfInterest, 'Lower' : queryParams.LowerWindow, 'Upper' : queryParams.UpperWindow});


            if (cacheHit) {
                data['CompanyReturns'][i]['Data'] = cacheHit['data'];

                // TEMP CHANGES for date
                for (var x = 0; x < data['CompanyReturns'][i]['Data'].length; x++) {
                    var date = data['CompanyReturns'][i]['Data'][x]['Date'];
                    var date_regex = /(\d{2})\/(\d{2})\/(\d{4})/;
                    var matches = date_regex.exec(date);
                    if (matches) {
                        data['CompanyReturns'][i]['Data'][x]['Date'] = matches[3] + "-" + matches[2] + "-" + matches[1];
                    } else {
                        continue;
                    }
                }
            } else {
                var vals = getReturns(instruments[i], startDate, endDate, queryParams.DateOfInterest);
            
                for (var j in vals) {
                    if (vals[j].RelativeDate >= 0 - queryParams.LowerWindow && vals[j].RelativeDate <= queryParams.UpperWindow) {
                        var date = vals[j]['Date'];
                        var date_regex = /(\d{2})\/(\d{2})\/(\d{4})/;
                        var matches = date_regex.exec(date);
                        vals[j]['Date'] = matches[3] + "-" + matches[2] + "-" + matches[1];
                        var obj = {'RelativeDate' : vals[j]['RelativeDate'], 'Date' : vals[j]['Date'], 'Return' : vals[j]['Return']};

                        if (queryParams.ListOfVar.match(/CM_Return/)) {
                            obj['CM_Return'] = vals[j]['CM_Return'];
                        }

                        if (queryParams.ListOfVar.match(/AV_Return/)) {
                            obj['AV_Return'] = vals[j]['AV_Return'];
                        }
                   
                        data['CompanyReturns'][i]['Data'].push(obj);
                    } else if (vals[j].RelativeDate > queryParams.UpperWindow) {
                        break;
                    }
                }

                var cacheData = {'InstrumentID' : instruments[i], 'DOI' : queryParams.DateOfInterest, 'Lower' : queryParams.LowerWindow, 'Upper' : queryParams.UpperWindow, 'data' : data['CompanyReturns'][i]['Data']};
                retCache.insert(cacheData);
            }
        }
        
        var header = {'Content-Type' : 'application/json'};

        return {
            statusCode: 200,
            headers: header,
            body: data
        };
    }
}

sentimentAnalysis = function(queryParams) {
    // Decode the URL parameter
    var url = decodeURIComponent(queryParams.url);
    // url = url.replace(/&amp;/g, '&');
    // console.log(url.match(/http:\/\/finance.yahoo.com\/r\//)[0]);
    var final_url = "";

    // If it is a redirect URL
    if (url.match(/http:\/\/finance.yahoo.com\/r\//)) {
        // Fetch the contents of the redirect URL
        var redirect_result = HTTP.call("GET", url);
        // console.log(redirect_result);
        // Scrape the meta tag
        var meta_tag = redirect_result.content.match(/<meta.*?>/);
        // console.log(meta_tag[0]);
        // Grab the URL of the news article
        final_url = meta_tag[0].match(/URL='(.*?)'/)[1];
        // console.log(final_url);
    } else {
        final_url = url;
    }

    var asyncResult = new Future();

    // Authentication keys for the sentiment analysis
    var sentiment_analysis = new NaturalLanguageUnderstandingV1({
        // username: 'a18a5a24-adfd-4210-8759-916a8910f12f',
        username: "12f772c0-ae6a-46f3-b948-ef2916acf16d",
        password: "iDhEizdJct7J",
        // password: 'St26HBP3rVnJ',
        version_date: '2017-02-27'
    });

    // Parameters for the REST API
    var parameters = {
        url: final_url,
        features: {
            sentiment: {}
        }
    };

    // Call the API
    sentiment_analysis.analyze(parameters, function(err, response) {
        if (err) {
            // Return errors if there were
            asyncResult.throw(err);
        } else {
            // Return the reponse otherwise
            response.original_url = url;
            // console.log(response);
            asyncResult.return(response);
        }
    });
    // Make the call synchronous
    return asyncResult.wait();
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
          if (isRetail || states[i] != "AUS") {
            paramStates.push(stateList[j].value); //Push that match
          } else {
            paramStates.push("-");
          }
        }
      }
    }
  }

  // Get list of categories
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

  var startDate = queryParams.startDate.toString().replace(/-\d\d$/, '');
  var endDate = queryParams.endDate.toString().replace(/-\d\d$/, '');
    
  // Convert state and category list to string
  var stateString = paramStates.join('+');
  var catString = paramCategories.join('+');

  // Format the url
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

  // Add dates
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

    var data;
    if (isRetail) {
        data = {MonthlyRetailData: []}
    } else {
        data = {MonthlyCommodityExportData: []}
    }

    var ind = [];
    var state = [];
    

    for (var dim in dimensionObservations) {
        // Get the retail industries/commodities
        if (isRetail && dimensionObservations[dim].id == 'IND_R' || dimensionObservations[dim].id == 'SITC_REV3') {
            for (var dimVal in dimensionObservations[dim].values) {
                ind.push(dimensionObservations[dim].values[dimVal].id);
            }
        }

        // Get the states
        if (isRetail && dimensionObservations[dim].id == 'ASGC_2010' || dimensionObservations[dim].id == 'REGION') {
            for (var dimVal in dimensionObservations[dim].values) {
                state.push(dimensionObservations[dim].values[dimVal].id);
            }
        }
    }

    for (var i in ind) {
        var tempMap;
        if (isRetail) {
            // Map ABS retail industries to our industries
            for (detail in RetailDetails['IND_R']) {
                if (RetailDetails['IND_R'][detail].id == ind[i]) {
                    tempMap = { 'RetailIndustry': RetailDetails['IND_R'][detail].value, 'RegionalData': []};
                    break;
                }
            }
        } else {
            // Map ABS commodities to our commodities
            for (detail in MerchandiseDetails['SITC_REV3']) {
                if (MerchandiseDetails['SITC_REV3'][detail].id == ind[i]) {
                    tempMap = { 'Commodity': MerchandiseDetails['SITC_REV3'][detail].value, 'RegionalData': []};
                    break;
                }
            }
        }

        for (var s in state) {
            // Map ABS states to our states
            if (isRetail) {
                for (detail in RetailDetails['ASGC_2010']) {
                    if (RetailDetails['ASGC_2010'][detail].id == state[s]) {
                        tempMap.RegionalData.push({'State': RetailDetails['ASGC_2010'][detail].value, 'Data': []});
                        break;
                    }
                }
            } else {
                // Map ABS states to our states
                for (detail in MerchandiseDetails['REGION']) {
                    if (MerchandiseDetails['REGION'][detail].id == state[s]) {
                        tempMap.RegionalData.push({'State': MerchandiseDetails['REGION'][detail].value, 'Data': []});
                        break;
                    }
                }
            }
        }
        
        // Place mapping in data object
        if (isRetail) {
            data.MonthlyRetailData.push(tempMap);
        } else {
            data.MonthlyCommodityExportData.push(tempMap);
        }
    }

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
          item.Date = retDate.getFullYear() + '-' + ('0' + (retDate.getMonth() + 1)).slice(-2) + '-' + retDate.getDate();
        }

        var outputValues;

        // Parse ABS data
        if (isRetail) {
          outputValues = RetailDetails[details];
        } else {
          outputValues = MerchandiseDetails[details];
        }

        // Add data to data list
        for(var j in outputValues){
          var tempDetail = outputValues[j];
          if(tempDetail.id == detailId){
            item[tempDetail.output] = tempDetail.value;
            break;
          }
        }
      }

      // Generate json labels 
      var insertPoint, valLabel, indLabel;
      if (isRetail) {
        insertPoint = 'MonthlyRetailData';
        valLabel = 'Turnover';
        indLabel = 'RetailIndustry';
      } else {
        insertPoint = 'MonthlyCommodityExportData';
        valLabel = 'Value';
        indLabel = 'Commodity';
      }
      
      // Insert labels and data into the data object
      for (var k in data[insertPoint]) {
        if (data[insertPoint][k][indLabel] == item[indLabel]) {
          for (var l in data[insertPoint][k].RegionalData) {
            if (data[insertPoint][k].RegionalData[l].State == item.State) {
              var retItem = {'Date': item.Date};
              retItem[valLabel] = item[valLabel];
              data[insertPoint][k].RegionalData[l].Data.push(retItem);
              break;
            }
          }
          
          break;
        }
      }
    }

    return data;
}

function getReturns(share, startDate, endDate, doi) {
    var startT = startDate.getTime() / 1000;
    var endT = endDate.getTime() / 1000;
    var url = 'https://query1.finance.yahoo.com/v7/finance/download/' + share + '?period1=' + startT + '&period2=' + endT + '&interval=1d&events=history&crumb=' + crumb;
    var header = {'Referer' : 'https://au.finance.yahoo.com/quote/CCL.AX/history', 'Cookie' : cookie};
    var res = HTTP.call('GET', url, {
        headers: header,
    });
    
    var csv = res.content.split('\n');
    var data = [];
    var cm = 0;
    var i = 0;
    var prev;
    var currDate = new Date(csv[1].split(',')[0]);
    
    var dateArr = /(\d{2})\/(\d{2})\/(\d{4})/.exec(doi);
    var base = new Date(dateArr[3], dateArr[2] - 1, dateArr[1]);

    for (var l in csv) {
        if (l == 0 || l == csv.length - 1) {
            continue;
        }

        var vals = csv[l].split(',');
        
        if (i == 0) {
            data.push({'RelativeDate' : Math.round((currDate - base) / (1000 * 60 * 60 * 24)),
                       'Date' : ('0' + currDate.getDate()).slice(-2) + '/' + ('0' + (currDate.getMonth() + 1)).slice(-2) + '/' + currDate.getFullYear()
            });
                
            data[i]['Return'] = 0;
            data[i]['CM_Return'] = 0;
            data[i]['AV_Return'] = 0;

            if (isNaN(vals[4])) {
                prev = 0;
            } else {
                prev = vals[4];
            }

            i++;
        } else {
            do {
                currDate.setDate(currDate.getDate() + 1);
                if (vals[0] == currDate.getFullYear() + '-' + ('0' + (currDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currDate.getDate()).slice(-2)) {
                    tempClose = vals[4];
                } else {
                    tempClose = prev;
                }
                
                data.push({'RelativeDate' : Math.round((currDate - base) / (1000 * 60 * 60 * 24)),
                           'Date' : ('0' + currDate.getDate()).slice(-2) + '/' + ('0' + (currDate.getMonth() + 1)).slice(-2) + '/' + currDate.getFullYear()
                });
                
                if (isNaN(tempClose)) {
                    data[i]['Return'] = 0
                } else if (prev != 0) {
                    data[i]['Return'] = ((tempClose - prev) / prev) * 100;
                    prev = tempClose;
                }

                data[i]['CM_Return'] = data[i - 1]['CM_Return'] + data[i]['Return'];
                data[i]['AV_Return'] = data[i]['CM_Return'] / i;
                
                i++;
            } while (vals[0] != currDate.getFullYear() + '-' + ('0' + (currDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currDate.getDate()).slice(-2))
            
            if (!isNaN(vals[4])) {
                prev = vals[4];
            }
        }
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
    log.api_version = 'v2';
    log.parameters = {};
    
    // Get passed in parameters
    for (var param in queryParams) {
        log.parameters[param] = queryParams[param];
    }

    // Calculate execution start date
    var startDate = startTime.getUTCDate() + "/" + (startTime.getUTCMonth() + 1) + "/" + startTime.getUTCFullYear() + " " + startTime.getUTCHours() + ":" + startTime.getUTCMinutes() + ":" + startTime.getUTCSeconds() + " UTC";
    log.execution_start = startDate;

    // Calculate execution end date
    endTime = new Date();
    var endDate = endTime.getUTCDate() + "/" + (endTime.getUTCMonth() + 1) + "/" + endTime.getUTCFullYear() + " " + endTime.getUTCHours() + ":" + endTime.getUTCMinutes() + ":" + endTime.getUTCSeconds() + " UTC";
    log.execution_end = endDate;

    // Calculate elapsed time
    var elapsed = (endTime.getTime() - startTime.getTime()) / 1000;
    log.elapsed_seconds = elapsed;

    // Check if call succeeded
    if (wasSuccessful) {
        log.call_result = 'success'
    } else {
        log.call_result = 'failure'
        log.call_error = error;
    }

    // Add the log object to the body
    body.log = Object.assign({}, log);
}
