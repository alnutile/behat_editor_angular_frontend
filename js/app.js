'use strict';

var app = angular.module('behatEditor', [
    'ngRoute',
    'ui.ace',
    'ngSanitize',
    'ui.bootstrap',
    'sitesServices',
    'testsServices',
    'sitesController',
    'dashController',
    'testsController'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        var path = Drupal.settings.behatEditor.full_path;
        $routeProvider.
            when('/', {
                templateUrl: '/' + path + '/templates/dash.html',
                controller:  'DashController'
            }).
            when('/sites', {
                templateUrl: '/' + path + '/templates/sites.html',
                controller:  'SitesController'
            }).
            when('/sites/:sid', {
                templateUrl: '/' + path + '/templates/site-show.html',
                controller:  'SiteController'
            }).
            when('/sites/:sid/tests/new', {
                templateUrl: '/' + path + '/templates/test-edit.html',
                controller:  'TestNewController'
            }).
            when('/sites/:sid/tests/:tname', {
                templateUrl: '/' + path + '/templates/test-show.html',
                controller:  'TestController'
            }).
            when('/sites/:sid/tests/:tname/edit', {
                templateUrl: '/' + path + '/templates/test-edit.html',
                controller:  'TestEditController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
