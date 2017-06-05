import React, { Component } from 'react';
import Hero from 'grommet/components/Hero';
import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Card from 'grommet/components/Card';
import Animate from 'grommet/components/Animate';

export default class TutorialBanner extends Component {
    render() {
        return(
            <Box colorIndex="neutral-4">
                <Hero size="small">
                    <Animate enter={{"animation": "fade", 
                        "duration": 1000, "delay": 0}}>
                        <Box justify="center" align="center">
                            <Heading>
                                Tutorial
                            </Heading>
                            <Paragraph size="large">
                                Learn how to get started with our API.
                            </Paragraph>
                        </Box>
                    </Animate>
                </Hero>
            </Box>
        );
    }
}
