import React, { Component } from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import GrommetApp from 'grommet/components/App';
import '../../node_modules/grommet/grommet.min.css';
// import '../../bundle.css';
import '../../node_modules/react-month-picker/css/month-picker.css'

// Semantics UI
import { Container } from 'semantic-ui-react';

import {
    Router,
    Route,
    IndexRoute,
    browserHistory
} from 'react-router';

import FrontPage from './FrontPage';
import TutorialPage from './TutorialPage';
import ChangelogPage from './ChangelogPage';
import ApplicationPage from './ApplicationPage';
import Output from './ui/components/application/Output';

// Adds routes for the pages
Meteor.startup(() => {
    injectTapEventPlugin();
    render(
        <Router history={browserHistory}>
            <Container>
                <Route path="/" component={FrontPage}>
                </Route>
                <Route path="/tutorial" component={TutorialPage}>
                </Route>
                <Route path="/changelog" component={ChangelogPage}>
                </Route>
                <Route path="/application" component={ApplicationPage}>
                </Route>
                <Route path="/outputtest" component={Output}></Route>
            </Container>
        </Router>,
        document.getElementById('render-target'));
});
