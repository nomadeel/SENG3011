// React libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// Semantic UI components
import { Divider, Segment, Dropdown, Header,
    Grid, Button, Loader, Message, Container,
    Checkbox, Input, Icon, Popup } from 'semantic-ui-react';
// Month picker library
import Picker from 'react-month-picker';
// JSON objects of industry mappings
import { symbols_list, symbol_subset} from '../../../Data.jsx'

// Options for area
const AREA_OPTIONS = ['Retail', 'Merchandise'];
// Options for state
const STATE_OPTIONS = ['AUS', 'NSW', 'VIC', 'QLD', 'ACT', 'SA', 'WA', 'NT', 'TAS'];
// Options for retail industries
const CAT_OPTIONS_RETAIL = ['Total', 'Food', 'Household Good', 'Clothing Footware And Personal Accessory', 'Department Stores', 'Cafes Restaurants And Takeaway Food', 'Other'];
// Options for merchandise industries
const CAT_OPTIONS_MERCHANDISE = ['Total', 'Food And Live Animals', 'Beverages And Tobacco', 'Crude Material And Inedible',	'Mineral Fuel Lubricant And Related Material', 'Animal And Vegetable Oil Fat And Waxes', 'Chemicals And Related Products', 'Manufactured Goods', 'Machinery And Transport Equipments', 'Other Manufactured Articles', 'Unclassified'];
// Options for months (used in picking date ranges)
const MONTH_OPTIONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Map all arrays into JSON objects
const AREA_OPTIONS_JSON = AREA_OPTIONS.map(arrayConvert);
const STATE_OPTIONS_JSON = STATE_OPTIONS.map(arrayConvert);
const CAT_OPTIONS_RETAIL_JSON = CAT_OPTIONS_RETAIL.map(arrayConvert);
const CAT_OPTIONS_MERCHANDISE_JSON = CAT_OPTIONS_MERCHANDISE.map(arrayConvert);
const SHARE_OPTIONS_JSON  = Object.keys(symbol_subset).map(arrayConvert);

// Converts arrays into JSON objects required by Semantic UI
function arrayConvert(option) {
    return {"text": option, "value": option};
}

// Gets the API url stored in the component state
function get_url(){
    return this.state.api_url;
}

// Combines all elements into a string
function arrayTostring(array){
    var index;
    var string;
    for (index = 0; index < array.length; ++index) {
        if(index == 0){ //undefined bug for string where it inserts value
            string = array[0];
        }else{
            string = string + ',' + array[index];
        }
    }
    return string;
}

// Changes a date from YYYY/MM/DD to YYYY-MM-DD
function getCustomDate(value){
    var myString = String(value)
    var myRegexp = /([0-9]+)\/([0-9]+)\/([0-9]+)/g;
    var match = myRegexp.exec(myString);
    return (match[3] + '-' + bufferDate(match[2]) + '-' + bufferDate(match[1]));

}

// Adds an extra 0 to dates
function bufferDate(value){
    if(value.length < 2){
        return '0' + value;
    }else{
        return value;
    }
}

export default class Options extends Component {
    constructor(props) {
      super(props);
      this.state = {
        help_message: true,
        share_options: SHARE_OPTIONS_JSON,
        area_options: AREA_OPTIONS_JSON,
        month_options: MONTH_OPTIONS,
        area_curr_value: "",
        cat_options: [],
        cat_value: "",
        date_start_value: '',
        date_end_value: '',
        start_picker: {},
        end_picker: {},
        date_end_object: undefined,
        date_start_object: undefined,
        incorrect_date_error: '',
        min_one_selection_error: '',

        //Temp date storage
        conflicting_date_start: undefined,
        conflicting_date_end: undefined,
      };

      this.handleStartDateBox = this.handleStartDateBox.bind(this);
      this.handleEndDateBox = this.handleEndDateBox.bind(this);
    }

