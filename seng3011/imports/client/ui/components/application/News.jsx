import React, { Component } from 'react';
import { Segment, Item, Header, 
    Container, Loader, Dimmer, Divider, Icon } from 'semantic-ui-react';

// URL and API key for the rss2json API
const BASE_URL = "https://api.rss2json.com/v1/api.json";
const API_KEY = "ps4uapykk9tfmnqxwmgdv90neukhitjdxfvwsuzk";

export default class News extends Component {
    constructor(props) {
        super(props);

        this.state = {
            feed: [],
            stock: "",
            sentiment: {}
        }

        if (props.share_code) {
            this.state.stock = props.share_code;
            this.fetchRSSFeed();
        }
    }

    // Fetches the news from the Yahoo RSS feed
    fetchRSSFeed() {
        var rss_url = encodeURIComponent("http://finance.yahoo.com/rss/headline?s=" + this.state.stock);
        var api_url = BASE_URL + "?rss_url=" + rss_url + "&api_key=" + API_KEY + "&order_by=pubDate";
        var rss_call = HTTP.call("GET", api_url, function(error, results) {
            var json = JSON.parse(results.content);
            var dates = this.extract_dates(json.items);
            this.setState({ feed: json.items });
            this.fetchReturns(dates);
            this.sentimentAnalysis(json.items);
        }.bind(this));
    }

    // Fetches the share data
    fetchReturns(dates) {
        var s_d = Date.parse(dates[dates.length - 1]);
        var e_d = Date.parse(dates[0]);
        // Calculate the difference in days for the upper window
        var difference = this.daydiff(s_d, e_d) + 1;
        // Modify the date to match the API
        var date_regex = /(\d{4})-(\d{2})-(\d{2})/;
        var matches = date_regex.exec(dates[dates.length - 1]);
        var modified_date = matches[2] + "/" + matches[3] + "/" + matches[1];
        var stock_url = "http://electricstats.tk/api/v2/returns?InstrumentID=" + this.state.stock + "&DateOfInterest=" + modified_date + "&ListOfVar=AV_Return,CM_Return&UpperWindow=" + difference + "&LowerWindow=0";
        var stock_result = HTTP.call("GET", stock_url, function(error, results) {
            var json_data = JSON.parse(results.content);
            var extracted_returns = this.extract_returns(json_data, dates);
            this.setState({ returns: extracted_returns });
        }.bind(this));
    }

    // Calculates the difference between dates in milliseconds
    daydiff(first, second) {
      return Math.round((second-first)/(1000*60*60*24));
    }

    // Extracts the dates from the RSS feed
    extract_dates(feed) {
        var dates = [];
        for (var i = 0; i < feed.length; i++) {
            dates.push(feed[i].pubDate.split(' ')[0]);
        }
        return dates;
    }

    // Extract the returns corresponding to the publication dates of the article
    extract_returns(returns, dates) {
        var r = {};
        var data = returns.CompanyReturns[0]["Data"];
        var date_index = 0;
        var prev_date = "";
        for (var i = data.length - 1; i > -1; i--) {
            if (dates[date_index] === data[i].Date) {
                prev_date = dates[date_index];
                r[dates[date_index]] = data[i].Return;
                date_index++;
                while (dates[date_index] === prev_date) {
                    prev_date = dates[date_index];
                    date_index++;
                }
                if (date_index == dates.length) {
                    break;
                }
            }
        }
        return r;
    }

    // Fetches the sentiment analysis on a particular article
    sentimentAnalysis (feed) {
        for (var i = 0; i < feed.length; i++) {
            var sentiment_url = "http://electricstats.tk/api/v2/sentiment?url=" + encodeURIComponent(feed[i].link);
            var analysis_call = HTTP.call("GET", sentiment_url, function(error, result) {
                var anaylsis_content = JSON.parse(result.content);
                var old_sentiment = this.state.sentiment;
                old_sentiment[anaylsis_content.original_url] = anaylsis_content.sentiment.document.score;
                this.setState({ 
                    sentiment: old_sentiment
                });
            }.bind(this));
        }
    }

    render() {
        return (
            <Container fluid>
                <Header as="h2" attached="top">
                    {`Latest news related to ${this.state.stock}`}
                </Header> 
                <Segment attached>
                    <Segment basic style={{ maxHeight: "700px", overflowY: "scroll" }}>
                        { this.state.feed.length > 0 ?
                            <Item.Group divided>
                                { this.state.feed.map((f) =>
                                    <Item>
                                        <Item.Content>
                                            <Item.Header 
                                                as='a' 
                                                href={f.link}
                                            >
                                                {f.title}
                                            </Item.Header>
                                            <Item.Meta>
                                                {f.pubDate}
                                            </Item.Meta>
                                            <Item.Description>
                                                {f.content.split('...')[0] + "..."}
                                            </Item.Description>
                                            <Item.Extra>
                                            { this.state.returns &&
                                                `Returns:`
                                            }
                                            { this.state.returns && this.state.returns[f.pubDate.split(' ')[0]] > 0 &&
                                                <Icon color="green" name="arrow up" />
                                            }
                                            { this.state.returns && this.state.returns[f.pubDate.split(' ')[0]] < 0 &&
                                                <Icon color="red" name="arrow down" />
                                            }
                                            { this.state.returns && this.state.returns[f.pubDate.split(' ')[0]] == 0 &&
                                                <Icon color="grey" name="minus" />
                                            }
                                            { this.state.sentiment[f.link] &&
                                                `Sentiment:`
                                            }
                                            { this.state.sentiment[f.link] && this.state.sentiment[f.link] > 0 &&
                                                <Icon name="thumbs up" color="green" />
                                            }
                                            { this.state.sentiment[f.link]  && this.state.sentiment[f.link] < 0 &&
                                                <Icon name="thumbs down" color="red" />
                                            }
                                            </Item.Extra>
                                        </Item.Content>
                                    </Item>
                                )}
                            </Item.Group>
                        :
                            <Dimmer active>
                                <Loader>Loading</Loader>
                            </Dimmer>
                        }
                    </Segment>
                </Segment>
            </Container>
        );
    }
}


