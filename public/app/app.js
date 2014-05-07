

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

        }).when('/managePortfolio', {
            controller: 'ManagePortfolioCtrl',
            templateUrl: '/partials/managePortfolio'

        }).when('/addPortfolio', {
            controller: 'AddPortfolioCtrl',
            templateUrl: '/partials/addPortfolio'

        }).when('/editPortfolio/:portfolio', {
            controller: 'AddPortfolioCtrl',
            templateUrl: '/partials/addPortfolio'

        }).when('/freelance', {
            controller: 'FreelanceCtrl',
            templateUrl: '/partials/freelance'

        }).when('/gamer', {
            controller: 'GamerCtrl',
            templateUrl: '/partials/gamer'


        }).otherwise({redirectTo: '/'});
    })


    .controller('PortfolioCtrl', function ($scope, $rootScope, $modal, $kinvey, User) {
        $rootScope.navLocation = 'portfolio';
        $scope.portfolios = [];

        var onLoad = function () {
            var promise = $kinvey.DataStore.find('Portfolio');
            promise.then(function(portfolios){
                $scope.portfolios = portfolios;
            });

        };

        if (User.loaded) onLoad();
        User.addObserver(onLoad);

        $scope.open = function (portfolio) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: 'lg',
                resolve: {
                    portfolio: function () {
                        return portfolio;
                    }
                }
            });
        };

    })

    .controller('AddPortfolioCtrl', function ($scope, $rootScope, $routeParams, $location, $kinvey, User) {
        $rootScope.navLocation = 'portfolio';
        $scope.portfolios = [];
        $scope.tags = [];
        $scope.portfolio = {
            title: '',
            overview: '',
            pics: [],
            tags: [],
            username: '',
            dateTime: new Date()
        };

        $scope.tag = {
            name: '',
            color: '',
            textColor: '',
            datetime: new Date()
        };

        var onLoad = function () {
            if ($routeParams.portfolio) {
                var portfolioPromise = $kinvey.DataStore.get('Portfolio', $routeParams.portfolio);
                portfolioPromise.then(function (portfolio) {
                    if (portfolio.username !== $rootScope.user.username) {
                        $location.path('/');
                    }
                    $scope.portfolio = portfolio;
                });
            }

            var promise = $kinvey.DataStore.find('Tags');
            promise.then(function (tags) {
                $scope.tags = tags;
            });
        };

        if (User.loaded) onLoad();
        User.addObserver(onLoad);

        $scope.addNewTag = function (newTag) {
            var savedPromise = $kinvey.DataStore.save('Tags', newTag);
            savedPromise.then(function () {
                $scope.portfolio.tags.push(newTag);
                $scope.tag = {
                    name: '',
                    color: '',
                    datetime: new Date()
                };
                onLoad();
            });
        };

        $scope.addTag = function (tag) {
            $scope.portfolio.tags.push(tag);
        };

        $scope.removeTag = function (index) {
            $scope.portfolio.tags.splice(index, 1);
        };

        function saveImage (pics, index, portfolio, cb) {
            var fileUploadedPromise = $kinvey.File.upload(pics[index]);
            fileUploadedPromise.then(function (res) {
                portfolio.pics.push({
                    _type: 'KinveyFile',
                    _id: res._id
                });
                if (pics.length > index+1) saveImage(pics, index+1, portfolio, cb);
                else cb();
            });
        }

        $scope.removeImage = function (index) {
            $scope.portfolio.pics.splice(index, 1);
        };

        $scope.postFormSubmit = function (portfolio) {

            var pics = document.getElementById('postPics').files;

            function save () {
                portfolio.username = $rootScope.user.username;
                portfolio.datetime = new Date();
                cleanupAngularObject(portfolio);
                var postSavedPromise = $kinvey.DataStore.save('Portfolio', portfolio);

                postSavedPromise.then(function (){
                    $location.path('/portfolio');
                });

            }
            if (pics.length > 0) {
                saveImage(pics, 0, portfolio, function () {
                    save();
                });

            } else {
                save();

            }
        };
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

  /*
   * MANAGE portfolio POST CTRL
   * */
  app.controller('ManagePortfolioCtrl', function ($scope, $rootScope, $kinvey, User, $location) {
      $rootScope.navLocation = 'portfolio';

      $scope.portfolios = [];

      var onLoad = function () {
          var BlogsP = $kinvey.DataStore.find('Portfolio');
          BlogsP.then(function(portfolios){
              $scope.portfolios = portfolios;
          });
      };

      if (User.loaded) onLoad();
      User.addObserver(onLoad);

      $scope.deletePortfolio = function (id, index) {
          var promise = $kinvey.DataStore.destroy('Portfolio', id);
          promise.then(function () {
              $scope.posts.splice(index, 1);
          });
      };

      $scope.editPortfolio = function (id) {
          $location.path('/editPortfolio/'+id);
      };

  });


  var cleanupAngularObject = function(value) {
      if (value instanceof Array) {
          for (var i = 0; i < value.length; i++) {
              cleanupAngularObject(value[i]);
          }
      }
      else if (value instanceof Object) {
          for (property in value) {
              if (/^\$+/.test(property)) {
                  delete value[property];
              }
              else {
                  cleanupAngularObject(value[property]);
              }
          }
      }
  };

  var ModalInstanceCtrl = function ($scope, $modalInstance, portfolio) {
      $scope.portfolio = portfolio;
      $scope.ok = function () {
          $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  };