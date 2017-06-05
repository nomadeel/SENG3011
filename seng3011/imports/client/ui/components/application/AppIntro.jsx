import React, { Component } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

export default class AppIntro extends Component {
    render() {
        return(
            <Accordion>
                <Accordion.Title>
                    <Icon name="dropdown" />
                    What's this?
                </Accordion.Title>
                <Accordion.Content>
                <p>
                    This application lets you obtain monthly statistical 
                    data relating to the number of goods and services sold 
                    in Australia as well as products exported overseas.
                </p>
                <p>
                    Selecting "Retail" from the catagories tab will allow 
                    you to view the goods and services sold in Australia 
                    which are catagorised by industry such as Food, 
                    Household Goods etc.
                </p>
                <p>
                    Selecting "Merchandise" from the catagories tab will 
                    give you a list of the goods and services exported by 
                    Australia which have been catagorised via commodity 
                    such as Food and Live Animals, Beverages and Tabacco 
                    etc.
                </p>
                <p>
                    The user can then select one or more
                    industries or commodities and supply a start/end date 
                    and then submit a query. Our application will then 
                    return the monthly turnover of the selected item
                    for every month within the dates specified.
                </p>
                </Accordion.Content>
            </Accordion>
        );
    }
}
