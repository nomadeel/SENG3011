import React, { Component } from 'react';
import { Card, Grid, Header, Image, Icon } from 'semantic-ui-react';
import Tile from './Tile.jsx';

export default class TileStats extends Component {
    constructor(props) {
        super(props);


        // Add w/e else you need here
        this.state = {
          "loaded" : false
        }
    }

    render(){
      //arrow up
      //arrow down
     //spinner
      var icon_val_trend = 'spinner';
      var icon_size = 'large';
      var icon_colour = 'black';

      // Mean value
      var mean = <Icon loading name='spinner' size={icon_size} />
      if(this.props.mean){
        mean = this.props.mean;
      }

      // Min value
      var min = <Icon loading name='spinner' size={icon_size} />
      if(this.props.min){
        min = this.props.min;
      }

      // Max value
      var max = <Icon loading name='spinner' size={icon_size} />
      if(this.props.max){
        max = this.props.max;
      }


      // Trend value
      var trend = <Icon loading name={icon_val_trend} size={icon_size} />
      if(this.props.trend){
        if(this.props.trend > 0){
          icon_val_trend = 'arrow up';
          icon_colour = 'green';
        }else{
          icon_val_trend = 'arrow down';
          icon_colour = 'red';
        }

        trend = <Icon color={icon_colour} name={icon_val_trend} size={icon_size} />
      }


      // Performance value
      var perf = <Icon loading name={icon_val_trend} size={icon_size} />
      if(this.props.perf){
        if(this.props.perf > 0){
          icon_val_trend = 'arrow up';
          icon_colour = 'green';
        }else{
          icon_val_trend = 'arrow down';
          icon_colour = 'red';
        }

        perf = <Icon color={icon_colour} name={icon_val_trend} size={icon_size} />
      }

      return(
        <Grid>
          <Grid.Row columns={4}>
            <Grid.Column>
              <Header as='h4' textAlign='center'>Mean</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as='h4' textAlign='center' >Min</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as='h4' textAlign='center' >Max</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as='h4' textAlign='center' >Recent Trend</Header>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={4}>
            <Grid.Column textAlign='center'>
              {mean}
            </Grid.Column>

            <Grid.Column textAlign='center'>
              {min}
            </Grid.Column>

            <Grid.Column textAlign='center'>
              {max}
            </Grid.Column>

            <Grid.Column textAlign='center'>
              {perf}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
}
