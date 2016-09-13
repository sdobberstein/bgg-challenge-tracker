import React from 'react';

export default class ChallengeStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = this.props.challengeStatus.items || [];
    var itemRows = items.map(function(item) {
      var status = Math.floor((item.completedPlays / item.targetPlays) * 100);
      var style = {
        width: status + '%'
      };
      var meterClassName = 'meter';
      if (status < 30) {
        meterClassName += ' red';
      } else if (status < 60) {
        meterClassName += ' orange';
      } else if (status < 90) {
        meterClassName += ' yellow';
      }
      return (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{status}%</td>
          <td>
            <div className={meterClassName}>
              <span style={style}></span>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <h3>Challenge Status for {this.props.challengeStatus.username}</h3>
        <table className="challenge-items">
          <thead>
            <tr>
              <th>Game</th>
              <th>Status</th>
              <th>Progress Bar</th>
            </tr>
          </thead>
          <tbody>{itemRows}</tbody>
        </table>
      </div>
    );
  }
}