    // Handler code for the area of interest dropdown box
    onChangeStateArea(value){
        this.setState({ area_curr_value: value });
        // Load the appropriate options for the category dropdown box
        if(value === 'Retail'){
            this.state.cat_options = CAT_OPTIONS_RETAIL_JSON;
            this.state.cat_value = "";
        }else{
            this.state.cat_options = CAT_OPTIONS_MERCHANDISE_JSON;
            this.state.cat_value = "";
        }
    }

    // Handler code for the category dropdown box
    onChangeCat(value) {
        this.setState({ cat_value: value });
    }

    // Handler code for selecting start dates
    onStartTimeChange(year, month) {
        var myString = month + "/" + year;
        var start_string = MONTH_OPTIONS[month - 1] + ". " + year;
        this.setState({ date_start_value: start_string });
        this.setState({ start_picker: {year: year, month: month}});
        // Regex matching for the month and year
        var myRegexp = /([0-9]+)\/([0-9]+)/g;
        var match = myRegexp.exec(myString);
        var month = parseInt(match[1]) - 1;

        // Create the date object to compare with the end date
        this.state.date_start_object = new Date(match[2],month);

        // Throw an error if end date is before start date
        if(this.state.date_end_object < this.state.date_start_object){
            this.state.incorrect_date_error = 'End date is before start date!';
        }else{
            // Set the date state
            this.state.incorrect_date_error = '';
            var temp_month = match[1];
            if (parseInt(match[1]) < 10) {
                temp_month = "0" + match[1];
            }
            this.state.conflicting_date_start = match[2] + '-' + temp_month + '-' + '01';
        }
    }

    // Handler code for selecting end dates
    onEndTimeChange(year, month) {
        var myString = month + "/" + year;
        var end_string = MONTH_OPTIONS[month - 1] + ". " + year;
        this.setState({date_end_value: end_string});
        this.setState({ end_picker: {year: year, month: month}});
        // Regex to match month and year
        var myRegexp = /([0-9]+)\/([0-9]+)/g;
        var match = myRegexp.exec(myString);

        // Date object to compare end date with start date
        this.state.date_end_object = new Date(match[2],parseInt(match[1]),0);

        // Check if end date is before start date
        if(this.state.date_end_object < this.state.date_start_object){
            this.state.incorrect_date_error = 'End date is before start date!';
        }else{
            // Set the state for end date
            this.state.incorrect_date_error = '';
            var temp_month = match[1];
            if (parseInt(match[1]) < 10) {
                temp_month = "0" + match[1];
            }
            this.state.conflicting_date_end =  match[2] + '-' + temp_month + '-' + this.state.date_end_object.getDate();
        }
    }

    // Passes share related states back to parent component
    shareHandler() {
        var start_date = getCustomDate(this.state.conflicting_date_start);
        var end_date = getCustomDate(this.state.conflicting_date_end);
        this.props.onShareUpdate(this.state.area_curr_value, start_date, end_date, this.state.selected_share);
    }

    // Passes statistics related states back to parent component
    statisticsHandler() {
        // Error checking
        if(this.state.state_value.length < 1){
            this.setState({min_one_selection_error: 'Select at least one'});
        }else{
            this.setState({min_one_selection_error: ''});
        }

        // Grab all related information needed to build API link
        var all_states = arrayTostring(this.state.state_value);
        var all_cat = arrayTostring(this.state.cat_value);
        var start_date = getCustomDate(this.state.conflicting_date_start);
        var end_date = getCustomDate(this.state.conflicting_date_end);

        // Build the API link
        var base_url = 'electricstats.herokuapp.com/api/v1/'
        var api_url = base_url + this.state.area_curr_value.toLowerCase() + '?State=' + all_states + '&Category=' + all_cat.replace(/ /g,'') + '&startDate=' + start_date + '&endDate=' + end_date;

        // Pass it back to parent component
        this.state.api_url = api_url;
        this.props.onStatisticsUpdate(api_url, this.state.area_curr_value, this.state.state_value, this.state.cat_value);
    }

