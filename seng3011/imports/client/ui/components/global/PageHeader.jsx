import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router';
export default class PageHeader extends Component {
    render() {
        return(
            <Menu borderless size="huge">
                <Menu.Item
                    header
                    as={Link} to="/"
                >
                    ElectricStats
                </Menu.Item>
                <Menu.Item
                    as={Link} to="/application"
                >
                    Application
                </Menu.Item>
                <Menu.Item
                    as={Link} to="/tutorial"
                >
                    Tutorial
                </Menu.Item>
                <Menu.Item
                    as={Link} to="/changelog"
                >
                    Changelog
                </Menu.Item>
                <Menu.Item
                    href="/docs.html"
                >
                    Docs
                </Menu.Item>
            </Menu>
        );
    }
}
