import React, { Component } from 'react';
import { Segment, Grid, Menu, Container,
        Dimmer, Loader, Header, Button } from 'semantic-ui-react';
import Box from 'grommet/components/Box';
import { Chart } from 'react-google-charts';
import {offline_stocks} from '../../../Backup.jsx';

export default class Charts extends Component {
    constructor(props){
        super(props);
        this.state = {
            // Statistics states
            statistics_data: {},
            statistics_area: "",
            statistics_rows: [[new Date(0), 0]],
            statistics_columns: [
                {
                    type: "date",
                    title: "Dates"
                },
                {
                    type: "number",
                    title: "AYY"
                }
            ],
            state_selected : "AUS",
            states_available: ["AUS", "NSW", "VIC", "QLD", "NT", "SA", "WA", "TAS", "ACT"],
            
            // Shares states
            share_data: {},
            share_code: "",
            share_rows: [[new Date(0), 0]],
            share_columns: [
                {
                    type: "date",
                    title: "Dates"
                },
                {
                    type: "number",
                    title: "AYY"
                }
            ],
            
            // Overlayed states
            overlayed_rows: [[new Date(0), 0]],
            overlayed_columns: [
                {
                    type: "date",
                    title: "Dates"
                },
                {
                    type: "number",
                    title: "AYY"
                }
            ],
            
            // Component states
            overlay_charts: false,
            called: false
        }

        if (props.statistics_area) {
            this.state.share_code = props.share_code;
            this.state.statistics_area = props.statistics_area;
            this.state.statistics_category = props.statistics_category;
            this.state.start_date = props.start_date;
            this.state.end_date = props.end_date;
            this.fetch_data();
        }
    }

    // Update the states if the new props were passed in
    componentWillReceiveProps(newProps){
        this.setState({
            share_code: newProps.share_code,
            statistics_area: newProps.statistics_area,
            statistics_category: newProps.statistics_category,
            start_date: newProps.start_date,
            end_date: newProps.end_date
        });
        this.fetch_data();
    }

    // Calls two other functions to fetch respective data
    fetch_data() {
        this.fetch_shares();
        this.fetch_statistics();
    }

    // Fetch data for the share
    fetch_shares() {
        var s_date = Date.parse(this.state.start_date);
        var e_date = Date.parse(this.state.end_date);
        // Find the difference of days to determine upper window
        var days = this.daydiff(s_date, e_date);
        // Change the date to the required format
        var date_regex = /(\d{4})-(\d{2})-(\d{2})/;
        var matches = date_regex.exec(this.state.start_date);
        var modified_date = matches[2] + "/" + matches[3] + "/" + matches[1];
        var stock_url = "http://electricstats.tk/api/v2/returns?InstrumentID=" + this.state.share_code + "&DateOfInterest=" + modified_date + "&ListOfVar=AV_Return,CM_Return&UpperWindow=" + days + "&LowerWindow=0";
        var stock_result = HTTP.call("GET", stock_url, function (error, results) {
            var json_data = JSON.parse(results.content); //Parse the response as JSON
            
            //Compress data will return data in this form: http://jsoneditoronline.org/?id=2109cce4283543e7d54e3fd2ee484d0a
            var final_data = this.compressData(json_data, this.state.start_date);
            this.setState({ share_data: final_data });
            this.updateShareGraph(false);
        }.bind(this));
    }