    // Handler code for the "Submit/Show me some stocks!" button
    onButtonClick(value){
        if (this.state.area_curr_value === "") {
            this.setState({ area_error: true });
            return;
        } else if (this.state.cat_value === "") {
            this.setState({ category_error: true });
            return;
        } else if (!(this.state.conflicting_date_start)) {
            this.setState({ start_date_error: true });
            return;
        } else if (!(this.state.conflicting_date_end)) {
            this.setState({ end_date_error: true });
            return;
        }
        this.props.onOptionsUpdate(this.state.area_curr_value, this.state.cat_value, this.state.conflicting_date_start, this.state.conflicting_date_end);
    }

    // Opens the start date box
    handleStartDateBox(e) {
        this.refs.startDateBox.show();
    }

    // Opens the end date box
    handleEndDateBox(e) {
        this.refs.endDateBox.show();
    }

    // Dismisses the Help message
    helpMessageDismiss() {
        this.setState({
            help_message: false
        });
    }

    render() {
        return(
            <Container>
            { this.state.help_message &&
                <Message info icon onDismiss={() => this.helpMessageDismiss()}>
                    <Icon name="help" />
                    <Message.Content>
                        <Message.Header> Help: </Message.Header>
                        <Message.List
                        items={["Fill all information below and hit the big blue 'Show me some stocks!' button to display some stocks in the selected area and category."
                        ]}
                        />
                    </Message.Content>
                </Message>
            }
            <Segment>
                <Grid>
                <Grid.Column floated="left" width={4}>
                <Header size="medium">
                    Analytics Options
                </Header>
                </Grid.Column>
                </Grid>
                <Divider />
                <Grid padded>
                <Grid.Row>
                What area of business are you interested in?
                <Dropdown
                    placeholder="Select area of interest"
                    fluid
                    selection
                    options={this.state.area_options}
                    onChange={(event, data) => this.onChangeStateArea(data.value)}
                />
                </Grid.Row>
                <Grid.Row>
                What industry would you like to invest in?
                <Dropdown
                    placeholder="Select industry"
                    fluid
                    search
                    selection
                    options={this.state.cat_options}
                    value={this.state.cat_value}
                    onChange={(event, data) => this.onChangeCat(data.value)}
                />
                </Grid.Row>
                <Grid.Row>
                    Starting date point:
                                        <Button
                        fluid
                        onClick={this.handleStartDateBox}
                    >
                        {this.state.date_start_value ? this.state.date_start_value : 'Start Date'}
                    </Button>
                        <Picker
                            ref="startDateBox"
                            years={{min: 2000, max: 2016}}
                            value={this.state.start_picker ? this.state.start_picker : {year: 2016, month: 12}}
                            onChange={this.onStartTimeChange.bind(this)}
                            lang={this.state.month_options}
                        >
                        </Picker>
                </Grid.Row>
                <Grid.Row>
                    Ending date point:
                    {this.state.incorrect_date_error &&
                    <Container>
                        <div></div>
                        <Message negative>
                            End date is before start date!
                        </Message>
                        <div></div>
                    </Container>
                    }
                    <Button
                        fluid
                        onClick={this.handleEndDateBox}
                    >
                        {this.state.date_end_value ? this.state.date_end_value : 'End Date'}
                    </Button>
                    <Picker
                        ref="endDateBox"
                        years={{min:2000, max:2016}}
                        value={this.state.end_picker ? this.state.end_picker : {year: 2016, month: 12}}
                        onChange={this.onEndTimeChange.bind(this)}
                        lang={this.state.month_options}
                    >
                    </Picker>
                </Grid.Row>
                </Grid>
                <Divider />
                { this.state.area_error && 
                    <Message negative>
                        Please select an area.
                    </Message>
                }
                { this.state.category_error && 
                    <Message negative>
                        Please select a category.
                    </Message>
                }
                { this.state.start_date_error && 
                    <Message negative>
                        Please select a start date.
                    </Message>
                }
                { this.state.end_date_error && 
                    <Message negative>
                        Please select a end date.
                    </Message>
                }
                <Button
                    primary
                    onClick={(event, data) => this.onButtonClick(data)}
                >
                    Show me some stocks!
                </Button>
            </Segment>
            </Container>
        );
        // return null;

    }
}
