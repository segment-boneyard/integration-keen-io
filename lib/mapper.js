'use strict';

/**
 * Module dependencies.
 */

var extend = require('extend');
var addons = require('./addons');
var objectCase = require('obj-case');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Object}
 */
exports.track = function(track, settings) {
  var props = track.properties();
  var options = track.options(this.name);
  var traits = options.traits || {};

  // TODO(ndhoule): We should pull this information from `Integrations['Keen IO']`
  // rather than encouraging users to pollute their trait data with
  // Keen-specific information
  //
  // Pull Keen-specific call data to enable features like geofiltering, etc. in Keen
  var keenObject = objectCase.find(props, 'keen') || {};
  objectCase.del(props, 'keen');
  props.keen = keenObject;
  props.keen.timestamp = track.timestamp();
  var ret = {};

  extend(props, {
    userId: track.userId() || track.sessionId(),
    page_url: track.proxy('properties.url') || track.proxy('context.page.url'),
    referrer_url: track.proxy('context.page.referrer'),
    user_agent: track.userAgent(),
    ip_address: track.ip(),
    traits: traits,
    keen: props.keen
  });

  var adds = props.keen.addons = [];
  if (props.ip_address && settings.ipAddon) adds.push(addons.ip);
  if (props.user_agent && settings.uaAddon) adds.push(addons.ua);
  if (props.page_url && settings.urlAddon) adds.push(addons.url);
  if (props.page_url && props.referrer_url && settings.referrerAddon) adds.push(addons.referrer);

  ret[track.event()] = [props];
  return ret;
};
