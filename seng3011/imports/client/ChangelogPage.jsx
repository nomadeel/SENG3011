import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import PageHeader from './ui/components/global/PageHeader';
import ChangelogBanner from './ui/components/changelog/ChangelogBanner';
import Changelog from './ui/components/changelog/Changelog';

export default class ChangelogPage extends Component {
    render() {
        return(
            <Box>
                <PageHeader />
                <ChangelogBanner />
                <Changelog />
            </Box>
        );
    }
}
