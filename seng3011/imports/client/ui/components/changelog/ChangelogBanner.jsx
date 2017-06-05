import React, { Component } from 'react';
import Hero from 'grommet/components/Hero';
import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Animate from 'grommet/components/Animate';

export default class ChangelogBanner extends Component {
    render() {
        return(
            <Box colorIndex="neutral-4">
                <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}} keep={true}>
                <Hero size="small">
                    <Box justify="center" align="center">
                        <Heading>
                            Changelog
                        </Heading>
                        <Paragraph size="large">
                            Where you can find the list of changes between 
                            versions.
                        </Paragraph>
                    </Box>
                </Hero>
                </Animate>
            </Box>
        );
    }
}
