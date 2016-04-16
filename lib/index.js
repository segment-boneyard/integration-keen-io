'use strict';

/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var fmt = require('util').format;
var Batch = require('batch');
var mapper = require('./mapper');

/**
 * Expose `KeenIO`
 */

var KeenIO = module.exports = integration('Keen IO')
  .endpoint('https://api.keen.io/3.0')
  .ensure('settings.projectId')
  .ensure('settings.writeKey')
  .channels(['server'])
  .mapper(mapper)
  .retries(2);

/**
 * Track.
 *
 * https://keen.io/docs/api/reference/#event-resource
 * https://keen.io/docs/api/reference/#post-request-body-example-of-batch-event-posting
 *
 * @param {Track} track
 * @param {Function} fn
 * @api public
 */

KeenIO.prototype.track = function(payload, fn) {
  return this
    .post(fmt('/projects/%s/events', this.settings.projectId))
    .query({ api_key: this.settings.writeKey })
    .type('json')
    .send(payload)
    .end(this.check(fn));
};

/**
 * Track Page / Screen using `msg`.
 *
 * TODO:
 *
 *    In the new Integration proto abstract this away,
 *    doing `if's` in each integration is annoying,
 *    we can automate this even for integrations
 *    that map to page -> track -- this will reduce errors.
 *
 * @param {Track|Screen} msg
 * @param {Function} fn
 */

KeenIO.prototype.screen = KeenIO.prototype.page = function(msg, fn) {
  var batch = new Batch;
  var category = msg.category();
  var name = msg.fullName();
  var self = this;

  // all
  if (this.settings.trackAllPages) {
    batch.push(track(msg.track()));
  }

  // categorized
  if (category && this.settings.trackCategorizedPages) {
    batch.push(track(msg.track(category)));
  }

  // named
  if (name && this.settings.trackNamedPages) {
    batch.push(track(msg.track(name)));
  }

  // call track with `msg`.
  function track(msg) {
    return function(done) {
      self.track(msg, function(err, arr) {
        if (err) return done(err);
        done(null, arr[1]);
      });
    };
  }

  batch.end(fn);
};

/**
 * Check respponse with `fn(err, res)`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Function}
 * @api private
 */

KeenIO.prototype.check = function(fn) {
  var self = this;
  return this.handle(function(err, res) {
    if (err) return fn(err);
    var event = Object.keys(res.body)[0];
    var results = res.body[event];
    var failures = 0;
    var error;

    if (!results) {
      return fn(self.error('received bad response'));
    }

    results.forEach(function(result) {
      if (result.success) return;
      if (!error) error = result.error;
      self.debug(result.error);
      failures++;
    });

    if (failures) {
      return fn(self.error(error));
    }

    fn(null, res);
  });
};
