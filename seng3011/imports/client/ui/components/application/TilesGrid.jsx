import React, { Component } from 'react';
import { Card, Segment, Message, Icon } from 'semantic-ui-react';
import Tile from './Tile.jsx';

import {industries, symbols, industry_map, symbol_map, valid_symbols, valid_symbols2} from '../../../Data.jsx';

export default class TilesGrid extends Component {
    /*
     * Required Props:
     * - area (Retail or merchandise)
     * - industry (An industry)
     * - start_date
     * - end_date
    */
    constructor(props) {
        super(props);



        this.state = {
          "tiles" : this.createTiles(),
            help_message: true
        }

    }

    //Do scene change stuff here
    tileSelected(obj, event){
      this.props.onTileSelect(obj);
    }

    // Create the tiles for each share
    createTiles(){
      var cat_values = [this.props.industry];
      var tile_list = [];
      var sym_list = this.getSymbolList(this.props.area, cat_values);

      for(var i = 0; i < sym_list.length; i++){
        var temp_tile = {};
        if(!valid_symbols[sym_list[i]]){
          continue;
        }
        temp_tile.stock_symbol = sym_list[i];
        temp_tile.stock_name = sym_list[i];
        if(valid_symbols[sym_list[i]].name){
            temp_tile.stock_name = sym_list[i] + " - " + valid_symbols[sym_list[i]].name;
        }
        temp_tile.start_date = this.props.start_date;
        temp_tile.end_date = this.props.end_date;
        temp_tile.area = this.props.area;
        temp_tile.industry = this.props.industry;
        temp_tile.select = this.tileSelected;
        tile_list.push(temp_tile);
      }

      return tile_list;
    }

    // Get the shares belonging to the industry
    getSymbolList(area_interest, cat_values){
      var symbolList = [];
      var symbolSet = new Set();
      for(var i = 0; i < cat_values.length; i++){
        var cat = cat_values[i].replace(/ /g,'');
        var i_val = industries[area_interest][cat];
        for(var j = 0; j < i_val.length; j++){
          var sym = symbols[i_val[j]];
          for(var k = 0; k < sym.length; k++){
            //symbolList.push(sym[k]);
            symbolSet.add(sym[k]);
          }
        }
      }
      symbolList = Array.from(symbolSet);
      return symbolList;
    }

    // Dismisses the help message
    helpMessageDismiss() {
        this.setState({
            help_message: false
        });
    }

    render(){
      const src = '/src.png';
      var tile_components = this.state.tiles.map(function(tile, i) {
            return <Tile key={i} stock_name={tile.stock_name} stock_symbol={tile.stock_symbol} start_date={tile.start_date} end_date={tile.end_date} area={tile.area} industry={tile.industry} onClick={this.tileSelected.bind(this, tile)}/>;
      }.bind(this));


      return(
        <div>
        { this.state.help_message &&
            <Message info icon onDismiss={() => this.helpMessageDismiss()}>
                <Icon name="help" />
                <Message.Content>
                    <Message.Header> Help: </Message.Header>
                    <Message.List
                        items={["Each card shows information about a particular share.",
                            "The star indicates the rating of a particular stock, 5 as the highest rating.",
                            "The bottom of each card shows the recent performance of a stock.",
                            "Clicking on a stock shows more detailed information about a stock."
                        ]}
                    />
                </Message.Content>
                </Message>
        }
        <Card.Group itemsPerRow={3}>
          {tile_components}
        </Card.Group>
        </div>
      );
    }
}
