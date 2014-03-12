var testsController = angular.module('testsController', ['ngSanitize']);

testsController.controller('TestController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices', 'BehatServices', 'addAlert', 'runTest', 'closeAlert',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices, BehatServices, addAlert, runTest, closeAlert){
        //$scope.alert_tempalate = { name: 'alert_template', url: '/' + Drupal.settings.behatEditor.full_path + '/templates/alerts.html' }
        $scope.alerts = [{ type: 'info', msg: "Test ..."}];
        $scope.test_results = '<strong>Click run to see results...</strong>';

        $scope.tests = TestsServices.get({sid: $routeParams.sid, tname: $routeParams.tname}, function(data) {
            $scope.test = data;
            $scope.test_html = data.content_html;
        });
        $scope.sites = SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
        });

        $scope.closeAlert = function(index) {
            closeAlert(index, $scope);
        };

        $scope.runTest = function() {
              runTest('success', 'Running test...', $scope);
        }
    }]);

testsController.controller('TestEditController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices', 'BehatServices', 'BehatServices', 'addAlert', 'runTest',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices, BehatServices, addAlert, runTest){
        $scope.token = $http({method: 'GET', url:'/services/session/token'}).success(
            function(data, status, headers, config){
                $http.defaults.headers.post['X-CSRF-Token'] = data;
            }
        );
        $scope.tests = TestsServices.get({sid: $routeParams.sid, tname: $routeParams.tname}, function(data) {
            $scope.test = data;
            $scope.test_content = data.content;
            $scope.test_html = data.content_html;
        });
        $scope.sites = SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
        });

        $scope.runTest = function() {
            runTest('success', 'Running test...', $scope);
        }

        $scope.saveTest = function(model) {
            //1. take the latest model and pass it to the endpoint
            $scope.test.content = model;
            var params = {
                'test': $scope.test,
                'site': $scope.site
            }
            TestsServices.update({sid: $routeParams.sid, tname: $routeParams.tname}, params);
        }

        //@TODO move ace into a shared service, or
        $scope.testLoaded = function(_editor) {
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _editor.setReadOnly(true);
            _editor.setShowInvisibles(true);
            _editor.setDisplayIndentGuides(true);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
        }
    }]);

testsController.controller('TestNewController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices){
        $scope.token = $http({method: 'GET', url:'/services/session/token'}).success(
            function(data, status, headers, config){
                $http.defaults.headers.post['X-CSRF-Token'] = data;
            }
        );

        $scope.test = {};
        $scope.site = {};

        var name = new Date().getTime();
        name = name + '.feature';

        $scope.test.name = name;
        $scope.test_content = "Feature: Start Your Test..";
        SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
            $scope.test = {
                "name": $scope.test.name,
                "path": $scope.site.test_files_root_path + '/' + name,
                "content": ''
            };
        });

        $scope.saveTest = function(model) {
            //1. take the latest model and pass it to the endpoint
            $scope.test.content = model;
            var params = {
                'test': $scope.test,
                'site': $scope.site
            }

            TestsServices.create({sid: $routeParams.sid}, params, function(data){
                if(data.errors === 0){
                    console.log(data);
                    $location.path("/sites/" + $scope.site.nid + "/tests/" + data.data.name_dashed + "/edit");
                } else {
                    //output a message to the user
                }
            });
        }

        $scope.testLoaded = function(_editor) {
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _editor.setReadOnly(true);
            _editor.setShowInvisibles(true);
            _editor.setDisplayIndentGuides(true);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
        }
    }]);