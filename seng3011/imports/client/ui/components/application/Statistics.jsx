import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// Semantics UI Components
import { Container, Grid, Segment, Table,
    Header, Divider } from 'semantic-ui-react';

// Desired precision for the floating point
var PRECISION = 3;

export default class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statistics_area: "",
            statistics_category: "",
            start_date: "",
            end_date: "",
            variance: {},
            mean: {},
            std_dev: {}
        };

        // Load props if call_result defined
        if (props.statistics_area) {
            this.state.statistics_area = props.statistics_area;
            this.state.statistics_category = props.statistics_category;
            this.state.start_date = props.start_date;
            this.state.end_date = props.end_date;
            this.fetch_data();
        }
    }

    // Updates states if new props passed in
    componentWillReceiveProps(newProps) {
        this.setState({
            statistics_area: statistics_area,
            statistics_category: statistics_category,
            start_date: start_date,
            end_date: end_date
        });
        this.fetch_data();
    }

    // Fetch data from our APi
    fetch_data() {
        var statistics_url = "http://electricstats.tk/api/v2/" + this.state.statistics_area.toLowerCase() + "?State=AUS,NSW,VIC,QLD,NT,SA,WA,TAS,ACT" + "&Category=" + this.state.statistics_category + "&startDate=" + this.state.start_date + "&endDate=" + this.state.end_date;
        var statistics_result = HTTP.call("GET", statistics_url, function(error, results) {
            var json_data = JSON.parse(results.content);
            this.setState({ data: json_data });
            this.updateData(false);
        }.bind(this));
    }

    // Calculate statistical data from the data given
    updateData(initialLoad) {
        var variance = {};
        var mean = {};
        var std_dev = {};
        var curr_category = "";
        var curr_state = "";
        var stat_data = [];
        var num_category = 0;
        var num_state = 0;
        // Set up JSON key variables
        if (this.state.statistics_area === "Retail") {
            var stat_data = this.state.data["MonthlyRetailData"];
            var category_name = "RetailIndustry";
            var value_name = "Turnover";
        } else {
            var stat_data = this.state.data["MonthlyCommodityExportData"];
            var category_name = "Commodity";
            var value_name = "Value";
        }

        /*
         *  MEAN 
         */
        for (var i = 0; i < stat_data.length; i++) {
            curr_category = stat_data[i][category_name];
            // Initialise a JSON object for that category
            if (!(curr_category in mean)) {
                mean[curr_category] = {};
            }
            for (var j = 0; j < stat_data[i]["RegionalData"].length; j++) {
                curr_state = stat_data[i]["RegionalData"][j]["State"];
                // Initialise the value for that region
                if (!(curr_state in mean[curr_category])) {
                    mean[curr_category][curr_state] = 0;
                }
                for (var k = 0; k < stat_data[i]["RegionalData"][j]["Data"].length; k++) {
                    mean[curr_category][curr_state] += stat_data[i]["RegionalData"][j]["Data"][k][value_name];
                }
                mean[curr_category][curr_state] = (mean[curr_category][curr_state]/stat_data[i]["RegionalData"][j]["Data"].length).toFixed(PRECISION);
            }
        }

        /*
         *  VARIANCE
         */
        for (var i = 0; i < stat_data.length; i++) {
            curr_category = stat_data[i][category_name];
            // Initialise a JSON object for that category
            if (!(curr_category in variance)) {
                variance[curr_category] = {};
            }
            for (var j = 0; j < stat_data[i]["RegionalData"].length; j++) {
                curr_state = stat_data[i]["RegionalData"][j]["State"];
                // Initialise the value for that region
                if (!(curr_state in variance[curr_category])) {
                    variance[curr_category][curr_state] = 0;
                }
                for (var k = 0; k < stat_data[i]["RegionalData"][j]["Data"].length; k++) {
                    variance[curr_category][curr_state] += Math.pow((stat_data[i]["RegionalData"][j]["Data"][k][value_name] - mean[curr_category][curr_state]), 2);
                }
                variance[curr_category][curr_state] = (variance[curr_category][curr_state]/(stat_data[i]["RegionalData"][j]["Data"].length)).toFixed(PRECISION);
            }
        }

        /*
         *  STANDARD DEVIATION
         */
        var state_count = true;
        for (var category in variance) {
            if (variance.hasOwnProperty(category)) {
            num_category += 1;
                if (!(category in std_dev)) {
                    std_dev[category] = {};
                }
                for (var state in variance[category]) {
                    if (variance[category].hasOwnProperty(state)) {
                        if (state_count) {
                            num_state += 1;
                        }
                        if (!(state in std_dev[category])) {
                            std_dev[category][state] = 0;
                        }
                        std_dev[category][state] = Math.sqrt(variance[category][state]).toFixed(PRECISION);
                    }
                }
                state_count = false;
            }
        }

        if (initialLoad) {
            this.state.mean = mean;
            this.state.variance = variance;
            this.state.std_dev = std_dev;
            this.state.num_category = num_category;
            this.state.num_state = num_state;
        } else {
            this.setState({ mean: mean, variance: variance, std_dev: std_dev,
                num_category: num_category, num_state: num_state});
        }
    }

    // Return HTML for the table entries
    renderEntries() {
        var output = [];
        var first = true;
        for (var category in this.state.mean) {
            if (this.state.mean.hasOwnProperty(category)) {
                first = true;
                for (var state in this.state.mean[category]) {
                    if (this.state.mean[category].hasOwnProperty(state)) {
                        // Add the data now
                        if (first) {
                            first = false;
                            output.push(
                                <Table.Row>
                                    <Table.Cell rowSpan={this.state.num_state * 3}>
                                        {category}
                                    </Table.Cell>
                                    <Table.Cell rowSpan='3'>
                                        {state}
                                    </Table.Cell>
                                    <Table.Cell>
                                        Mean
                                    </Table.Cell>
                                    <Table.Cell>
                                        {this.state.mean[category][state]}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        } else {
                            output.push(
                                <Table.Row>
                                    <Table.Cell rowSpan='3'>
                                        {state}
                                    </Table.Cell>
                                    <Table.Cell>
                                        Mean
                                    </Table.Cell>
                                    <Table.Cell>
                                        {this.state.mean[category][state]}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }
                        output.push(
                            <Table.Row>
                                <Table.Cell>
                                    Variance
                                </Table.Cell>
                                <Table.Cell>
                                    {this.state.variance[category][state]}
                                </Table.Cell>
                            </Table.Row>
                        );
                        output.push(
                            <Table.Row>
                                <Table.Cell>
                                    Standard Deviation
                                </Table.Cell>
                                <Table.Cell>
                                    {this.state.std_dev[category][state]}
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                }
            }
        }
        return output;
    }

    render() {
        var table_entries = this.renderEntries();
        return(
            <Container fluid>
                <Segment>
                    <Header>
                        {this.state.statistics_area ? `${this.state.statistics_area} Statistics` :
                            "Retail/Merchandise Statistics" }
                    </Header>
                    <Divider />
                    <div style={{ maxHeight: 570, overflowY: "scroll"}}>
                    <Table celled structured>
                        <Table.Header>
                            <Table.HeaderCell>
                                Category
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Region
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Statistic Type
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Value ($ millions)
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


