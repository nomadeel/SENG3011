import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';
import Card from 'grommet/components/Card';
import Animate from 'grommet/components/Animate';

export default class Intro extends Component {
    render() {
        return (
            <Box align="center" pad={{vertical: "medium"}} colorIndex="brand">
                <Box align="center" textAlign="center"
                size={{"width": {"max": "xxlarge"}}}>
                    <Animate enter={{"animation": "slide-down", 
                        "duration": 1000, "delay": 0}}>
                        <Paragraph size="large" width="large">
                            ElectricStats is an implemention of API3: 
                            Australian Statistics which provides users data 
                            and statistics of different areas of industry.
                            The API is created by Electric Boogaloo of
                            SENG3011. Our team consists of the following
                            members:
                        </Paragraph>
                    </Animate>
                </Box>
                    <Tiles fill={true} size="small" justify="between">
                        <Tile size="small">
                            <Animate enter={{"animation": "slide-up", 
                            "duration": 1000, "delay": 0}}>
                                <Card
                                    label="Simon Taylor"
                                    align="center"
                                />
                            </Animate>
                        </Tile>
                        <Tile size="small">
                            <Animate enter={{"animation": "slide-up", 
                            "duration": 1000, "delay": 0}}>
                                <Card
                                    label="Kaan Apaydin"
                                    align="center"
                                />
                            </Animate>
                        </Tile>
                        <Tile size="small">
                            <Animate enter={{"animation": "slide-up", 
                            "duration": 1000, "delay": 0}}>
                                <Card
                                    label="Kevin Luo"
                                    align="center"
                                />
                            </Animate>
                        </Tile>
                        <Tile size="small">
                            <Animate enter={{"animation": "slide-up", 
                            "duration": 1000, "delay": 0}}>
                                <Card
                                    label="Orion Larden"
                                    align="center"
                                />
                            </Animate>
                        </Tile>
                        <Tile size="small">
                            <Animate enter={{"animation": "slide-up", 
                            "duration": 1000, "delay": 0}}>
                                <Card
                                    label="Damon Lee"
                                    align="center"
                                />
                            </Animate>
                        </Tile>
                    </Tiles>
            </Box>
        );
    }
}
