var testsController = angular.module('testsController', ['ngSanitize']);

testsController.controller('TestController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices){
        $scope.tests = TestsServices.get({sid: $routeParams.sid, tname: $routeParams.tname}, function(data) {
            $scope.test = data;
            $scope.test_html = data.content_html;
        });
        $scope.sites = SitesServices.get({sid: $routeParams.sid}, function(data) {
            console.log(data)
            $scope.site = data;
        });
    }]);

testsController.controller('TestEditController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices){
        $scope.token = $http({method: 'GET', url:'/services/session/token'}).success(
            function(data, status, headers, config){
                $http.defaults.headers.post['X-CSRF-Token'] = data;
            }
        );
        $scope.tests = TestsServices.get({sid: $routeParams.sid, tname: $routeParams.tname}, function(data) {
            $scope.test = data;
            console.log(data);
            $scope.test_content = data.content;
            $scope.test_html = data.content_html;
        });
        $scope.sites = SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
        });

        $scope.saveTest = function(model) {
            //1. take the latest model and pass it to the endpoint
            $scope.test.content = model;
            var params = {
                'test': $scope.test,
                'site': $scope.site
            }
            TestsServices.update({sid: $routeParams.sid, tname: $routeParams.tname}, params);
        }

        $scope.testLoaded = function(_editor) {
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _editor.setReadOnly(true);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
        }
    }]);