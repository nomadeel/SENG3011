import React, { Component } from 'react';
import Animate from 'grommet/components/Animate';
import { Segment, Container, Header, Grid, 
    Divider } from 'semantic-ui-react';

// Custom style for the <p> tag
var paragraphStyle = {
    fontSize: "16px"
}

export default class Tutorial extends Component {
    render() {
        return(
            <Container>
                <Animate enter={{"animation": "fade", 
                    "duration": 1000, "delay": 0}}>
                    {/*
                        ENDPOINTS SECTION
                    */}
                    <Grid>
                    <Grid.Row>
                    <Header as="h1">
                        Endpoints
                    </Header>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        In this tutorial, you will learn how to get started
                        with our API to fetch data from various industry
                        groups.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        Our API offers two main points of queries gathered 
                        from the Australian Bureau of Statictics,
                        specifically the retail and merchandise export 
                        statistical areas. We cover industry turnover 
                        values in various sectors for our retail aspect 
                        and the price of certain exported goods in our 
                        merchandise endpoint. Our API offers two endpoints:
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <code>
                            electricstats.herokuapp.com/api/v2/retail
                        </code>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <code>
                            electricstats.herokuapp.com/api/v2/merchandise
                        </code>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        The following sections will go into detail on 
                        specific API calls and access types.
                    </p>
                    </Grid.Row>
                    <Divider />
                    {/*
                        RETAIL SECTION
                    */}
                    <Grid.Row>
                    <Header as="h1">
                        Retail
                    </Header>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        Try pasting the following code into your browser URL.
                        It will return a detailed JSON object explained
                        further below.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <code>
                            electricstats.herokuapp.com/api/v2/retail?State=NSW&Category=Food&startDate=2016-01-01&endDate=2016-01-01
                        </code>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        Focusing on the paramaters inside the URL inquiry, 
                        we see that it is calling the Retail API for all 
                        'Food Sector Turnovers' within the time period 
                        '01/01/16 - 31/01/16' inclusivel. These keys are 
                        mostly self explanatory but they are all covered in 
                        our API documentation should you require further 
                        assistance. It is possible that the call returned 
                        will contain multiple elements in the JSON object 
                        if multiple months are specified.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        For example, try changing the <b><i>endDate
                        </i></b> parameter of the previous query to 10-01.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <code>
                            electricstats.herokuapp.com/api/v2/retail?State=NSW&Category=Food&startDate=2016-01-01&endDate=2016-10-01
                        </code>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        You can now see more data contained in each block
                        of elements nested inside the <b><i> data </i></b>
                        object.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        For categories and states, you can specify more
                        than one value in your request. If we wanted to find
                        information relating to the Food
                        and Household Goods industries in NSW and VIC during
                        January, our parameters would be changed such that 
                        the request would look like this:
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <code>
                            electricstats.herokuapp.com/api/v2/retail/?State=NSW,VIC&Category=Food,HouseholdGood&startDate=2016-01-01&endDate=2016-01-31
                        </code>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        The JSON object returned will
                        contain information regarding each industry's 
                        turnover for the states specified.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        Modifying these fields to suit your own API 
                        inquiries is very simple and extensively documented 
                        in our API documentation which contains the format 
                        and range of values each paramater can pass.
                    </p>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                    <Header as="h1">
                        Merchandise Exports
                    </Header>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        The merchandise endpoint follows a similar format
                        to the retail endpoint except that the <b><i>
                        Category </i></b> parameter has a different set
                        of allowed values. Also, in the JSON output, the
                        <b><i> Turnover </i></b> key is replaced with the
                        <b><i> Value </i></b> key for the total export
                        revenue for a particular type of export goods.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        An example of a merchandise endpoint query would be:
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <code>
                            electricstats.herokuapp.com/api/v2/merchandise?State=NSW&Category=ManufacturedGoods&startDate=2016-01-01&endDate=2016-01-31
                        </code>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Divider />
                    {/*
                        LOG SECTION
                    */}
                    <Grid.Row>
                    <Header as="h1">
                        Logs
                    </Header>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        Our API also includes some logging information
                        underneath the <b><i> MonthlyRetailData </i></b> 
                        or <b><i> MonthlyCommodityExportData </i></b> 
                        element in the JSON object.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        It contains information related to the execution
                        and result of our API such as parameters passed,
                        execution start and end, and time taken to process
                        the request. This can be useful when there
                        may a need to track metrics or performance profiling.
                    </p>
                    </Grid.Row>
                    <Divider />
                    {/*
                        INTEGRATION SECTION
                    */}
                    <Grid.Row>
                    <Header as="h1">
                        Integration with our API
                    </Header>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        If you feel confident with the basics of our API you
                        can begin intergrating our API calls into your own 
                        services using the HTTP request templates provided.
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        In a web server environment, it is possible to 
                        perform a simple asynchronous call to our API. An 
                        example of this is an AJAX call in a Javascript
                        environment:
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <pre>
                            {`$.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    async: true,
    url: "electricstats.herokuapp.com/api/v2/retail?<list of parameters>,
    success: <code to handle our data output>
});`}
                        </pre>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <p style={paragraphStyle}>
                        In a desktop application environment such as a
                        script written in a scripting language like Python,
                        you would use the language's JSON and HTTP request
                        libraries to query our API and interpret the data.
                        An example of this in Python would be:
                    </p>
                    </Grid.Row>
                    <Grid.Row>
                    <Container fluid>
                    <Segment inverted padded>
                        <pre>
                            {`import requests
r = requests.get('electricstats.herokuapp.com/api/v2/retail?<list of parameters>')
print r.json`}
                        </pre>
                    </Segment>
                    </Container>
                    </Grid.Row>
                    </Grid>
                </Animate>
            </Container>
        );
    }
}
