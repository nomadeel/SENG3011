//Build the docs with "apidoc -i server/api/ -o ../docs/"

/**
 * @api {get} /returns Company Returns
 * @apiName GetReturns
 * @apiGroup Returns
 * @apiVersion 2.0.0
 *
 * @apiParam {String[]} InstrumentID List of instrument ID's separated by a comma, e.g. CCL.AX,AAPL
 * @apiParam {String[]} ListOfVar List of variables to return, either cumulative returns or average returns (or both) - CM_Return, AV_Return (Please format the list without spaces)
 * @apiParam {String} DateOfInterest A string date in the format YYYY-MM-DD. This represents the date of interest.
 * @apiParam {Integer} LowerWindow The number of days before the date of interest to retrieve data for.
 * @apiParam {Integer} UpperWindow The number of days after the date of interest to retrieve data for.
 *
 * @apiSuccess {String} InstrumentID The company ID of which the data corresponds to.
 * @apiSuccess {Double} Return The double precision value representing the daily return percentage for a company.
 * @apiSuccess {Double} CM_Return The double precision value representing the cumulative return percentage over the time period.
 * @apiSuccess {Double} AV_Return The double precision value representing the average return percentage over the time period. 
 * @apiSuccess {String} Date A string date in format YYYY-MM-DD. This represents the date of the corresponding data.
 * @apiSuccess {Integer} RelativeDate The number of days relative to the date of interest of the corresponding data.
 *
 * @apiExample {curl} Example retail request URI
 *         curl -i "http://electricstats.tk/api/v2/returns?InstrumentID=AAPL&ListOfVar=CM_Return,AV_Return&DateOfInterest=10/01/2015&LowerWindow=2&UpperWindow=3"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
        "CompanyReturns": [
          {
            "InstrumentID": "AAPL",
            "Data": [
              {
                "RelativeDate": -2,
                "Date": "2015-01-08"
                "Return": 3.8422264501160126
                "CM_Return": 5.253859156045172
                "AV_Return": 1.7512863853483907
              }, ...
            ]
          }
 *      }
 *
 * @apiError PageNotFound The supplied endpoint doesn't exist or can not be found.
 *
 * @apiErrorExample Error 404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Page not found."
 *     }
 *
 * @apiError MissingOrIncorrectParamters The supplied parameters are either missing or incorrect.
 *
 * @apiErrorExample Error 422:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "Incorrect Parameters",
 *     }
 *
 * @apiError InternalServerError An internal server error has occurred.
 *
 * @apiErrorExample Error 500:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Opps, looks like something went wrong..."
 *     }
 */

