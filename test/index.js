'use strict';

var Test = require('segmentio-integration-tester');
var helpers = require('./helpers');
var KeenIO = require('..');

describe('Keen IO', function() {
  var settings;
  var keen;
  var test;

  beforeEach(function() {
    settings = {
      projectId: '5181bcd23843312d87000000',
      writeKey: '6d5c9e2365324fa4a631e88cd4ce7df3ca4bf41e5a9a29e48c2dfb57408bb978f5d2e6d77424fa14c9d167c72d8e1d618c7eea178ecf5934dc8d456e0114ec81112f81e8df9507a31b7bfee9cbd00944f59d54f199f046263578ded79b62c33a435f17907bffae8fd8e109086eb53f1b',
      trackNamedPages: true
    };
    keen = new KeenIO(settings);
    test = Test(keen, __dirname);
  });

  it('should have the correct settings', function() {
    test
      .name('Keen IO')
      .endpoint('https://api.keen.io/3.0')
      .ensure('settings.projectId')
      .ensure('settings.writeKey')
      .channels(['server']);
  });

  describe('.validate()', function() {
    it('should be invalid when .projectId is missing', function() {
      delete settings.projectId;
      test.invalid({}, settings);
    });

    it('should be invalid when .writeKey is missing', function() {
      delete settings.writeKey;
      test.invalid({}, settings);
    });

    it('should be valid when .writeKey and .projectId are given', function() {
      test.valid({}, settings);
    });
  });

  describe('mapper', function() {
    describe('track', function() {
      it('should map basic track message', function() {
        test.maps('basic');
      });

      it('should fallback to .anonymousId', function() {
        test.maps('anonymous-id');
      });

      it('should respect .integrations["Keen IO"].traits', function() {
        test.maps('traits');
      });

      it('should respect props.keen object', function() {
        test.maps('keen-props');
      });

      it('should add ip addon when .ipAddon is `true`', function() {
        test.maps('ip-addon');
      });
      
      it('should add referrer addon when .referrerAddon is `true`', function() {
        test.maps('referrer-addon');
      });

      it('should add user-agent addon when .uaAddon is `true`', function() {
        test.maps('user-agent-addon');
      });

      it('should add url-parser addon when `.urlAddon` is `true`', function() {
        test.maps('url-addon');
      });

      it('should not respect addons when the input is not included', function() {
        test.maps('addons-without-input');
      });

      it('should respect addon options', function() {
        test.maps('addons');
      });
    });
  });

  describe('.track()', function() {
    it('should track correctly', function(done) {
      test
        .set(settings)
        .track(helpers.track())
        .expects(200)
        .end(done);
    });

    it('should error on invalid creds', function(done) {
      test
        .set({ writeKey: 'x' })
        .track(helpers.track())
        .error(done);
    });
  });

  describe('.page()', function() {
    it('should be able to track all pages', function(done) {
      var json = test.fixture('page-all');
      json.output['Loaded a Page'][0].keen.timestamp = new Date(json.output['Loaded a Page'][0].keen.timestamp);
      test
        .set(settings)
        .set(json.settings)
        .page(json.input)
        .query('api_key', settings.writeKey)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should be able to track named pages', function(done) {
      var json = test.fixture('page-named');
      json.output['Viewed Home Page'][0].keen.timestamp = new Date(json.output['Viewed Home Page'][0].keen.timestamp);
      test
        .set(settings)
        .set(json.settings)
        .page(json.input)
        .query('api_key', settings.writeKey)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should be able to track categorized pages', function(done) {
      var json = test.fixture('page-categorized');
      json.output['Viewed Docs Page'][0].keen.timestamp = new Date(json.output['Viewed Docs Page'][0].keen.timestamp);
      test
        .set(settings)
        .set(json.settings)
        .page(json.input)
        .query('api_key', settings.writeKey)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should error on invalid creds', function(done) {
      test
        .set({ writeKey: 'x' })
        .page(helpers.page())
        .error(done);
    });
  });

  describe('.screen()', function() {
    it('should be able to track all screens', function(done) {
      var json = test.fixture('screen-all');
      json.output['Loaded a Screen'][0].keen.timestamp = new Date(json.output['Loaded a Screen'][0].keen.timestamp);
      test
        .set(settings)
        .set(json.settings)
        .screen(json.input)
        .query('api_key', settings.writeKey)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should be able to track named screens', function(done) {
      var json = test.fixture('screen-named');
      json.output['Viewed Home Screen'][0].keen.timestamp = new Date(json.output['Viewed Home Screen'][0].keen.timestamp);
      test
        .set(settings)
        .set(json.settings)
        .screen(json.input)
        .query('api_key', settings.writeKey)
        .sends(json.output)
        .expects(200)
        .end(done);
    });

    it('should error on invalid creds', function(done) {
      test
        .set({ writeKey: 'x' })
        .screen(helpers.screen())
        .error(done);
    });
  });
});