    // Fetch data for the industry category
    fetch_statistics() {
        var statistics_url = "http://electricstats.tk/api/v1/" + this.state.statistics_area.toLowerCase() + "?State=AUS,NSW,VIC,QLD,NT,SA,WA,TAS,ACT" + "&Category=" + this.state.statistics_category + "&startDate=" + this.state.start_date + "&endDate=" + this.state.end_date;
        var statistics_result = HTTP.call("GET", statistics_url, function(error, results) {
            var json_data = JSON.parse(results.content);
            this.setState({ statistics_data: json_data.data });
            this.updateStatisticsGraph(false);
        }.bind(this));
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
    daysInMonth(year,month) {
      return new Date(year, month, 0).getDate();
    }

    // Calculates the difference in time between two dates in milliseconds
    daydiff(first, second) {
      return Math.round((second-first)/(1000*60*60*24));
    }

    // Calls the respective methods to update the share and statistics graph
    updateGraph(initialLoad) {
        this.updateShareGraph(initialLoad);
        this.updateStatisticsGraph(initialLoad);
        if (this.state.overlay_charts) {
            this.buildOverlayData(initialLoad, false);
        }
    }

    // Updates the share graph
    updateShareGraph(initialLoad) {
        var datesValues = [];
        var data = this.state.share_data;
        var graphData = {};
        var rows = [];
        var columns = [];

        // Generate the dataset
        for (var property in data) {
            if (data.hasOwnProperty(property)) { // Require so we don't get parent properties
                // Key doesn't exist
                if (!(property in graphData)) {
                    graphData[property] = {};
                }
                
                for (var i = 0; i < data[property].length; i++) {
                    // Loop through all returns
                    for (var returns in data[property][i]) {
                        if (data[property][i].hasOwnProperty(returns)) {
                            if (returns === "Date") {
                                break;
                            }
                            
                            // A particular return doesn't exist as a key
                            if (!(returns in graphData[property])) {
                                graphData[property][returns] = [];
                            }
                            
                            graphData[property][returns].push(data[property][i][returns]);
                        }
                    }

                    // Assuming only one stock
                    datesValues.push(data[property][i].Date);
                }
            }
        }

        var row_entry = [];
        var returns = ["Return", "CM_Return", "AV_Return"];
        var dateRegex = /(\d+)-(\d+)-(\d+)/;
        
        // Convert the data into Google Chart's format
        for (var i = 0; i < datesValues.length; i++) {
            row_entry = [];
            match = dateRegex.exec(datesValues[i]);
            match[2] = parseInt(match[2] - 1);
            
            // Push the date
            row_entry.push(new Date(match[1], match[2], match[3]));
            for (var j = 0; j < returns.length; j++) {
                row_entry.push(graphData[this.state.share_code][returns[j]][i]);
            }
            
            rows.push(row_entry);
        }

        // Build the columns
        columns.push({ type: "date", label: "Dates" });
        for (var i = 0; i < returns.length; i++) {
            columns.push({ type: "number", label: returns[i] });
        }

        if (initialLoad) {
            this.state.dates = datesValues;
            this.state.share_rows = rows;
            this.state.share_columns = columns;
            this.state.called = true;
        } else {
            this.setState({
                dates: datesValues,
                share_rows: rows,
                share_columns: columns,
                called: true
            });
        }
    }

    // Updates the statistics graph
    updateStatisticsGraph(initialLoad) {
        var datesValues = [];
        var graphData = {};
        var rows = [];
        var columns = [];
        var data = this.state.statistics_data;
        var categories = [];
        var val;
        var type;

        // Set the right key to grab data from
        if (this.state.statistics_area === "Merchandise") {
          val = "Value";
          type = "Commodity";
        } else{
          val = "Turnover";
          type = "RetailIndustry";
        }

        // Generate the data set
        for (var i = 0; i < data.length; i++) {
            if (data[i].State === this.state.state_selected) {
                // If key does not exist yet in the object
                if (!(data[i][type] in graphData)) {
                    graphData[data[i][type]] = [];
                    categories.push(data[i][type]);
                }
                
                // Push the data
                graphData[data[i][type]].push(data[i][val]);
                
                // Push the dates if they do not exist yet
                if (datesValues.indexOf(data[i].Date) < 0) {
                    datesValues.push(data[i].Date);
                }
            }
        }

        // Sort the categories
        categories.sort();

        var row_entry = [];
        var dateRegex = /(\d+)-(\d+)-(\d+)/;
        var match = [];

        // Convert the data set into Google Chart's format
        for (var i = 0; i < datesValues.length; i++) {
            row_entry = [];
            match = dateRegex.exec(datesValues[i]);
            match[2] = parseInt(match[2] - 1);
            
            // Push the date
            row_entry.push(new Date(match[1], match[2], match[3]));
            for (var j = 0; j < categories.length; j++) {
                // Probably won't catch undefined errors
                if (graphData[categories[j]][i]) {
                    row_entry.push(graphData[categories[j]][i]);
                } else {
                    row_entry.push(0);
                }
            }
            
            rows.push(row_entry);
        }

        // Build the columns
        columns.push({ type: "date", label: "Dates" });
        for (var i = 0; i < categories.length; i++) {
            columns.push({ type: "number", label: categories[i] });
        }

        if (initialLoad) {
            this.state.statistics_rows = rows;
            this.state.statistics_columns = columns;
            this.state.dates = datesValues;
            this.state.called = true;
        } else {
            this.setState({
                statistics_rows: rows,
                statistics_columns: columns,
                dates: datesValues,
                called: true
            })
        }
    }

    // Combines both shares and statistics data
    buildOverlayData(initialLoad, overlay_charts) {
        var overlayed_rows = [];
        var overlayed_columns = [];

        var overlayed_row_entry = [];
        
        // Combine the two data sets
        var stat_index = 0;
        var current_date = new Date(0);
        for (var i = 0; i < this.state.share_rows.length; i++) {
            current_date = this.state.share_rows[i][0]; // Date is located in the first index
            
            // Check if the statistics row has data in the same date
            try {
                if (this.state.statistics_rows[stat_index][0].getTime() == current_date.getTime()) {
                    // Combine the two rows
                    overlayed_row_entry = this.state.statistics_rows[stat_index].concat(this.state.share_rows[i]);
                    stat_index++;
                } else {
                    // Statistics row doesn't have data for that date
                    overlayed_row_entry = [current_date, 0].concat(this.state.share_rows[i]);
                }
                
                // Remove the share's date
                overlayed_row_entry.splice(2, 1);
                // Push the entry on
                overlayed_rows.push(overlayed_row_entry);
            } catch(err) {
                // Statistics_rows does not have any data whatsoever
            }
        }

        // Combine the two columns
        overlayed_columns = this.state.statistics_columns.concat(this.state.share_columns);
        
        // Remove the share's date column
        overlayed_columns.splice(2, 1);

        if (initialLoad) {
            this.state.overlayed_rows = overlayed_rows;
            this.state.overlayed_columns  = overlayed_columns;
            this.state.overlay_charts = overlay_charts;
        } else {
            this.setState({
                overlayed_rows: overlayed_rows,
                overlayed_columns: overlayed_columns,
                overlay_charts: overlay_charts
            });
        }
    }

    // Handler for the state menu
    changeSelectedState(newState) {
        var new_state = this.state;
        if (newState == new_state.state_selected) {
            return;
        } else {
            new_state.state_selected = newState;
            this.setState(new_state);
            this.updateGraph();
        }
    }

    // Handler for the 'Toggle Overlay Charts' button
    toggleOverlay() {
        var overlay_charts_new = !(this.state.overlay_charts);
        this.buildOverlayData(false, overlay_charts_new);
    }

    render() {
        // Map the states into an array for the State menu
        var state_menu = this.state.states_available.map(function(state) {
            var active = false;
            
            if (this.state.state_selected === state) {
                active = true;
            }
            return (
                <Menu.Item
                    active={active}
                    onClick={(event, data) => this.changeSelectedState(data.content)}
                    content={state}
                />
            );
        }, this);

        return (
                <div>
                { this.state.overlay_charts ? (
                    <div>
                        {/*
                            OVERLAYED CHARTS
                        */}
                        {this.state.states_available.length > 0 &&
                            <Menu pointing>
                                <Menu.Item header>
                                    States:
                                </Menu.Item>
                                {state_menu}
                                <Menu.Menu position="right">
                                    <Menu.Item>
                                        <Button toggle active={this.state.overlay_charts} onClick={() => this.toggleOverlay()}>
                                            Toggle Overlay Charts
                                        </Button>
                                    </Menu.Item>
                                </Menu.Menu>
                            </Menu>
                        }
                        <Header as="h2" attached="top">
                            { this.state.statistics_area && this.state.share_code ?
                                `${this.state.statistics_area} and ${this.state.share_code} Combined Graph`
                            : "" }
                        </Header>
                        <Segment attached>
                            { this.props.loading &&
                            <Dimmer active>
                                <Loader>Loading</Loader>
                            </Dimmer>
                            }
                            <Chart
                                chartType="LineChart"
                                rows={this.state.overlayed_rows}
                                columns={this.state.overlayed_columns}
                                options={{
                                    hAxis: {
                                        title: "Dates"
                                    },
                                    series: {
                                        0: {targetAxisIndex: 0},
                                        1: {targetAxisIndex: 1},
                                        2: {targetAxisIndex: 1},
                                        3: {targetAxisIndex: 1},
                                    },
                                    vAxes: {
                                        0: {title: "Value ($ millions)"},
                                        1: {title: "Percentages"}
                                    },
                                    legend: {
                                        position: "bottom"
                                    },
                                    explorer: {
                                        actions: ["dragToZoom", "rightClickToReset"],
                                        keepInBounds: true,
                                        maxZoomOut: 1,
                                    }
                                }}
                                width="100%"
                                height="400px"
                                legend_toggle
                            />
                        </Segment>
                    </div>
                ):(
                    <div>
                        {/*
                            Share Charts
                        */}
                        <Header as="h2" attached="top">
                            { this.state.share_code ? `${this.state.share_code} Share Graph` : "Share Graph" }
                        </Header>
                        <Segment attached>
                            { this.props.loading &&
                            <Dimmer active>
                                <Loader>Loading</Loader>
                            </Dimmer>
                            }
                            <Chart
                                chartType="LineChart"
                                rows={this.state.share_rows}
                                columns={this.state.share_columns}
                                options={{
                                    hAxis: {
                                        title: "Dates"
                                    },
                                    vAxis: {
                                        title: "Percentage of Growth"
                                    }, legend: {
                                        position: "bottom"
                                    },
                                    explorer: {
                                        actions: ["dragToZoom", "rightClickToReset"],
                                        keepInBounds: true,
                                        maxZoomOut: 1,
                                    }
                                }}
                                width="100%"
                                height="400px"
                                legend_toggle
                            />
                        </Segment>
                        <Box size="medium" pad="small" />
                        {/*
                            Statistics Charts
                        */}
                        {this.state.states_available.length > 0 &&
                            <Menu pointing>
                                <Menu.Item header>
                                    States:
                                </Menu.Item>
                                {state_menu}
                                <Menu.Menu position="right">
                                    <Menu.Item>
                                        <Button toggle active={this.state.overlay_charts} onClick={() => this.toggleOverlay()}>
                                            Toggle Overlay Charts
                                        </Button>
                                    </Menu.Item>
                                </Menu.Menu>
                            </Menu>
                        }
                        <Header as="h2" attached="top">
                            { this.state.statistics_area === "Retail" ?
                                "Retail Turnover Graph" : "Merchandise Exports Graph" }
                        </Header>
                        <Segment attached>
                            { this.props.loading &&
                            <Dimmer active>
                                <Loader>Loading</Loader>
                            </Dimmer>
                            }
                            <Chart
                                chartType="LineChart"
                                rows={this.state.statistics_rows}
                                columns={this.state.statistics_columns}
                                options={{
                                    hAxis: {
                                        title: "Dates"
                                    },
                                    vAxis: {
                                        title: "Value ($ millions)"
                                    },
                                    legend: {
                                        position: "bottom"
                                    },
                                    explorer: {
                                        actions: ["dragToZoom", "rightClickToReset"],
                                        keepInBounds: true,
                                        maxZoomOut: 1,
                                    }
                                }}
                                width="100%"
                                height="400px"
                                legend_toggle
                            />
                        </Segment>
                    </div>
                )}
            </div>
		  );
    }
}
