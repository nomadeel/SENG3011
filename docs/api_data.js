define({ "api": [
  {
    "type": "get",
    "url": "/merchandise/",
    "title": "Monthly Export Values",
    "name": "getMerchandise",
    "group": "Merchandise",
    "version": "2.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "State",
            "description": "<p>List of states separated by a comma - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "Category",
            "description": "<p>List of categories separated a comma - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial, AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the starting period for the data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the ending period for the data.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "Value",
            "description": "<p>A floating point value which represents the total export value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Commodity",
            "description": "<p>The commodity of which the value corresponds to - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial, AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "State",
            "description": "<p>The state from which the value corresponds to - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Date",
            "description": "<p>A string date of the format YYYY-MM-DD. This represents the date for the corresponding commodity value.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"MonthlyCommodityExportData\": [\n      {\n        \"Commodity\": \"ManufacturedGoods\",\n        \"RegionalData\": [\n          {\n            \"State\": \"NSW\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Value\": 214327.879\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Value\": 203786.025\n              },...\n            ]\n          },\n          {\n            \"State\": \"VIC\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Value\": 119279.303\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Value\": 114273.896\n              },...\n            ]\n          }\n        ]\n      },\n      {\n        \"Commodity\": \"FoodAndLiveAnimals\",\n        \"RegionalData\": [\n          {\n            \"State\": \"NSW\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Value\": 342613.592\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Value\": 407546.616\n              },...\n            ]\n          },\n          {\n            \"State\": \"VIC\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Value\": 607036.311\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Value\": 692685.031\n              },...\n            ]\n          }\n        ]\n      }\n    ],\n    \"log\": {\n      \"team\": \"Electric Boogaloo\",\n      \"api_version\": \"v2\",\n      \"parameters\": {\n        \"State\": \"NSW,VIC\",\n        \"Category\": \"FoodAndLiveAnimals,ManufacturedGoods\",\n        \"startDate\": \"2016-01-01\",\n        \"endDate\": \"2017-01-31\"\n      },\n      \"execution_start\": \"24/4/2017 12:37:7 UTC\",\n      \"execution_end\": \"24/4/2017 12:37:7 UTC\",\n      \"elapsed_seconds\": 0.125,\n      \"call_result\": \"success\"\n    }\n  }",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example merchandise request URI",
        "content": "curl -i \"http://electricstats.tk/api/v2/merchandise?State=NSW,VIC&Category=FoodAndLiveAnimals,ManufacturedGoods&startDate=2016-01-01&endDate=2017-01-31\"",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Requested endpoint does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrIncorrectParameters",
            "description": "<p>One or more parameters are missing or entered incorrectly.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Our server has encountered an error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error 404:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"RequestedEndpointDoesNotExist\"\n}",
          "type": "json"
        },
        {
          "title": "Error 422:",
          "content": "    HTTP/1.1 422 MissingOrIncorrectParameters\n    {\n   \t\"messsage\": \"Missing Parameters\",\n\t\t\t\"endDate\": null,\n     \"log\": {\n         \"team\": \"Electric Boogaloo\",\n         \"api_version\": \"v2\",\n         \"parameters\": {\n           \"State\": \"NSW,VIC\",\n           \"Category\": \"FoodAndLiveAnimals,ManufacturedGoods\",\n           \"startDate\": \"2016-01-01\"\n         },\n         \"execution_start\": \"30/3/2017 1:08:01 PM\",\n         \"execution_end\": \"30/3/2017 1:08:01 PM\",\n         \"elapsed_seconds\": 0,\n         \"call_result\": \"failure\",\n         \"call_error\": \"missing parameters\"\n            }\n    }",
          "type": "json"
        },
        {
          "title": "Error 500:",
          "content": "HTTP/1.1 500 InternalServerError\n{\n  \"error\": \"Uh Oh, we messed up!\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/_apidoc.js",
    "groupTitle": "Merchandise"
  },
  {
    "type": "get",
    "url": "/merchandise/",
    "title": "Monthly Export Values",
    "name": "getMerchandise",
    "group": "Merchandise",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "State",
            "description": "<p>List of states separated by a comma - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "Category",
            "description": "<p>List of categories separated a comma - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial, AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the starting period for the data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the ending period for the data.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "Value",
            "description": "<p>A floating point value which represents the total export value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Commodity",
            "description": "<p>The commodity of which the value corresponds to - Total, FoodAndLiveAnimals, BeveragesAndTobacco, CrudeMaterialAndInedible, MineralFuelLubricantAndRelatedMaterial, AnimalAndVegetableOilFatAndWaxes, ChemicalsAndRelatedProducts, ManufacturedGoods, MachineryAndTransportEquipments, OtherManufacturedArticles, Unclassified</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "State",
            "description": "<p>The state from which the value corresponds to - AUS, NSW, WA, SA, ACT, VIC, TAS, QLD</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Date",
            "description": "<p>A string date of the format YYYY-MM-DD. This represents the date for the corresponding commodity value.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"data\": [\n     {\n       \"Value\": 342613.592,\n       \"State\": \"NSW\",\n       \"Commodity\": \"FoodAndLiveAnimals\",\n       \"Date\": \"2016-01\"\n     },\n     {\n       \"Value\": 407546.616,\n       \"State\": \"NSW\",\n       \"Commodity\": \"FoodAndLiveAnimals\",\n       \"Date\": \"2016-02\"\n     }...],\n   \"log\": {\n          \"team\": \"Electric Boogaloo\",\n          \"api_version\": \"v1\",\n          \"parameters\": {\n            \"State\": \"NSW,VIC\",\n            \"Category\": \"FoodAndLiveAnimals,ManufacturedGoods\",\n            \"startDate\": \"2016-01-01\",\n            \"endDate\": \"2017-01-31\"\n          },\n          \"execution_start\": \"30/3/2017 1:14:12 PM\",\n          \"execution_end\": \"30/3/2017 1:14:12 PM\",\n          \"elapsed_seconds\": 0.107,\n          \"call_result\": \"success\"\n        }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example merchandise request URI",
        "content": "curl -i \"http://electricstats.tk/api/v1/merchandise?State=NSW,VIC&Category=FoodAndLiveAnimals,ManufacturedGoods&startDate=2016-01-01&endDate=2017-01-31\"",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Requested endpoint does not exist.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrIncorrectParameters",
            "description": "<p>One or more parameters are missing or entered incorrectly.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Our server has encountered an error.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error 404:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"RequestedEndpointDoesNotExist\"\n}",
          "type": "json"
        },
        {
          "title": "Error 422:",
          "content": "    HTTP/1.1 422 MissingOrIncorrectParameters\n    {\n   \t\"messsage\": \"Missing Parameters\",\n\t\t\t\"endDate\": null,\n     \"log\": {\n         \"team\": \"Electric Boogaloo\",\n         \"api_version\": \"v1\",\n         \"parameters\": {\n           \"State\": \"NSW,VIC\",\n           \"Category\": \"FoodAndLiveAnimals,ManufacturedGoods\",\n           \"startDate\": \"2016-01-01\"\n         },\n         \"execution_start\": \"30/3/2017 1:08:01 PM\",\n         \"execution_end\": \"30/3/2017 1:08:01 PM\",\n         \"elapsed_seconds\": 0,\n         \"call_result\": \"failure\",\n         \"call_error\": \"missing parameters\"\n            }\n    }",
          "type": "json"
        },
        {
          "title": "Error 500:",
          "content": "HTTP/1.1 500 InternalServerError\n{\n  \"error\": \"Uh Oh, we messed up!\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/_apidoc.js",
    "groupTitle": "Merchandise"
  },
  {
    "type": "get",
    "url": "/retail",
    "title": "Monthly Turnover",
    "name": "GetRetail",
    "group": "Retail",
    "version": "2.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "State",
            "description": "<p>List of states separated by a comma - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "Category",
            "description": "<p>List of categories separated a comma - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the starting period for the data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the ending period for the data.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "Turnover",
            "description": "<p>The double precision value representing the monthly turnover value for a category.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "State",
            "description": "<p>The state from which the value corresponds to - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "RetailIndustry",
            "description": "<p>The industry of which the value corresponds to - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Date",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the last date value for the turnover.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"MonthlyRetailData\": [\n      {\n        \"RetailIndustry\": \"Food\",\n        \"RegionalData\": [\n          {\n            \"State\": \"NSW\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Turnover\": 3156.7\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Turnover\": 2930.6\n              }, ...\n            ]\n          },\n          {\n            \"State\": \"VIC\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Turnover\": 2530.4\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Turnover\": 2362.2\n              }, ...\n            ]\n          }\n        ]\n      },\n      {\n        \"RetailIndustry\": \"HouseholdGood\",\n        \"RegionalData\": [\n          {\n            \"State\": \"NSW\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Turnover\": 1388.5\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Turnover\": 1266.1\n              }, ...\n            ]\n          },\n          {\n            \"State\": \"VIC\",\n            \"Data\": [\n              {\n                \"Date\": \"2016-1-31\",\n                \"Turnover\": 1136\n              },\n              {\n                \"Date\": \"2016-2-29\",\n                \"Turnover\": 1045.7\n              }, ...\n            ]\n          }\n        ]\n      }\n    ],\n    \"log\": {\n      \"team\": \"Electric Boogaloo\",\n      \"api_version\": \"v2\",\n      \"parameters\": {\n        \"State\": \"NSW,VIC\",\n        \"Category\": \"Food,HouseholdGood\",\n        \"startDate\": \"2016-01-01\",\n        \"endDate\": \"2017-01-31\"\n      },\n      \"execution_start\": \"24/4/2017 11:43:15 UTC\",\n      \"execution_end\": \"24/4/2017 11:43:16 UTC\",\n      \"elapsed_seconds\": 0.202,\n      \"call_result\": \"success\"\n    }\n   }",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example retail request URI",
        "content": "curl -i \"http://electricstats.tk/api/v2/retail?State=NSW,VIC&Category=Food,HouseholdGood&startDate=2016-01-01&endDate=2017-01-31\"",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PageNotFound",
            "description": "<p>The supplied endpoint doesn't exist or can not be found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrIncorrectParamters",
            "description": "<p>The supplied parameters are either missing or incorrect.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>An internal server error has occurred.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error 404:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Page not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error 422:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"Missing Parameters\",\n  \"State\": null,\n  \"endDate\": null,\n  \"log\": {\n        \"team\": \"Electric Boogaloo\",\n        \"api_version\": \"v2\",\n        \"parameters\": {\n          \"State\": \"NSW,VIC\",\n          \"Category\": \"Food,HouseholdGood\",\n          \"startDate\": \"2016-01-01\"\n        },\n        \"execution_start\": \"30/3/2017 1:19:16 PM\",\n        \"execution_end\": \"30/3/2017 1:19:16 PM\",\n        \"elapsed_seconds\": 0.013,\n        \"call_result\": \"failure\",\n        \"call_error\": \"missing parameters\"\n     }\n}",
          "type": "json"
        },
        {
          "title": "Error 500:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Opps, looks like something went wrong...\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/_apidoc.js",
    "groupTitle": "Retail"
  },
  {
    "type": "get",
    "url": "/retail",
    "title": "Monthly Turnover",
    "name": "GetRetail",
    "group": "Retail",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "State",
            "description": "<p>List of states separated by a comma - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "Category",
            "description": "<p>List of categories separated a comma - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "startDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the starting period for the data.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "endDate",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the ending period for the data.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "Turnover",
            "description": "<p>The double precision value representing the monthly turnover value for a category.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "State",
            "description": "<p>The state from which the value corresponds to - AUS, NSW, VIC, QLD, SA, WA, TAS, NT, ACT.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "RetailIndustry",
            "description": "<p>The industry of which the value corresponds to - Total, Food, HouseholdGood, ClothingFootwareAndPersonalAccessory, DepartmentStores, CafesRestaurantsAndTakeawayFood, Other</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Date",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the last date value for the turnover.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"data\": [\n     {\n       \"Turnover\": 3156.7,\n       \"State\": \"NSW\",\n       \"RetailIndustry\": \"Food\",\n       \"Date\": \"2016-01\"\n     },\n     {\n       \"Turnover\": 2930.6,\n       \"State\": \"NSW\",\n       \"RetailIndustry\": \"Food\",\n       \"Date\": \"2016-02\"\n     }...],\n   \"log\": {\n        \"team\": \"Electric Boogaloo\",\n        \"api_version\": \"v1\",\n        \"parameters\": {\n          \"State\": \"NSW,VIC\",\n          \"Category\": \"Food,HouseholdGood\",\n          \"startDate\": \"2016-01-01\",\n          \"endDate\": \"2017-01-31\"\n        },\n        \"execution_start\": \"30/3/2017 1:17:15 PM\",\n        \"execution_end\": \"30/3/2017 1:17:16 PM\",\n        \"elapsed_seconds\": 0.197,\n        \"call_result\": \"success\"\n      }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example retail request URI",
        "content": "curl -i \"http://electricstats.tk/api/v1/retail?State=NSW,VIC&Category=Food,HouseholdGood&startDate=2016-01-01&endDate=2017-01-31\"",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PageNotFound",
            "description": "<p>The supplied endpoint doesn't exist or can not be found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrIncorrectParamters",
            "description": "<p>The supplied parameters are either missing or incorrect.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>An internal server error has occurred.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error 404:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Page not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error 422:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"Missing Parameters\",\n  \"State\": null,\n  \"endDate\": null,\n  \"log\": {\n        \"team\": \"Electric Boogaloo\",\n        \"api_version\": \"v1\",\n        \"parameters\": {\n          \"State\": \"NSW,VIC\",\n          \"Category\": \"Food,HouseholdGood\",\n          \"startDate\": \"2016-01-01\"\n        },\n        \"execution_start\": \"30/3/2017 1:19:16 PM\",\n        \"execution_end\": \"30/3/2017 1:19:16 PM\",\n        \"elapsed_seconds\": 0.013,\n        \"call_result\": \"failure\",\n        \"call_error\": \"missing parameters\"\n     }\n}",
          "type": "json"
        },
        {
          "title": "Error 500:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Opps, looks like something went wrong...\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/_apidoc.js",
    "groupTitle": "Retail"
  },
  {
    "type": "get",
    "url": "/returns",
    "title": "Company Returns",
    "name": "GetReturns",
    "group": "Returns",
    "version": "2.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "InstrumentID",
            "description": "<p>List of instrument ID's separated by a comma, e.g. CCL.AX,AAPL</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "ListOfVar",
            "description": "<p>List of variables to return, either cumulative returns or average returns (or both) - CM_Return, AV_Return (Please format the list without spaces)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "DateOfInterest",
            "description": "<p>A string date in the format YYYY-MM-DD. This represents the date of interest.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "LowerWindow",
            "description": "<p>The number of days before the date of interest to retrieve data for.</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "UpperWindow",
            "description": "<p>The number of days after the date of interest to retrieve data for.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "InstrumentID",
            "description": "<p>The company ID of which the data corresponds to.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "Return",
            "description": "<p>The double precision value representing the daily return percentage for a company.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "CM_Return",
            "description": "<p>The double precision value representing the cumulative return percentage over the time period.</p>"
          },
          {
            "group": "Success 200",
            "type": "Double",
            "optional": false,
            "field": "AV_Return",
            "description": "<p>The double precision value representing the average return percentage over the time period.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Date",
            "description": "<p>A string date in format YYYY-MM-DD. This represents the date of the corresponding data.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "RelativeDate",
            "description": "<p>The number of days relative to the date of interest of the corresponding data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"CompanyReturns\": [\n      {\n        \"InstrumentID\": \"AAPL\",\n        \"Data\": [\n          {\n            \"RelativeDate\": -2,\n            \"Date\": \"2015-01-08\"\n            \"Return\": 3.8422264501160126\n            \"CM_Return\": 5.253859156045172\n            \"AV_Return\": 1.7512863853483907\n          }, ...\n        ]\n      }\n }",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example retail request URI",
        "content": "curl -i \"http://electricstats.tk/api/v2/returns?InstrumentID=AAPL&ListOfVar=CM_Return,AV_Return&DateOfInterest=10/01/2015&LowerWindow=2&UpperWindow=3\"",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PageNotFound",
            "description": "<p>The supplied endpoint doesn't exist or can not be found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingOrIncorrectParamters",
            "description": "<p>The supplied parameters are either missing or incorrect.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>An internal server error has occurred.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error 404:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"message\": \"Page not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error 422:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"Incorrect Parameters\",\n}",
          "type": "json"
        },
        {
          "title": "Error 500:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"message\": \"Opps, looks like something went wrong...\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/api/_apidoc.js",
    "groupTitle": "Returns"
  }
] });
