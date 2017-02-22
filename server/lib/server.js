const hapi = require('hapi');
const nes = require('nes');
const inert = require('inert');
const joi = require('joi');
const async = require('async');

/**
 * Validate the needed settings for the server.
 * @param {object} settings - Settings to validate.
 * @param {requestCallback} callback
 */
const validateSettings = (settings, callback) => {
  joi.validate(
    settings,
    joi.object().keys({
      port: joi.number().integer().required(),
      cors: joi.boolean().required(),
    }),
    (err) => {
      callback(err);
    },
  );
};

/**
 * Create the server of the application.
 * @param {object} settings - Server settings.
 * @param {requestCallback} callback
 */
const create = (settings, callback) => {
  let server;
  async.waterfall([
    (next) => {
      validateSettings(settings, next);
    },
    (next) => {
      server = new hapi.Server();
      server.register(inert, () => {});
      server.connection({
        port: settings.port,
        routes: {
          cors: settings.cors,
        },
      });
      server.register(nes, next);
    },
    (next) => {
      server.start(next);
    },
  ], (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, server);
    }
  });
};

module.exports = {
  create,
};
