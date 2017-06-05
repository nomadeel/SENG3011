import React, { Component } from 'react';
import Hero from 'grommet/components/Hero';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Animate from 'grommet/components/Animate';

export default class Banner extends Component {
    render() {
        return(
            <Box colorIndex="neutral-4">
                <Hero size="medium">
                    <Box direction="row" justify="between" align="center">
                        <Box></Box>
                        <Animate enter={{"animation": "slide-right", "duration": 1000, "delay": 0}}>
                            <Image src='/img/logo.png'
                                size='small'
                                fit='cover'
                            full={false} />
                        </Animate>
                        <Animate enter={{"animation": "slide-left", "duration": 1000, "delay": 0}}>
                            <Card
                            heading={
                                <Heading>
                                    Welcome to ElectricStats.
                                </Heading>
                            }
                            description="Latest Version: 2.2.0 released 24/05/17"
                            size="large"
                            link={
                                <Box>
                                    <Box pad={{vertical: "small"}}>
                                    <Anchor path="/changelog" primary={true}
                                    label="Check the Changelogs"/>
                                    </Box>
                                    <Box>
                                    <Anchor path="/application" primary={true}
                                    label="Try our application"/>
                                    </Box>
                                </Box>
                            } />
                        </Animate>
                    </Box>
                </Hero>
            </Box>
        );
    }
}
