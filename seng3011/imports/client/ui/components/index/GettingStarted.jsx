import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import Columns from 'grommet/components/Columns';
import Animate from 'grommet/components/Animate';
import { Grid, Button, Container } from 'semantic-ui-react';
import { Link } from 'react-router';

// Custom style for the <p> tag
var paragraphStyle = {
    fontSize: "24px"
}

export default class GettingStarted extends Component {
    render() {
        return (
            <Box pad="medium">
                <Container textAlign="center">
                    <Animate enter={{"animation": "slide-up", 
                        "duration": 1000, "delay": 0}}
                    >
                    <Grid>
                    <Grid.Row>
                        <Container text>
                            <p style={paragraphStyle}>
                            Not sure how to start using our API? 
                            You can follow our 
                            tutorial linked underneath. Otherwise, head on 
                            over to our documentation for a more detailed 
                            explanation of how stuff works. Just want an
                            GUI? Try our application by hitting the button
                            below.
                            </p>
                        </Container>
                    </Grid.Row>
                    <Grid.Row>
                    <Grid columns={3}>
                        <Grid.Column width={4} floated="right">
                            <Button 
                                size="massive" 
                                primary 
                                fluid
                                as={Link}
                                to="/tutorial"
                            >
                                Tutorial
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={4} fluid>
                            <Button 
                                size="massive" 
                                primary 
                                fluid
                                href="/docs.html"
                            >
                                Docs
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={4} fluid floated="left">
                            <Button 
                                size="massive" 
                                primary 
                                fluid
                                as={Link}
                                to="/application"
                            >
                                Application
                            </Button>
                        </Grid.Column>
                    </Grid>
                    </Grid.Row>
                    </Grid>
                    </Animate>
                </Container>
            </Box>
        );
    }
}
