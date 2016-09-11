import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import ChallengeStatusContainer from './challengeStatusContainer.jsx';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/challenges/:id/status" component={ChallengeStatusContainer} />
  </Router>
), document.getElementById('container'));