/**
 * @api {get} /retail Monthly Turnover
 * @apiName GetRetail
 * @apiGroup Retail
 * @apiVersion 2.0.0
 *
 * @apiParam {String[]} State List of states separated by a comma - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT (Please format the list without spaces)
 * @apiParam {String[]} Category List of categories separated a comma - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other (Please format the list without spaces)
 * @apiParam {String} startDate A string date in the format YYYY-MM-DD. This represents the starting period for the data.
 * @apiParam {String} endDate A string date in the format YYYY-MM-DD. This represents the ending period for the data.
 *
 * @apiSuccess {Double} Turnover The double precision value representing the monthly turnover value for a category.
 * @apiSuccess {String} State The state from which the value corresponds to - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT.
 * @apiSuccess {String} RetailIndustry The industry of which the value corresponds to - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other
 * @apiSuccess {String} Date A string date in the format YYYY-MM-DD. This represents the last date value for the turnover.
 *
 * @apiExample {curl} Example retail request URI
 *         curl -i "http://electricstats.tk/api/v2/retail?State=NSW,VIC&Category=Food,HouseholdGood&startDate=2016-01-01&endDate=2017-01-31"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
        "MonthlyRetailData": [
          {
            "RetailIndustry": "Food",
            "RegionalData": [
              {
                "State": "NSW",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Turnover": 3156.7
                  },
                  {
                    "Date": "2016-2-29",
                    "Turnover": 2930.6
                  }, ...
                ]
              },
              {
                "State": "VIC",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Turnover": 2530.4
                  },
                  {
                    "Date": "2016-2-29",
                    "Turnover": 2362.2
                  }, ...
                ]
              }
            ]
          },
          {
            "RetailIndustry": "HouseholdGood",
            "RegionalData": [
              {
                "State": "NSW",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Turnover": 1388.5
                  },
                  {
                    "Date": "2016-2-29",
                    "Turnover": 1266.1
                  }, ...
                ]
              },
              {
                "State": "VIC",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Turnover": 1136
                  },
                  {
                    "Date": "2016-2-29",
                    "Turnover": 1045.7
                  }, ...
                ]
              }
            ]
          }
        ],
        "log": {
          "team": "Electric Boogaloo",
          "api_version": "v2",
          "parameters": {
            "State": "NSW,VIC",
            "Category": "Food,HouseholdGood",
            "startDate": "2016-01-01",
            "endDate": "2017-01-31"
          },
          "execution_start": "24/4/2017 11:43:15 UTC",
          "execution_end": "24/4/2017 11:43:16 UTC",
          "elapsed_seconds": 0.202,
          "call_result": "success"
        }
       }
 *
 * @apiError PageNotFound The supplied endpoint doesn't exist or can not be found.
 *
 * @apiErrorExample Error 404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Page not found."
 *     }
 *
 * @apiError MissingOrIncorrectParamters The supplied parameters are either missing or incorrect.
 *
 * @apiErrorExample Error 422:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "Missing Parameters",
 *       "State": null,
 *       "endDate": null,
 *       "log": {
            "team": "Electric Boogaloo",
            "api_version": "v2",
            "parameters": {
              "State": "NSW,VIC",
              "Category": "Food,HouseholdGood",
              "startDate": "2016-01-01"
            },
            "execution_start": "30/3/2017 1:19:16 PM",
            "execution_end": "30/3/2017 1:19:16 PM",
            "elapsed_seconds": 0.013,
            "call_result": "failure",
            "call_error": "missing parameters"
         }
 *     }
 *
 * @apiError InternalServerError An internal server error has occurred.
 *
 * @apiErrorExample Error 500:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Opps, looks like something went wrong..."
 *     }
 */


/**
 * @api {get} /merchandise/ Monthly Export Values
 * @apiName getMerchandise
 * @apiGroup Merchandise
 * @apiVersion 2.0.0
 *
 * @apiParam {String[]} State List of states separated by a comma - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD (Please format the list without spaces)
 * @apiParam {String[]} Category List of categories separated a comma - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial,
 * AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified (Please format the list without spaces)
 * @apiParam {String} startDate A string date in the format YYYY-MM-DD. This represents the starting period for the data.
 * @apiParam {String} endDate A string date in the format YYYY-MM-DD. This represents the ending period for the data.
 *
 * @apiSuccess {Double} Value A floating point value which represents the total export value
 * @apiSuccess {String} Commodity The commodity of which the value corresponds to - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial,
 * AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified
 * @apiSuccess {String} State The state from which the value corresponds to - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD
 * @apiSuccess {String} Date  A string date of the format YYYY-MM-DD. This represents the date for the corresponding commodity value.
 *
 * @apiExample {curl} Example merchandise request URI
 *         curl -i "http://electricstats.tk/api/v2/merchandise?State=NSW,VIC&Category=FoodAndLiveAnimals,ManufacturedGoods&startDate=2016-01-01&endDate=2017-01-31"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
        "MonthlyCommodityExportData": [
          {
            "Commodity": "ManufacturedGoods",
            "RegionalData": [
              {
                "State": "NSW",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Value": 214327.879
                  },
                  {
                    "Date": "2016-2-29",
                    "Value": 203786.025
                  },...
                ]
              },
              {
                "State": "VIC",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Value": 119279.303
                  },
                  {
                    "Date": "2016-2-29",
                    "Value": 114273.896
                  },...
                ]
              }
            ]
          },
          {
            "Commodity": "FoodAndLiveAnimals",
            "RegionalData": [
              {
                "State": "NSW",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Value": 342613.592
                  },
                  {
                    "Date": "2016-2-29",
                    "Value": 407546.616
                  },...
                ]
              },
              {
                "State": "VIC",
                "Data": [
                  {
                    "Date": "2016-1-31",
                    "Value": 607036.311
                  },
                  {
                    "Date": "2016-2-29",
                    "Value": 692685.031
                  },...
                ]
              }
            ]
          }
        ],
        "log": {
          "team": "Electric Boogaloo",
          "api_version": "v2",
          "parameters": {
            "State": "NSW,VIC",
            "Category": "FoodAndLiveAnimals,ManufacturedGoods",
            "startDate": "2016-01-01",
            "endDate": "2017-01-31"
          },
          "execution_start": "24/4/2017 12:37:7 UTC",
          "execution_end": "24/4/2017 12:37:7 UTC",
          "elapsed_seconds": 0.125,
          "call_result": "success"
        }
      }
 *
 * @apiError NotFound Requested endpoint does not exist.
 * @apiError MissingOrIncorrectParameters One or more parameters are missing or entered incorrectly.
 * @apiError InternalServerError Our server has encountered an error.
 *
 * @apiErrorExample Error 404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "RequestedEndpointDoesNotExist"
 *     }
 *
 * @apiErrorExample Error 422:
 *     HTTP/1.1 422 MissingOrIncorrectParameters
 *     {
 *    	"messsage": "Missing Parameters",
 *			"endDate": null,
 *      "log": {
 *          "team": "Electric Boogaloo",
 *          "api_version": "v2",
 *          "parameters": {
 *            "State": "NSW,VIC",
 *            "Category": "FoodAndLiveAnimals,ManufacturedGoods",
 *            "startDate": "2016-01-01"
 *          },
 *          "execution_start": "30/3/2017 1:08:01 PM",
 *          "execution_end": "30/3/2017 1:08:01 PM",
 *          "elapsed_seconds": 0,
 *          "call_result": "failure",
 *          "call_error": "missing parameters"
 *             }
 *     }
 * @apiErrorExample Error 500:
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Uh Oh, we messed up!"
 *     }
 */

