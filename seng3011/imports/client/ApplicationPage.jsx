import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// UI Components
import PageHeader from './ui/components/global/PageHeader';
import TilesGrid from './ui/components/application/TilesGrid';
import News from './ui/components/application/News';
import StockInfo from './ui/components/application/StockInfo';
import Options from './ui/components/application/Options';
import ApplicationBanner from './ui/components/application/ApplicationBanner';
import Animate from 'grommet/components/Animate';
import Box from 'grommet/components/Box';
import {industries, symbols, industry_map, symbol_map} from './Data';
// Semantics UI Components
import { Container, Grid, Segment, Sidebar,
    Menu, Icon, Button, Breadcrumb, Header,
    Divider } from 'semantic-ui-react';

// Custom CSS style for menu
var menuStyle = {
    borderRadius: "0px",
    marginTop: "0px"
}

export default class ApplicationPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            area: "",
            category: "",
            start_date: "",
            end_date: "",
            loading: false,
            selected_tab: "charts",
            menu_show: true,
            breadcrumb_sections: [
                { key: "Options", content: "Options", active: true }
            ]
        }
    }

    // Handler for breadcrumb
    onBreadcrumbClick(data) {
        console.log(data);
        var menu_show = false;
        var stock_show = false;
        var grid_show = false;
        var active = 0;
        
        // Determine which one was clicked
        if (data.content === "Stocks") {
            // Hide all other screens except for the grid
            menu_show = false;
            stock_show = false;
            grid_show = true;
            active = 1;
        } else if (data.content === "Options") {
            // Hide all other screens except for the options
            menu_show = true;
            stock_show = false;
            grid_show = false;
            active = 0;
        } else {
            // Hide all other screens except for the stock info
            menu_show = false;
            stock_show = true;
            grid_show = false;
            active = 2;
        }
        
        var new_sections = this.state.breadcrumb_sections;
        
        // Update the sections
        for (var i = 0; i < new_sections.length ; i++) {
            if (active == i) {
                new_sections[i].active = true;
                delete new_sections[i].onClick;
            } else {
                new_sections[i].active = false;
                new_sections[i].onClick = (event, data) => this.onBreadcrumbClick(data);
            }
        }
        
        this.setState({
            breadcrumb_sections: new_sections,
            menu_show: menu_show,
            stock_show: stock_show,
            grid_show: grid_show
        });
    }

    onOptionsUpdate(area, category, start_date, end_date) {
        var new_sections = this.state.breadcrumb_sections;
        
        // Check if the second index exists
        if (new_sections[1]) {
            if (new_sections[2]) {
                // Delete the third option if it exists
                new_sections.splice(2, 1);
            }
            new_sections[1].active = true;
            delete new_sections[1].onClick;
        } else {
            new_sections.push({ key: "Stocks", content: "Stocks", active: true });
        }
        
        new_sections[0].active = false;
        new_sections[0].onClick = (event, data) => this.onBreadcrumbClick(data);
        category = category.replace(/ /g, '');
        
        this.setState({
            breadcrumb_sections: new_sections,
            area: area,
            category: category,
            start_date: start_date,
            end_date: end_date,
            menu_show: false,
            grid_show: true
        });
    }

    //This is called from the TileGrid once a tile has been selected
    tileSelected(obj){
        var new_sections = this.state.breadcrumb_sections;  
        
        // Check if the third index exists
        if (new_sections[2]) {
            // Remove it
            new_sections.splice(2, 1);
        }
        
        // Update the state of all other breadcrumb options
        new_sections.push({ key: obj.stock_symbol, content: obj.stock_symbol, active: true })
        new_sections[0].active = false;
        new_sections[1].active = false;
        new_sections[0].onClick = (event, data) => this.onBreadcrumbClick(data);
        new_sections[1].onClick = (event, data) => this.onBreadcrumbClick(data);
        
        this.setState({
            stock: obj.stock_symbol,
            stock_show: true,
            grid_show: false
        });
    }

    render() {
        return(
            <Container fluid>
                <PageHeader />

                <ApplicationBanner />

                <Segment style={menuStyle} raised>
                    <Header size="medium"> Navigation: </Header>
                    <Divider />
                    <Breadcrumb size="big" icon="right angle" sections={this.state.breadcrumb_sections} />
                </Segment>

                <Box pad="medium" size="medium" />
                
                { this.state.menu_show &&
                    <Options 
                        area={this.state.area}
                        category={this.state.category}
                        start_date={this.state.start_date}
                        end_date={this.state.end_date}
                        onOptionsUpdate={this.onOptionsUpdate.bind(this)}
                    />
                }

                { this.state.grid_show &&
                    <Grid>
                        <Grid.Column width={1} />
                            <Grid.Column width={14}>
                            <TilesGrid 
                                onTileSelect={this.tileSelected.bind(this)}
                                area={this.state.area} 
                                industry={this.state.category} 
                                start_date={this.state.start_date} 
                                end_date={this.state.end_date}
                            />
                            </Grid.Column>
                        <Grid.Column width={1} />
                    </Grid>
                }

                { this.state.stock_show &&
                    <StockInfo 
                        share_code={this.state.stock}
                        statistics_area={this.state.area} 
                        statistics_category={this.state.category}
                        start_date={this.state.start_date}
                        end_date={this.state.end_date}
                    />
                }

                { this.state.current_component === "news" &&
                    <News />
                }

            </Container>
        );
    }
}
