import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// Semantics UI Components
import { Container, Grid, Segment, Table,
    Header, Divider } from 'semantic-ui-react';

import {offline_stocks} from '../../../Backup.jsx';

// Desired precision for floating points
var PRECISION = 7;

export default class ShareStatistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            share_code: "",
            share_data: {},
            start_date: "",
            end_date: "",
            mean: {},
            min: {},
            max: {}
        }

        // Loads props if defined
        if (props.share_code) {
            this.state.share_code = props.share_code; // JSON object already parsed
            this.state.start_date = props.start_date;
            this.state.end_date = props.end_date;
            this.fetch_shares();
        }
    }

    // Retrieves the shares data from the share API
    fetch_shares() {
        var s_date = Date.parse(this.state.start_date);
        var e_date = Date.parse(this.state.end_date);
        // Find the difference in days for the upper window
        var days = this.daydiff(s_date, e_date);
        // Modify the date to fit the API format
        var date_regex = /(\d{4})-(\d{2})-(\d{2})/;
        var matches = date_regex.exec(this.state.start_date);
        var modified_date = matches[2] + "/" + matches[3] + "/" + matches[1];
        var stock_url = "http://electricstats.tk/api/v2/returns?InstrumentID=" + this.state.share_code + "&DateOfInterest=" + modified_date + "&ListOfVar=AV_Return,CM_Return&UpperWindow=" + days + "&LowerWindow=0";
        var stock_result = HTTP.call("GET", stock_url, function (error, results) {
            var json_data = JSON.parse(results.content); //Parse the response as JSON
            //Compress data will return data in this form: http://jsoneditoronline.org/?id=2109cce4283543e7d54e3fd2ee484d0a
            var final_data = this.compressData(json_data, this.state.start_date);
            this.setState({ share_data: final_data });
            this.updateData();
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

    // Builds the statistical data for shares
    updateData(initialLoad) {
        var mean = {};
        var min = {};
        var max = {};
        var data = this.state.share_data[this.state.share_code];


        // Build the data
        for (var i = 0; i < data.length; i++) {
            for (var property in data[i]) {
                if (data[i].hasOwnProperty(property)) {
                    if (property === "Date") {
                        continue;
                    }
                    // If key doesn't exist
                    if (!(property in mean)) {
                        mean[property] = 0;
                        min[property] = data[i][property];
                        max[property] = data[i][property];
                    }
                    // Increment mean by the data
                    mean[property] += data[i][property];
                    // Update min if we found a new min
                    if (min[property] > data[i][property]) {
                        min[property] = data[i][property];
                    }
                    // Update max if we found a new max
                    if (max[property] < data[i][property]) {
                        max[property] = data[i][property];
                    }
                }
            }
        }

        // Divide each mean to get true mean
        for (var property in mean) {
            if (mean.hasOwnProperty(property)) {
                mean[property] = (mean[property] / data.length).toFixed(PRECISION);
                min[property] = (min[property]).toFixed(PRECISION);
                max[property] = (max[property]).toFixed(PRECISION);
            }
        }


        this.setState({
            mean: mean,
            min: min,
            max: max
        });
    }

    // Returns the HTML for the table entries
    renderEntries() {
        var output = [];
        var first = true;
        var returns = ["Return", "CM_Return", "AV_Return"]
        for (var return_type in returns) {
            output.push(
                <Table.Row>
                    <Table.Cell rowSpan="3">{returns[return_type]}</Table.Cell>
                    <Table.Cell>Mean</Table.Cell>
                    <Table.Cell>{this.state.mean[returns[return_type]]}</Table.Cell>
                </Table.Row>
            );
            output.push(
                <Table.Row>
                    <Table.Cell>Minimum</Table.Cell>
                    <Table.Cell>{this.state.min[returns[return_type]]}</Table.Cell>
                </Table.Row>
            );
            output.push(
                <Table.Row>
                    <Table.Cell>Maximum</Table.Cell>
                    <Table.Cell>{this.state.max[returns[return_type]]}</Table.Cell>
                </Table.Row>
            );
        }
        return output;
    }

    render() {
        var table_entries = this.renderEntries();
        return (
            <Container fluid>
                <Segment>
                    <Header>
                        { this.state.share_code ? `${this.state.share_code} Statistics` : ''}
                    </Header>
                    <Divider />
                    <div style={{ maxHeight: 570, overflowY: "scroll"}}>
                        <Table celled structured>
                            <Table.Header>
                                <Table.HeaderCell>
                                    Return Type
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Statistics Type
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Value (Percentages of Growth)
                                </Table.HeaderCell>
                            </Table.Header>
                            <Table.Body>
                            { table_entries }
                            </Table.Body>
                        </Table>
                    </div>
                </Segment>
            </Container>
        );
    }
}
