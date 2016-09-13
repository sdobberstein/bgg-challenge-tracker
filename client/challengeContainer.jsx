import React from 'react';
import $ from 'jquery';
import Challenge from './challenge.jsx';

export default class ChallengeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { challenge: {} };
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/challenges/' + this.props.params.id,
      dataType: 'json',
      success: function(challenge) {
        this.setState({challenge});
      }.bind(this)
    });
  }

  render() {
    return <Challenge challenge={this.state.challenge} />;
  }
};
