import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import Columns from 'grommet/components/Columns';
import Section from 'grommet/components/Section';
import Animate from 'grommet/components/Animate';
import { Menu, Grid, Container, 
    Header, Segment } from 'semantic-ui-react';

// Custom styles for the <p> tag
var paragraphStyle = {
    fontSize: "16px"
}

export default class Changelog extends Component {
    constructor() {
        super();

        this.state = {
            to_display: v8,
            selected_version: "2.3.0"
        }

        this.updateState = this.updateState.bind(this);
    }

    // Swap the current displayed changelog
    updateState(version) {
        var t_d;
        if (version === "2.3.0") {
            t_d = v8;
        } else if (version === "2.2.0") {
            t_d = v7;
        } else if (version === "2.1.1") {
            t_d = v6;
        } else if (version === "2.1.0") {
            t_d = v5;
        } else if (version === "2.0.0") {
            t_d = v4;
        } else if (version === "1.2.0") {
            t_d = v3;
        } else if (version === "1.1.0") {
            t_d = v2;
        } else if (version === "1.0.0") {
            t_d = v1;
        }
        this.setState({
            to_display: t_d,
            selected_version: version
        });
    }

    render() {
        return(
            <Container fluid>
            <Box size="medium" pad="medium" />
            <Grid columns={4}>
                <Grid.Column width={2} />
                <Grid.Column width={4}>
                    <Header as="h2">
                        Versions
                    </Header>
                    <Menu pointing secondary vertical size="big">
                        <Menu.Item
                            active={this.state.selected_version === "2.3.0"}
                            onClick={() => this.updateState("2.3.0")}
                        >
                            2.3.0
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "2.2.0"}
                            onClick={() => this.updateState("2.2.0")}
                        >
                            2.2.0
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "2.1.1"}
                            onClick={() => this.updateState("2.1.1")}
                        >
                            2.1.1
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "2.1.0"}
                            onClick={() => this.updateState("2.1.0")}
                        >
                            2.1.0
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "2.0.0"}
                            onClick={() => this.updateState("2.0.0")}
                        >
                            2.0.0 
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "1.2.0"}
                            onClick={() => this.updateState("1.2.0")}
                        >
                            1.2.0 
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "1.1.0"}
                            onClick={() => this.updateState("1.1.0")}
                        >
                            1.1.0 
                        </Menu.Item>
                        <Menu.Item
                            active={this.state.selected_version === "1.0.0"}
                            onClick={() => this.updateState("1.0.0")}
                        >
                            1.0.0
                        </Menu.Item>
                    </Menu>
                </Grid.Column>
                <Grid.Column width={8}>
                    {this.state.to_display}
                </Grid.Column>
                <Grid.Column width={2} />
            </Grid>
            </Container>
        );
    }
}

const v1 = (
    <Container>
        <Header as="h1">
        1.0.0 released 30/03/17
        </Header>
        <p style={paragraphStyle}>
        This is the first official release of our API.
        This contains the basic functionality as
        required by the specifications of API 3:
        Australian Statistics. There are two endpoints:
        <b><i> Retail </i></b> and <b><i> Merchandise
        </i></b>.
        </p>
        <p style={paragraphStyle}>
            <ul>
                <li>
                    <b><i> Retail </i></b>: Outputs
                    information related to
                    certain industry turnover values.
                </li>
                <li>
                    <b><i> Merchandise </i></b>: Outputs information related
                    to the value of exported goods.
                </li>
            </ul>
        </p>
        <p style={paragraphStyle}>
            You can access our API through
        </p>
        <Segment inverted padded>
            <code>
                electricstats.herokuapp.com/api/v1/
            </code>
        </Segment>
        <p style={paragraphStyle}>
            and attaching whatever endpoint you wish to
            access. For more information, you can access
            our documentation in this <a href="/docs.html"> link</a>.
        </p>
    </Container>
);

