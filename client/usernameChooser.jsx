import React from 'react';
import { Link } from 'react-router';

export default class UsernameChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', linkClass: 'link-btn disabled' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    var username = e.target.value;
    var linkClass = username.length ? 'link-btn' : 'link-btn disabled';
    this.setState({ username, linkClass });
  }

  render() {
    return (
      <div className="username-chooser">
        <label>Username</label>
        <input type="text" value={this.state.username} onChange={this.handleChange} />
        <Link className={this.state.linkClass} to={{ pathname: `/challenges/${this.props.challengeId}/status`, query: { username: this.state.username } }}>Check</Link>
      </div>
    );
  }
};
