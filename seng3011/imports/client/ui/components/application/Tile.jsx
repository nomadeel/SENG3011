import React, { Component } from 'react';
import { Card, Loader, Dimmer, Container, Image, Grid, Divider, Rating, Header, Icon, Popup } from 'semantic-ui-react';
import {industries, symbols, industry_map, symbol_map, valid_symbols} from '../../../Data.jsx';
import {offline_stocks} from '../../../Backup.jsx';
import TileStats from './TileStats.jsx';
import TileNews from './TileNews.jsx';

// Import w/e components you need here

export default class Tile extends Component {
    /*
     * Expected props:
     * - area
     * - industry
     * - stock_name (Stock Name)
     * - stock_symbol (Stock identifier)
     * - start_date
     * - end_date
    */
    constructor(props) {
        super(props);

        this.state = {
          "mean" : null,
          "min" : null,
          "max" : null,
          "trend" : null,
          "news_title" : null,
          "news_content" : null,
          "news_image" : null,
          "perf" : null
        }
        
        this.getNews();

        this.load_stat_info(this.props.area, this.props.start_date, this.props.end_date, this.props.stock_symbol);

    }

    // Retrieves the shares data from the share API
    load_stat_info(area, start_date, end_date, symbol){
      this.state.share_loading = true;
      this.state.stats_loading = true;

      var s_date = Date.parse(start_date); //Create date object with start date
      var e_date = Date.parse(end_date); //Create date object with end date

      var days = this.daydiff(s_date, e_date); //Find the number of days between the two dates

      var lower_window = 0; //We will never go below our start date
      var upper_window = days; //Number of days from start_date to end_date
      var doi = start_date; //Our date of interest is out start_date

      var date_regex = /(\d{4})-(\d{2})-(\d{2})/;
      var matches = date_regex.exec(doi);
      var modified_date = matches[2] + "/" + matches[3] + "/" + matches[1];
      
      //Build the url
      var stock_url4 = "http://electricstats.tk/api/v2/returns?InstrumentID=" + symbol + ".AX&DateOfInterest=" + modified_date + "&ListOfVar=AV_Return,CM_Return&UpperWindow=" + upper_window + "&LowerWindow=0";
      var stock_url2 = "http://174.138.67.207/InstrumentID/" + symbol + ".AX/DateOfInterest/" + doi + "/List_of_Var/CM_Return,AV_Return,Minimum/Upper_window/" + upper_window + "/Lower_window/" + lower_window;
      var stock_url3 = "http://128.199.197.216:3000/v5/id=" + symbol + ".AX&dateOfInterest=" + doi + "&listOfVars=AV_Return;CM_Return&upperWindow=" + upper_window + "&lowerWindow=" + lower_window;
      var stock_url = "http://128.199.255.9/v5/id=" + symbol + ".AX&dateOfInterest=" + doi + "&listOfVars=AV_Return;CM_Return&upperWindow=" + upper_window + "&lowerWindow=" + lower_window;

      //Call the restful api for stocks
      var stock_result = HTTP.call("GET", stock_url4, function (error, results) {
          var json_data = JSON.parse(results.content); //Parse the response as JSON
          
          //Compress data will return data in this form: http://jsoneditoronline.org/?id=2109cce4283543e7d54e3fd2ee484d0a
          var final_data = this.compressData(json_data, doi);
          
          // Determine trend
          var rank = this.rank(final_data);
          var r = rank[0].rank;
          var trend = 0;
          if(r <= -5){
            trend = 1;
          }else if(r <= 0){
            trend = 2;
          }else if(r <= 5){
            trend = 3;
          }else if(r <= 8){
            trend = 4;
          }else if(r >= 8){
            trend = 5;
          }

          var stats = this.findStats(final_data[symbol + ".AX"]);
          this.setState({"mean" : stats.mean + "%", "min" : stats.min + "%", "max" : stats.max + "%", "trend" : trend, "perf" : rank[0].perf});

      }.bind(this));
    }

