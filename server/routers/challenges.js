var _ = require('lodash');
var express = require('express');
var router = express.Router();
var challengeService = require('../services/challengeService');
var statusService = require('../services/statusService');
var validate = require('express-jsonschema').validate;

// TODO: pull this out into it's own file so we can test the schema
var ChallengeSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            required: true
          },
          targetPlays: {
            type: 'number',
            minimum: 1,
            required: true
          }
        }
      },
      required: true
    },
    filters: {
      type: 'object',
      properties: {
        mindate: {
          type: 'string',
          pattern: '\\d{4}-\\d{2}-\\d{2}'
        },
        maxdate: {
          type: 'string',
          pattern: '\\d{4}-\\d{2}-\\d{2}'
        },
        username: {
          type: 'string'
        }
      }
    }
  }
};

router.get('/', (req, res) => {
  challengeService.getAllChallenges().then((challenges) => {
    res.json(challenges);
  });
});

router.post('/', validate({ body: ChallengeSchema }), (req, res) => {
  challengeService.saveChallenge(req.body).then((challenge) => {
    res.json(challenge);
  });
});

router.get('/:id', (req, res) => {
  challengeService.getChallengeById(req.params.id).then((challenge) => {
    res.json(challenge);
  });
});

router.put('/:id', validate({ body: ChallengeSchema }), (req, res) => {
  req.body.id = req.params.id;
  challengeService.saveChallenge(req.body).then((challenge) => {
    res.json(challenge);
  });
});

router.get('/:id/status', (req, res) => {
  if (!req.query.username) {
    res.sendStatus(400);
  }

  statusService.getChallengeStatus(req.params.id, req.query.username).then((results) => {
    res.json(results);
  });
});

module.exports = router;
