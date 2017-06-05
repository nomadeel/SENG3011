import React, { Component } from 'react';
// UI Components
import News from './News';
import Statistics from './Statistics';
import ShareStatistics from './ShareStatistics';
import Box from 'grommet/components/Box';
// Semantic Components
import { Grid, Menu, Message, Button, Icon } from 'semantic-ui-react';
import Charts from './Charts';
import Output from './Output';
import {offline_stocks} from '../../../Backup.jsx';

export default class StockInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current_tab: "charts",
            // Share chart related states
            share_code: "",
            // Statistics chart related states
            statistics_area: "",
            statistics_category: "",
            // Shared
            start_date: "",
            end_date: "",
            charts_message: true,
            analysis_message: true,
            output_message: true
        }

        if (props.share_code) {
            this.state.share_code = props.share_code + ".AX";
            this.state.statistics_area = props.statistics_area;
            this.state.statistics_category = props.statistics_category;
            this.state.start_date = props.start_date;
            this.state.end_date = props.end_date;
        }
    }

    // Updates state when new props are passed in
    componentWillReceiveProps(newProps) {
        this.setState({
            current_tab: "charts",
            share_code: newProps.share_code + ".AX",
            statistics_area: newProps.statistics_area,
            statistics_category: newProps.statistics_category,
            start_date: newProps.start_date,
            end_date: newProps.end_date
        });
    }

    // Handler for clicks on tab menus
    changeTab(data) {
        this.setState({ current_tab: data.name });
    }

    // Dismisses the messages
    helpMessageDismiss(help_message) {
        if (help_message === "Charts") {
            this.setState({
                charts_message: false
            });
        } else if (help_message === "Analysis") {
            this.setState({
                analysis_message: false
            });
        } else if (help_message === "Output") {
            this.setState({
                output_message: false
            });
        }
    }

    render() {
      var temp = {"one" : "two"}

        return (
            <Grid>
                <Grid.Column width={1}/>
                <Grid.Column width={14}>
                    <Grid.Row>
                        <Menu tabular>
                            <Menu.Item
                                name="charts"
                                active={this.state.current_tab === "charts"}
                                onClick={(event, data) => this.changeTab(data)}
                            />
                            <Menu.Item
                                name="analysis"
                                active={this.state.current_tab === "analysis"}
                                onClick={(event, data) => this.changeTab(data)}
                            />
                            <Menu.Item
                                name="output"
                                active={this.state.current_tab === "output"}
                                onClick={(event, data) => this.changeTab(data)}
                            />
                        </Menu>
                        <Box pad="medium" size="medium" />
                        { this.state.current_tab === "charts" &&
                            <div>
                            { this.state.charts_message &&
                            <Message info icon onDismiss={() => this.helpMessageDismiss("Charts")}>
                                <Icon name="help" />
                                <Message.Content>
                                    <Message.Header> Help: </Message.Header>
                                    <Message.List
                                    items={["Hovering over the graph displays tooltips.",
                                        "Click and dragging in the graph zooms into the selected section.",
                                        "Clicking on the legend hides that particular line graph.",
                                        "Clicking on the 'Toggle Overlay Button' combines the two graphs.",
                                        "Right-clicking on the graph resets the zoom level.",
                                        "Clicking each state menu toggles the current displayed state."
                                    ]}
                                    />
                                </Message.Content>
                            </Message>
                            }
                            <Charts
                                share_code={this.state.share_code}
                                statistics_area={this.state.statistics_area}
                                statistics_category={this.state.statistics_category}
                                start_date={this.state.start_date}
                                end_date={this.state.end_date}
                            />
                            </div>
                        }
                        { this.state.current_tab === "analysis" &&
                            <div>
                            { this.state.analysis_message &&
                                <Message info icon onDismiss={() => this.helpMessageDismiss("Analysis")}>
                                    <Icon name="help" />
                                    <Message.Content>
                                        <Message.Header> Help: </Message.Header>
                                        <Message.List
                                        items={["This shows the statistical analysis for the stock and business data."
                                        ]}
                                        />
                                    </Message.Content>
                                </Message>
                            }
                            <Grid>
                                <Grid.Column width={8}>

                                    <Statistics
                                        statistics_area={this.state.statistics_area}
                                        statistics_category={this.state.statistics_category}
                                        start_date={this.state.start_date}
                                        end_date={this.state.end_date}
                                    />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <ShareStatistics
                                        share_code={this.state.share_code}
                                        start_date={this.state.start_date}
                                        end_date={this.state.end_date}
                                    />
                                </Grid.Column>
                            </Grid>
                            </div>
                        }
                        { this.state.current_tab === "output" &&
                            <div>
                            { this.state.output_message &&
                                <Message info icon onDismiss={() => this.helpMessageDismiss("Output")}>
                                    <Icon name="help" />
                                    <Message.Content>
                                        <Message.Header> Help: </Message.Header>
                                        <Message.List
                                            items={["This shows the business data."
                                        ]}
                                    />
                                        </Message.Content>
                                    </Message>
                            }
                            <Output
                              statistics_area={this.state.statistics_area}
                              statistics_category={this.state.statistics_category}
                              start_date={this.state.start_date}
                              end_date={this.state.end_date}
                            />
                            </div>
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Box pad="medium" size="medium" />
                    </Grid.Row>
                    <Grid.Row>
                        <News
                            share_code={this.state.share_code}
                        />
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={1}/>
            </Grid>
        );
    }
}