    // Calculates relevant statistics such as Mean, Min, Max for the stock data
    findStats(data){
      var stats = {};
      stats.min = 2147000000;
      stats.max = -2147000000;
      var total = 0;

      for(var i = 0; i < data.length; i++){
        var interval = data[i];
        total += interval.Return;
        // If we found a new max
        if(interval.Return >= stats.max){
          stats.max = interval.Return;
        }

        // If we found a new min
        if(interval.Return <= stats.min){
          stats.min = interval.Return;
        }
      }

      // Truncates the decimals
      Number.prototype.toFixedDown = function(digits) {
          var re = new RegExp("(-?\\d+\\.\\d{" + digits + "})(\\d)"),
              m = this.toString().match(re);
          return m ? parseFloat(m[1]) : this.valueOf();
      };

      // Calculate the statistics
      stats.mean = (total / data.length);
      stats.mean = stats.mean.toFixedDown(5);
      stats.min = stats.min.toFixedDown(5);
      stats.max = stats.max.toFixedDown(5);
      return stats;
    }

    // Compresses the data from the shares API to only contain months for dates
    compressData(data, doi){
      var new_data = {};
      var day_val = 1000*60*60*24; //ms in a day
      var cur_date = Date.parse(doi);
      var symbol = data.CompanyReturns[0].InstrumentID;
      var list = data.CompanyReturns[0].Data;
      
      // Loop through the data, compressing for each month
      for(var i = 0; i < list.length; i++){
        var temp_date = cur_date + (day_val * i);
        temp_date = new Date(temp_date);

        var sector = temp_date.getFullYear() + "-" + (temp_date.getMonth() + 1) + "-" + this.daysInMonth(temp_date.getFullYear(), temp_date.getMonth() + 1);

        if(!new_data[sector]){
          new_data[sector] = {};
        }

        if(!new_data[sector]["Return"]){
          new_data[sector]["Return"] = 0;
        }

        new_data[sector]["Return"] = list[i]["Return"];

        if(!new_data[sector]["CM_Return"]){
          new_data[sector]["CM_Return"] = 0;
        }

        new_data[sector]["CM_Return"] = list[i]["CM_Return"];

        if(!new_data[sector]["AV_Return"]){
          new_data[sector]["AV_Return"] = 0;
        }

        new_data[sector]["AV_Return"] = list[i]["AV_Return"];

      }

      // Clean it up so the data is nicely formatted
      var final_data = {};
      final_data[symbol] = [];
      for(var key in new_data){
        var obj = new_data[key];
        obj["Date"] = key;
        final_data[symbol].push(obj);
      }

      return final_data;
    }

    // Returns the number of days in a particular month and year
    daysInMonth(month,year) {
      return new Date(year, month, 0).getDate();
    }

    // Calculates the difference in time between two dates in milliseconds
    daydiff(first, second) {
      return Math.round((second-first)/(1000*60*60*24));
    }

    // Finds the GICS category that the share belongs in
    find_category(area, symbol){
      var cat;
      var industry = symbol_map[symbol];
      if(industry){
        cat = industry_map[area][industry];
      }
      return cat;
    }

    // Fetches the news for the share
    getNews(){
      var name = this.props.stock_symbol + ".AX";
      
      //Topic codes https://customers.reuters.com/training/trainingCRMdata/promo_content/ReutersCodes.pdf
      var topic_codes = ['AMERS', 'COM'];

      var url = "https://feeds.finance.yahoo.com/rss/2.0/headline?s=" + name + "&region=US&lang=en-US";
      url = encodeURI(url);

      var api_key = "ps4uapykk9tfmnqxwmgdv90neukhitjdxfvwsuzk";
      var json_url = "https://api.rss2json.com/v1/api.json?rss_url=" + url + "&api_key=" + api_key;

      // Fetch the news through a HTTP call
      var stock_result = HTTP.call("GET", json_url, function (error, results) {
          var json_data = JSON.parse(results.content); //Parse the response as JSON
          var items = json_data.items;
          if(items.length > 0){
              // Take the latest article
              var article = items[0];
              this.setState({"news_title" : article.title, "news_content" : article.description.split("...")[0]})
                  // Look for the thumbnail for the article
                  if(article.thumbnail != ""){
                      this.setState({"news_image" : article.thumbnail});
                  }else if(valid_symbols[this.props.stock_symbol].image){
                      this.setState({"news_image" : valid_symbols[this.props.stock_symbol].image});
                  }
          }
      }.bind(this));
    }

