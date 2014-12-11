
/**
 * Module dependencies.
 */

var extend = require('extend');
var addons = require('./addons');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

var track = exports.track = function(track, settings){
  var props = track.properties();
  var options = track.options(this.name);
  var traits = options.traits || {};
  var ret = {};

  extend(props, {
    userId: track.userId() || track.sessionId(),
    page_url: track.proxy('properties.url'),
    user_agent: track.userAgent(),
    ip_address: track.ip(),
    traits: traits,
    keen: {
      timestamp: track.timestamp()
    }
  });

  var adds = props.keen.addons = [];
  if (props.ip_address && settings.ipAddon) adds.push(addons.ip);
  if (props.user_agent && settings.uaAddon) adds.push(addons.ua);
  if (props.page_url && settings.urlAddon) adds.push(addons.url);

  ret[track.event()] = [props];
  return ret;
};

/**
 * Map `page`.
 *
 * @param {Page} page
 * @return {Object}
 * @api private
 */

exports.page = function(page, settings){
  var name = page.fullName();
  if (name) return track.call(this, page.track(name), settings);
  else return track.call(this, page.track(), settings);
};

/**
 * Map `screen`.
 *
 * @param {Screen} screen
 * @return {Object}
 * @api private
 */

exports.screen = function(screen, settings){
  var name = screen.name();
  if (name) return track.call(this, screen.track(name), settings);
  else return track.call(this, screen.track(), settings);
};