/**
 * @api {get} /retail Monthly Turnover
 * @apiName GetRetail
 * @apiGroup Retail
 * @apiVersion 1.0.0
 *
 * @apiParam {String[]} State List of states separated by a comma - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT (Please format the list without spaces)
 * @apiParam {String[]} Category List of categories separated a comma - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other (Please format the list without spaces)
 * @apiParam {String} startDate A string date in the format YYYY-MM-DD. This represents the starting period for the data.
 * @apiParam {String} endDate A string date in the format YYYY-MM-DD. This represents the ending period for the data.
 *
 * @apiSuccess {Double} Turnover The double precision value representing the monthly turnover value for a category.
 * @apiSuccess {String} State The state from which the value corresponds to - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT.
 * @apiSuccess {String} RetailIndustry The industry of which the value corresponds to - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other
 * @apiSuccess {String} Date A string date in the format YYYY-MM-DD. This represents the last date value for the turnover.
 *
 * @apiExample {curl} Example retail request URI
 *         curl -i "http://electricstats.tk/api/v1/retail?State=NSW,VIC&Category=Food,HouseholdGood&startDate=2016-01-01&endDate=2017-01-31"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": [
 *          {
 *            "Turnover": 3156.7,
 *            "State": "NSW",
 *            "RetailIndustry": "Food",
 *            "Date": "2016-01"
 *          },
 *          {
 *            "Turnover": 2930.6,
 *            "State": "NSW",
 *            "RetailIndustry": "Food",
 *            "Date": "2016-02"
 *          }...],
 *        "log": {
            "team": "Electric Boogaloo",
            "api_version": "v1",
            "parameters": {
              "State": "NSW,VIC",
              "Category": "Food,HouseholdGood",
              "startDate": "2016-01-01",
              "endDate": "2017-01-31"
            },
            "execution_start": "30/3/2017 1:17:15 PM",
            "execution_end": "30/3/2017 1:17:16 PM",
            "elapsed_seconds": 0.197,
            "call_result": "success"
          }
 *     }
 *
 * @apiError PageNotFound The supplied endpoint doesn't exist or can not be found.
 *
 * @apiErrorExample Error 404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Page not found."
 *     }
 *
 * @apiError MissingOrIncorrectParamters The supplied parameters are either missing or incorrect.
 *
 * @apiErrorExample Error 422:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "Missing Parameters",
 *       "State": null,
 *       "endDate": null,
 *       "log": {
            "team": "Electric Boogaloo",
            "api_version": "v1",
            "parameters": {
              "State": "NSW,VIC",
              "Category": "Food,HouseholdGood",
              "startDate": "2016-01-01"
            },
            "execution_start": "30/3/2017 1:19:16 PM",
            "execution_end": "30/3/2017 1:19:16 PM",
            "elapsed_seconds": 0.013,
            "call_result": "failure",
            "call_error": "missing parameters"
         }
 *     }
 *
 * @apiError InternalServerError An internal server error has occurred.
 *
 * @apiErrorExample Error 500:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Opps, looks like something went wrong..."
 *     }
 */


