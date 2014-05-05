

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
        'btford.markdown',
		'th3blog.directives',
		'th3blog.services',
        'th3User',
        'th3Blog'
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

        }).when('/portfolio', {
            controller: 'PortfolioCtrl',
            templateUrl: '/partials/portfolio'

        }).when('/freelance', {
            controller: 'FreelanceCtrl',
            templateUrl: '/partials/freelance'

        }).when('/gamer', {
            controller: 'GamerCtrl',
            templateUrl: '/partials/gamer'


        }).otherwise({redirectTo: '/'});
  })


  .controller('PortfolioCtrl', function ($scope, $rootScope) {
        $rootScope.navLocation = 'portfolio';
  })

    .controller('GamerCtrl', function ($scope, $rootScope) {
        $rootScope.navLocation = 'gamer';
    })

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

  });

