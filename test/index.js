
var Test = require('segmentio-integration-tester');
var helpers = require('./helpers');
var facade = require('segmentio-facade');
var assert = require('assert');
var should = require('should');
var KeenIO = require('..');

describe('Keen IO', function () {
  var settings;
  var keen;
  var test;

  beforeEach(function(){
    settings = {
      projectId: '5181bcd23843312d87000000',
      writeKey: '6d5c9e2365324fa4a631e88cd4ce7df3ca4bf41e5a9a29e48c2dfb57408bb978f5d2e6d77424fa14c9d167c72d8e1d618c7eea178ecf5934dc8d456e0114ec81112f81e8df9507a31b7bfee9cbd00944f59d54f199f046263578ded79b62c33a435f17907bffae8fd8e109086eb53f1b'
    };
    keen = new KeenIO(settings);
    test = Test(keen, __dirname);
  });

  it('should have the correct settings', function(){
    test
      .name('Keen IO')
      .endpoint('https://api.keen.io/3.0')
      .ensure('settings.projectId')
      .ensure('settings.writeKey')
      .channels(['server']);
  });

  describe('.validate()', function () {
    it('should be invalid when .projectId is missing', function(){
      delete settings.projectId;
      test.invalid({}, settings);
    });

    it('should be invalid when .writeKey is missing', function(){
      delete settings.writeKey;
      test.invalid({}, settings);
    });

    it('should be valid when .writeKey and .projectId are given', function(){
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('track', function(){
      it('should map basic track message', function(){
        test.maps('basic');
      });

      it('should fallback to .anonymousId', function(){
        test.maps('anonymous-id');
      });

      it('should respect .integrations["Keen IO"].traits', function(){
        test.maps('traits');
      });

      it('should add ip addon when .ipAddon is `true`', function(){
        test.maps('ip-addon');
      });

      it('should add user-agent addon when .uaAddon is `true`', function(){
        test.maps('user-agent-addon');
      });

      it('should add url-parser addon when `.urlAddon` is `true`', function(){
        test.maps('url-addon');
      });

      it('should not respect addons when the input is not included', function(){
        test.maps('addons-without-input');
      });

      it('should respect addon options', function(){
        test.maps('addons');
      });
    });

    describe('page', function(){
      it('should map basic page', function(){
        test.maps('page-basic');
      });
    });

    describe('screen', function(){
      it('should map basic screen', function(){
        test.maps('screen-basic');
      });
    });
  });

  describe('.track()', function () {
    it('should track correctly', function (done) {
      test
        .set(settings)
        .track(helpers.track())
        .expects(200)
        .end(done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ writeKey: 'x' })
        .track(helpers.track())
        .error(done);
    });
  });

  describe('.page()', function () {
    it('should page correctly', function (done) {
      test
        .set(settings)
        .page(helpers.page())
        .expects(200)
        .end(done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ writeKey: 'x' })
        .page(helpers.page())
        .error(done);
    });
  });

  describe('.screen()', function () {
    it('should screen correctly', function (done) {
      test
        .set(settings)
        .screen(helpers.screen())
        .expects(200)
        .end(done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ writeKey: 'x' })
        .screen(helpers.screen())
        .error(done);
    });
  });
});
