import React, { Component } from 'react';
import Animate from 'grommet/components/Animate';
import Hero from 'grommet/components/Hero';
import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Card from 'grommet/components/Card';
import { Segment, Header, Container } from 'semantic-ui-react';

const semantic = (
            <Segment 
                vertical 
                inverted 
                color="blue" 
                textAlign="center"
                size="huge"
                padded="very"
            >
                <Animate enter={{"animation": "fade", 
                    "duration": 1000, "delay": 0}}>
                <Container text>
                    <Header inverted size="huge">
                        ElectricStats Analytics Platform
                    </Header>
                    Preview and analyse Australian shares.
                </Container>
                </Animate>
            </Segment>
 
);

export default class ApplicationBanner extends Component {
    render() {
        return (
            <Box colorIndex="neutral-4">
                <Hero size="small">
                    <Animate enter={{"animation": "fade", 
                        "duration": 1000, "delay": 0}}>
                        <Box justify="center" align="center">
                            <Heading>
                                ElectricStats Analytics Platform
                            </Heading>
                            <Paragraph size="large">
                                Preview and analyse Australian shares.
                            </Paragraph>
                        </Box>
                    </Animate>
                </Hero>
            </Box>
       );
    }
}