const v2 = (
    <Container>
        <Header as="h1">
        1.1.0 released 12/04/17
        </Header>
        <p style={paragraphStyle}>
        This is the second official release of our API.
        It builds off our previous 1.0.0 version, adding improved bug fixes 
        to the API core and a GUI application to allow users to easily
        to view and compare statistical data.
        </p>
        <p style={paragraphStyle}>
            The bug fixes to our API include:
            <ul>
                <li>
                Cafes, Restaurants and Takeaway Food category for the
                <b><i> Retail </i></b> endpoint now works as intended.
                </li>
                <li>
                Some cases of dates not being correctly parsed, this no
                longer happens now.
                </li>
                <li>
                Additional error messages are included when there are
                errors in the API link.
                </li>
            </ul>
        </p>
        <p style={paragraphStyle}>
        As of now, most of the GUI application is still in the prototype
        phase, and we plan to improve the look and functionality of our
        application.
        </p>

        <p style={paragraphStyle}>
        You can access our GUI application through the link below, or by
        clicking on the <b><i> Application </i></b> link in our toolbar.
        </p>
        <Segment inverted padded>
        <code>
        electricstats.herokuapp.com/application
        </code>
        </Segment>
    </Container>
);

const v3 = (
    <Container>
        <Header as="h1">
            1.2.0 released 24/04/17
        </Header>
        <p style={paragraphStyle}>
            This is the third release of our API and application.
            The entire interface of the website has been revamped due
            to technical difficulties associated with our previous
            CSS framework. The new layout should be similar to our old
            layout except for the different styling of some components.
        </p>
        <p style={paragraphStyle}>
            Our GUI application has also been revamped. The charts now
            use a different engine to render the data.
        </p>
        <p style={paragraphStyle}>
            The API remains unchanged at this point, no additional bugs
            were discovered.
        </p>
    </Container>
);

const v4 = (
    <Container> 
        <Header as="h1">
            2.0.0 released 24/04/17
        </Header>
        <p style={paragraphStyle}>
            This is the fourth release of our API, and it includes major
            changes to our API.
        </p>
        <p style={paragraphStyle}>
            Due to changes to the output specifications of API3: Australian
            Statistics, we have updated our API to reflect those changes.
            The endpoints and parameters remains the same.
        </p>
        <p style={paragraphStyle}>
            Our new API can be accessed by the following URL and applying
            a particular endpoint.
        </p>
        <Segment inverted padded>
            <code>
                electricstats.herokuapp.com/api/v2/
            </code>
        </Segment>
        <p style={paragraphStyle}>
            Version 1 of our API can still be accessed through the old
            URL:
        </p>
        <Segment inverted padded>
            <code>
                electricstats.herokuapp.com/api/v1/
            </code>
        </Segment>
        <p style={paragraphStyle}>
            Changes include:
            <ul>
                <li>
                    <b><i>Retail</i></b> endpoint data are now nested under 
                    a <i>"MonthlyRetailData"</i> key.
                </li>
                <li>
                    <b><i>Merchandise</i></b> endpoint data are now nested 
                    under a <i>"MonthlyCommodityExportData"</i> key.
                </li>
                <li>
                    All turnover or export values of a category are now
                    grouped together and separated by regions.
                </li>
            </ul>
        </p>
        <p style={paragraphStyle}>
            An example of the changes are included below:
        </p>
        <p style={paragraphStyle}>
            Old:
        </p>
        <Segment inverted padded>
            <pre>
{`"data": [
    {
      "Value": 342613.592,
      "State": "NSW",
      "Commodity": "FoodAndLiveAnimals",
      "Date": "2016-1-31"
    },
    {
      "Value": 407546.616,
      "State": "NSW",
      "Commodity": "FoodAndLiveAnimals",
      "Date": "2016-2-29"
    },
    {
      "Value": 607036.311,
      "State": "VIC",
      "Commodity": "FoodAndLiveAnimals",
      "Date": "2016-1-31"
    },
    {
      "Value": 692685.031,
      "State": "VIC",
      "Commodity": "FoodAndLiveAnimals",
      "Date": "2016-2-29"
    }
]`}
            </pre>
        </Segment>
        <p style={paragraphStyle}>
            New:
        </p>
        <Segment inverted padded>
            <pre>
{`"MonthlyCommodityExportData": [
    {
      "Commodity": "FoodAndLiveAnimals",
      "RegionalData": [
        {
          "State": "NSW",
          "Data": [
            {
              "Date": "2016-1-31",
              "Commodity": 342613.592
            },
            {
              "Date": "2016-2-29",
              "Commodity": 407546.616
            }
          ]
        },
        {
          "State": "VIC",
          "Data": [
            {
              "Date": "2016-1-31",
              "Commodity": 607036.311
            },
            {
              "Date": "2016-2-29",
              "Commodity": 692685.031
            }
          ]
        }
      ]
    }
]`}
            </pre>
        </Segment>
    </Container>
);

