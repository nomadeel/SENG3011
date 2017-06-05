import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import PageHeader from './ui/components/global/PageHeader';
import TutorialBanner from './ui/components/tutorial/TutorialBanner';
import Tutorial from './ui/components/tutorial/Tutorial';
import { Container } from 'semantic-ui-react';

export default class TutorialPage extends Component {
    render() {
        return(
            <Container fluid>
                <PageHeader />
                <TutorialBanner />
                <Box size="medium" pad="medium" />
                <Tutorial />
            </Container>
        );
    }
}
