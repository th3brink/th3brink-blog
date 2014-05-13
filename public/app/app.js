

  "use strict";

  var requires = [
		'ngRoute',
//		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngTouch',
		'base64',
//		'ngStorage',
		'kinvey',
		'ui.bootstrap',
		'ui.bootstrap.tpls',
		'ui.bootstrap.transition',
        'btford.markdown',
        'th3User',
        'th3Blog',
        'th3Portfolio',
        'th3Tools'
	];



var app = angular.module('th3brink', requires)
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        return $routeProvider.when('/', {
          controller: 'BlogCtrl',
          templateUrl: '/partials/home'

        }).when('/learnMyWords', {
            controller: 'LearnMyWordsCtrl',
            templateUrl: '/partials/learnMyWords'

        }).when('/freelance', {
            controller: 'FreelanceCtrl',
            templateUrl: '/partials/freelance'

        }).when('/gamer', {
            controller: 'GamerCtrl',
            templateUrl: '/partials/gamer'


        }).otherwise({redirectTo: '/'});
    })
    /*
     * Gamer CTRL
     * */
    .controller('GamerCtrl', function ($scope, $rootScope) {
        $rootScope.navLocation = 'gamer';
    })
    /*
     * Freelance CTRL
     * */
    .controller('FreelanceCtrl', function ($scope, $rootScope) {
        $rootScope.navLocation = 'freelance';
    })
    /*
    * LEARN MY WORDS CTRL
    * */
    .controller('LearnMyWordsCtrl',  function ($scope, $rootScope, baseModel) {
        $scope.words = [];
        $scope.newWord = {};
        $scope.newLabel = '';
        $scope.newTag = '';
        $scope.newGroup = '';

        var wordsModel = new baseModel('LearnWords', function (words) {
          $scope.words = words;
        });


        $scope.saveWord = wordsModel.save;
        $scope.removeWord = wordsModel.remove;

    })

    .controller('MainCtrl', function ($scope) {

        $scope.selectedPost = {};
        var output = function (res) {
            console.log(res);

        };


    })

    .directive('markdownEditor', function() {
        return {
            require: 'ngModel',
            replace:true,
            template:'<div class="epic-editor"></div>',
            link: function(scope, element, attrs, ngModel) {

          }
        }
    });