import React from 'react';
import $ from 'jquery';
import Challenges from './challenges.jsx';

export default class ChallengesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { challenges: [] };
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/challenges/',
      dataType: 'json',
      success: function(challenges) {
        this.setState({challenges});
      }.bind(this)
    });
  }

  render() {
    return <Challenges challenges={this.state.challenges} />;
  }
};