    // Rank the share's performance
    rank(shares) {
        var rank_data = [];
        
        for (var key in shares) {
            var prev_c;
            
            // Loop through data in share
            for (var i = 0; i < shares[key].length; i++) {
                if (i == 0) {
                    // Base for EWA is difference in CM from last month to first
                    prev_c = shares[key][shares[key].length - 1].CM_Return - shares[key][i].CM_Return;
                } else {
                    // Smoothing factor
                    var a = 2 / (1 + shares[key].length);
                    
                    // Calculate EWA of difference in CM
                    prev_c = ((shares[key][i].CM_Return - shares[key][i - 1].CM_Return) * a) + (prev_c * (1 - a));
                }
            }

            // Permformace is difference of last two months
            var perf
            if (shares[key].length <= 1) {
                perf = shares[key][shares[key].length - 1].CM_Return;
            } else {
                perf = shares[key][shares[key].length - 1].CM_Return - shares[key][shares[key].length - 2].CM_Return;
            }

            rank_data.push({'share': key, 'rank': prev_c, 'perf': perf});
        }
        
        return rank_data;
    }

    // Choose the tile to display
    chooseTile(){
      this.props.select(this.props.stock_name);
    }

    render(){
      // Default assests
      const src = '/src.png';
      var cardColour = 'grey';
      var content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque maximus elit sem, id faucibus nibh vestibulum et. Fusce iaculis convallis ligula sed dapibus. Mauris facilisis ut sem sed molestie. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque maximus elit sem, id faucibus nibh vestibulum et. Fusce iaculis convallis ligula sed dapibus. Mauris facilisis ut sem sed molestie.";

      // Set the appropriate border colour for the card
      if(this.state.perf > 0){
        cardColour = 'green';
      }else if (this.state.perf < 0){
        cardColour = 'red';
      }

      var icon_size = 'large';
      var rating = <Icon loading name='spinner' size={icon_size} />
      // Display the appropriate number of stars depending on its performance
      if(this.state.trend){
            if (this.state.trend == 5) {
                    rating = <Popup
                        trigger={<Rating defaultRating={this.state.trend} maxRating={5} disabled />}
                        content="Excellent to invest in!"
                        size="large"
                        position="top center"
                        />
            } else if (this.state.trend == 4) {
                    rating = <Popup
                        trigger={<Rating defaultRating={this.state.trend} maxRating={5} disabled />}
                        content="Alright to invest in."
                        size="large"
                        position="top center"
                        />
            } else if (this.state.trend == 3) {

                    rating = <Popup
                        trigger={<Rating defaultRating={this.state.trend} maxRating={5} disabled />}
                        content="Neutral."
                        size="large"
                        position="top center"
                        />
            } else if (this.state.trend == 2) {
                    rating = <Popup
                        trigger={<Rating defaultRating={this.state.trend} maxRating={5} disabled />}
                        content="Not too good."
                        size="large"
                        position="top center"
                        />
            } else {
                    rating = <Popup
                        trigger={<Rating defaultRating={this.state.trend} maxRating={5} disabled />}
                        content="Best to look elsewhere."
                        size="large"
                        position="top center"
                        />
            }
      }

      return(
        <Card fluid color={cardColour} onClick={this.props.onClick}>
         <Card.Content header={this.props.stock_name}>

           <Header as='h3'>
             {rating} {' '}
             {this.props.stock_name}
          </Header>

         </Card.Content>


         <Card.Content extra>
           <TileNews news_image={this.state.news_image} news_content={this.state.news_content} news_title={this.state.news_title}/>
         </Card.Content>

         <Card.Content extra>
           <TileStats mean={this.state.mean} min={this.state.min} max={this.state.max} trend={this.state.trend} perf={this.state.perf}/>
         </Card.Content>
       </Card>
      );
    }
}
