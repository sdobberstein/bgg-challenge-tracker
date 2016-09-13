import React from 'react';
import UsernameChooser from './usernameChooser.jsx';

export default class Challenge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var rawItems = this.props.challenge.items || [];
    var items = rawItems.map(function(item) {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.targetPlays}</td>
        </tr>
      );
    });
    return (
      <div>
        <h3>Challenge: {this.props.challenge.id}</h3>
        <table className="challenge-items">
          <thead>
            <tr>
              <th>Game</th>
              <th>Target Plays</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
        <UsernameChooser challengeId={this.props.challenge.id} />
      </div>
    );
  }
};
