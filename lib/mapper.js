
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
 * @return {Object}
 * @api private
 */

exports.track = function(track, settings){
  var props = track.properties();
  var options = track.options(this.name);
  var traits = options.traits || {};
  // don't overwrite user's Keen Object and use objectCase
  // in case the casing is funky
  var keenObject = objectCase.find(props, 'keen') || {};
  objectCase.del(props, 'keen');
  props['keen'] = keenObject;
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
