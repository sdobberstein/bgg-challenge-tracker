import React from 'react';
import { Link } from 'react-router';

export default class Challenges extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const challenges = this.props.challenges.map(function(challenge) {
      return (
        <li key={challenge.id}>
          <Link to={{ pathname: `/challenges/${challenge.id}` }}>{challenge.id}</Link>
        </li>
      );
    });
    return (
      <div>
        <h3>Challenges</h3>
        <ul>
          {challenges}
        </ul>
      </div>
    );
  }
};
