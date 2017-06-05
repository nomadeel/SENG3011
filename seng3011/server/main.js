import { Meteor } from 'meteor/meteor';
// import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // code to run on server at startup
  //console.log(CardData);
  // Global API configuration

  retCache = new Meteor.Collection('retCache');
  retCache._createCappedCollection(400000, 1000);

  statCache = new Meteor.Collection('statCache');
  statCache._createCappedCollection(400000, 1000);
});
