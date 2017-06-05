import React, { Component } from 'react';
import { Card, Grid, Header, Image, Dimmer, Loader, Segment, Item} from 'semantic-ui-react';
import Tile from './Tile.jsx';

// Import w/e components you need here

export default class TileNews extends Component {
    constructor(props) {
        super(props);
    }

    render(){
      // Placeholder assets
      const src = '/src.png'
      var content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce iaculis convallis ligula sed dapibus. Mauris facilisis ut sem sed molestie.";

      // Image settings
      var image_size = 'tiny';
      var image_src = '/src.png';

      // Logo of the share
      var news_image = <Image floated='left' size={image_size} src={src} />
      if(this.props.news_image){
        news_image = <Image floated='left' size={image_size} src={this.props.news_image} />
        image_src = this.props.news_image;
      }

      // Spinner loader
      var loader_state = true;
      if(this.props.news_content){
        loader_state = false;
        content = this.props.news_content;
      }

      // Headline of the news
      var heading = "This is a news headline";
      if(this.props.news_title){
        loader_state = false;
        heading = this.props.news_title;
      }

      return(
        <Segment style={{ height: "260px", overflowY: "scroll" }}>
          <Dimmer active={loader_state}>
            <Loader content='Loading' />
          </Dimmer>
          <Item.Group>
            <Item>
              <Item.Image size={image_size} src={image_src} />

              <Item.Content>
                <Item.Header>{heading}</Item.Header>
                <Item.Description>
                  <p>{content}</p>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      );
    }
}
