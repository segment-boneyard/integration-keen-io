'use strict';

/**
 * Keen IP addon.
 */

exports.ip = {
  input: { ip: 'ip_address' },
  name: 'keen:ip_to_geo',
  output: 'ip_geo_info'
};

/**
 * Keen UA addon.
 */

exports.ua = {
  input: { ua_string: 'user_agent' },
  output: 'parsed_user_agent',
  name: 'keen:ua_parser'
};

/**
 * Keen URL addon.
 */

exports.url = {
  input: { url: 'page_url' },
  output: 'parsed_page_url',
  name: 'keen:url_parser'
};

/**
 * Keen Referrer addon.
 */

exports.referrer = {
  input: {
    referrer_url: 'referrer_url',
    page_url: 'page_url'
  },
  output: 'referrer_info',
  name: 'keen:referrer_parser'
};