/**
 * @api {get} /merchandise/ Monthly Export Values
 * @apiName getMerchandise
 * @apiGroup Merchandise
 * @apiVersion 1.0.0
 *
 * @apiParam {String[]} State List of states separated by a comma - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD (Please format the list without spaces)
 * @apiParam {String[]} Category List of categories separated a comma - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial,
 * AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified (Please format the list without spaces)
 * @apiParam {String} startDate A string date in the format YYYY-MM-DD. This represents the starting period for the data.
 * @apiParam {String} endDate A string date in the format YYYY-MM-DD. This represents the ending period for the data.
 *
 * @apiSuccess {Double} Value A floating point value which represents the total export value
 * @apiSuccess {String} Commodity The commodity of which the value corresponds to - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial,
 * AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified
 * @apiSuccess {String} State The state from which the value corresponds to - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD
 * @apiSuccess {String} Date  A string date of the format YYYY-MM-DD. This represents the date for the corresponding commodity value.
 *
 * @apiExample {curl} Example merchandise request URI
 *         curl -i "http://electricstats.tk/api/v1/merchandise?State=NSW,VIC&Category=FoodAndLiveAnimals,ManufacturedGoods&startDate=2016-01-01&endDate=2017-01-31"
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": [
 *          {
 *            "Value": 342613.592,
 *            "State": "NSW",
 *            "Commodity": "FoodAndLiveAnimals",
 *            "Date": "2016-01"
 *          },
 *          {
 *            "Value": 407546.616,
 *            "State": "NSW",
 *            "Commodity": "FoodAndLiveAnimals",
 *            "Date": "2016-02"
 *          }...],
 *        "log": {
              "team": "Electric Boogaloo",
              "api_version": "v1",
              "parameters": {
                "State": "NSW,VIC",
                "Category": "FoodAndLiveAnimals,ManufacturedGoods",
                "startDate": "2016-01-01",
                "endDate": "2017-01-31"
              },
              "execution_start": "30/3/2017 1:14:12 PM",
              "execution_end": "30/3/2017 1:14:12 PM",
              "elapsed_seconds": 0.107,
              "call_result": "success"
            }
 *     }
 *
 * @apiError NotFound Requested endpoint does not exist.
 * @apiError MissingOrIncorrectParameters One or more parameters are missing or entered incorrectly.
 * @apiError InternalServerError Our server has encountered an error.
 *
 * @apiErrorExample Error 404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "RequestedEndpointDoesNotExist"
 *     }
 *
 * @apiErrorExample Error 422:
 *     HTTP/1.1 422 MissingOrIncorrectParameters
 *     {
 *    	"messsage": "Missing Parameters",
 *			"endDate": null,
 *      "log": {
 *          "team": "Electric Boogaloo",
 *          "api_version": "v1",
 *          "parameters": {
 *            "State": "NSW,VIC",
 *            "Category": "FoodAndLiveAnimals,ManufacturedGoods",
 *            "startDate": "2016-01-01"
 *          },
 *          "execution_start": "30/3/2017 1:08:01 PM",
 *          "execution_end": "30/3/2017 1:08:01 PM",
 *          "elapsed_seconds": 0,
 *          "call_result": "failure",
 *          "call_error": "missing parameters"
 *             }
 *     }
 * @apiErrorExample Error 500:
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Uh Oh, we messed up!"
 *     }
 */
