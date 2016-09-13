import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import ChallengesContainer from './challengesContainer.jsx';
import ChallengeContainer from './challengeContainer.jsx';
import ChallengeStatusContainer from './challengeStatusContainer.jsx';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/challenges" component={ChallengesContainer} />
    <Route path="/challenges/:id" component={ChallengeContainer} />
    <Route path="/challenges/:id/status" component={ChallengeStatusContainer} />
  </Router>
), document.getElementById('container'));
