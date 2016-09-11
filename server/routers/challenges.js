var _ = require('lodash');
var express = require('express');
var router = express.Router();
var challengeService = require('../services/challengeService');
var validate = require('express-jsonschema').validate;

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
            type: 'string',
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

router.put('/:id', (req, res) => {
  challengeService.saveChallenge(req.body).then((challenge) => {
    res.json(challenge);
  });
});

module.exports = router;