const v5 = (
    <Container>
        <Header as="h1">
            2.1.0 released 10/05/17
        </Header>
    <p style={paragraphStyle}>
        This is the fifth release of our API, and it includes new
        features as requested of the Week 10 deliverable.
    </p>
    <p style={paragraphStyle}>
        The application has been modified so that you can now compare
        stocks with <b><i>Retail</i></b> or <b><i>Merchandise</i></b> data.
        The shares chart shows the <b><i>Return</i></b>, <b><i>Cumulative
        Return</i></b>, and <b><i>Average Return</i></b> data. A graph
        of the industrial area related to the selected stock is displayed
        below to allow easy comparisons of trends and relationships of 
        two.
    </p>
    <p style={paragraphStyle}>
        Our original application is still available, and can be accessed
         through the toggle of a button.
    </p>
    <p style={paragraphStyle}>
        Aside from the implementation of features, some UI elements have
        been changed to add accessibility and aesthetic improvements.
    </p>
    </Container>
);

const v6 = (
    <Container>
        <Header as="h1">
            2.1.1 released 11/05/17
        </Header>
        <p style={paragraphStyle}>
            This release contains a bug fix and minor UI improvements for 
            our application.
        </p>
        <p style={paragraphStyle}>
            The bug fix includes:
            <ul>
                <li>
                    All charts and API output will load saved data when
                    swapping between the two tabs in our application:
                    <b><i> Charts</i></b> and <b><i>Output</i></b>.
                </li>
            </ul>
        </p>
        <p style={paragraphStyle}>
            UI improvements include the addition of headers the following
            menus in the application:
            <ul>
                <li>
                    States toggle menu.
                </li>
                <li>
                    Categories and returns toggle menu.
                </li>
            </ul>
        </p>
    </Container>
);

const v7 = (
    <Container>
        <Header as="h1">
            2.2.0 released 24/05/17
        </Header>
        <p style={paragraphStyle}>
            This is the release for the Week 12 presentation. We've revamped 
            the application to provide a different set of features for the
            user. The analytics platform provides information to guide users
            in making informed decisions for their investments.
        </p>
        <p style={paragraphStyle}>
            The application provides charting tools to render visual data
            in a nice manner to allow visual inspection of trends. Aside
            from this, the most recent news for a particular stock is shown.
            The effect of each news is also displayed. The data is also
            analysed statistically to provide information such as
            standard deviation, variance and mean. The data can be
            downloaded via the <b><i> Output </i></b> tab.
        </p>
        <p style={paragraphStyle}>
            Aside from the implementation of features, the UI has also been
            improved to make it more user friendly and intuitive.
        </p>
    </Container>
);

const v8 = (
    <Container>
        <Header as="h1">
            2.3.0 released 31/05/17
        </Header>
        <p style={paragraphStyle}>
            This is the release for the Optiver presentation. We've created
            our own API for company returns. The API uses historic data from
            YAHOO! Finance to calculate a given company's daily returns, 
            cumulative returns and average returns over a selected time period. 
            The documentation for the new API can be found on the Docs page. 
        </p>
        <p style={paragraphStyle}>
            Futhermore, we have utilised the IBM Watson Developer Cloud in order 
            to provide sentimental analysis of news articles for a particular 
            company.
        </p>
    </Container>
);
