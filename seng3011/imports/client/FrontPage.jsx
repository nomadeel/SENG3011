import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Box from 'grommet/components/Box';
import Banner from './ui/components/index/Banner';
import Intro from './ui/components/index/Intro';
import GettingStarted from './ui/components/index/GettingStarted';
import PageHeader from './ui/components/global/PageHeader';
import { Link } from 'react-router';

export default class App extends Component {
    render() {
        return(
            <Box>
                <PageHeader />
                <Banner />
                <Intro />
                <GettingStarted />
            </Box>
        );
    }
}
