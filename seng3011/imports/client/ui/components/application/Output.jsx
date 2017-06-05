import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Divider, Header, Segment, Container,
    Grid, Icon, Dropdown, Popup } from 'semantic-ui-react';


// List of allowed download options
const DOWNLOAD_OPTIONS = ["JSON", "TXT", "CSV"];
const DOWNLOAD_OPTIONS_JSON = DOWNLOAD_OPTIONS.map(arrayConvert);

// Maps the options to Semantic-UI usable JSON objects
function arrayConvert(option) {
    return {"text": option, "value": option};
}

// Custom styling for the mock terminal output
var preStyle = {
    overflow: "auto",
    width: "100%",
    maxHeight: "500px",
    minHeight: "500px"
}

export default class Output extends Component {
    constructor(props){
      super(props);

      this.state = {
        output : "",
        copy : false,
        outputLoaded : false,
        downloadOptions: DOWNLOAD_OPTIONS_JSON,
        downloadValue: 'JSON'
      }

     this.fetch_data();

    }

    // Updates the state when new props are passed in
    componentWillReceiveProps(newProps) {
        var new_state = this.state;
        this.setState(new_state);
    }

    // Fetches statistics data from our API
    fetch_data() {
        var statistics_url = "http://electricstats.tk/api/v1/" + this.props.statistics_area.toLowerCase() + "?State=AUS,NSW,VIC,QLD,NT,SA,WA,TAS,ACT" + "&Category=" + this.props.statistics_category + "&startDate=" + this.props.start_date + "&endDate=" + this.props.end_date;
        var statistics_result = HTTP.call("GET", statistics_url, function(error, results) {
            // Parse the JSON data
            var json_data = JSON.parse(results.content);
            var new_state = this.state;
            var output = json_data;
            delete output.log;
            // Stringify for our mock terminal
            var output = JSON.stringify(output, undefined, 4);
            new_state.output = output;
            new_state.outputLoaded = true;
            this.setState(new_state);
        }.bind(this));
    }

    // Handler code for the 'copy to clipboard' button
    onCopyClick(){
        this.setState({ copy : true });
    }

    // Handler code for the 'download' button
    downloadClick(value){
        if(this.state.output == "") return;
        var date = new Date();
        // Builds the filename for the file
        var fileName = 'electricstats' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        var dataType = 'data:';
        var body = this.state.output;

        // Concats the file with the appropriate file type
        if (value.toLowerCase() == 'txt') {
            fileName = fileName.concat('.txt');
            dataType = dataType.concat('text/plain,');
        } else if (value.toLowerCase() == 'json') {
            fileName = fileName.concat('.json');
            dataType = dataType.concat('application/json,');
        } else if (value.toLowerCase() == 'csv') {
            fileName = fileName.concat('.csv');
            dataType = dataType.concat('text/csv,');

            // Converts the JSON data into CSV format
            body = JSON.parse(body);
            var str = '';
            for (var i = 0; i < body.data.length; i++) {
                var line = '';
                for (var index in body.data[i]) {
                    if (line != '') line += ',';
                    line += body.data[i][index];
                }
                str += line + '\r\n';
            }

            body = str;
        } else {
            return;
        }

        // Invoke a download request for the browser
        var anchor = $('<a />')
            .attr('href', dataType + encodeURIComponent(body))
            .attr('download', fileName);
        anchor[0].click();
        anchor.remove();

    }

    // Handler code for the download options dropdown box
    onChangeDownload(value){
      this.setState({ downloadValue: value});
    }

    render() {
        var opts = {};
        if( true ) {
            opts['readOnly'] = 'readOnly';
        }

        return (
            <Container fluid>
            <Segment>
                <Grid columns={3}>
                    <Grid.Column floated="left">
                        <Header>
                            Output
                        </Header>
                    </Grid.Column>
                    <Grid.Column floated="right">
                        <Container textAlign="right">
                            <Popup
                                inverted
                                content="Copy Output"
                                trigger={
                                    <CopyToClipboard text={this.state.output}>
                                        <Icon link name="copy" size="big"/>
                                    </CopyToClipboard>
                                }
                            />
                            Download As:
                            <Dropdown
                                defaultValue={this.state.downloadValue}
                                selection
                                compact
                                options={this.state.downloadOptions}
                                onChange={(event, data) => this.onChangeDownload(data.value)}
                            />
                            <Popup
                                inverted
                                position="top right"
                                content="Download Output"
                                trigger={
                                    <Icon
                                        name="download"
                                        size="big"
                                        link
                                        onClick={(event) => this.downloadClick(this.state.downloadValue)}
                                    />
                                }
                            />
                        </Container>
                    </Grid.Column>
                </Grid>
                <Divider />
                <Segment inverted>
                    <pre style={preStyle}>
                        {this.state.output ? this.state.output : "Loading data..."}
                    </pre>
                </Segment>
            </Segment>
            </Container>
        );
    }
}
