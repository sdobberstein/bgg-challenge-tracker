import React from 'react';
import $ from 'jquery';
import ChallengeStatus from './challengeStatus.jsx';

export default class ChallengeStatusContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { challengeStatus: {} };
  }

  componentDidMount() {
    $.ajax({
      url: '/api/v1/challenges/' + this.props.params.id + '/status?username=' + this.props.location.query.username,
      dataType: 'json',
      success: function(challengeStatus) {
        this.setState({challengeStatus});
      }.bind(this)
    });
  }

  render() {
    return <ChallengeStatus challengeStatus={this.state.challengeStatus} />;
  }
};
