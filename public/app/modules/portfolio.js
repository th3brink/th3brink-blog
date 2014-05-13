
var portfolio = angular.module('th3Portfolio', requires);

blog.config(function ($routeProvider) {

    $routeProvider

    .when('/portfolio', {
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
    });

});

portfolio.controller('PortfolioCtrl', function ($scope, $rootScope, $modal, $kinvey, User) {
    $rootScope.navLocation = 'portfolio';
    $scope.portfolios = [];
    $scope.portfoliosLoaded = false;

    var onLoad = function () {
        var promise = $kinvey.DataStore.find('Portfolio');
        promise.then(function(portfolios){
            $scope.portfolios = portfolios;
            $scope.portfoliosLoaded = true;
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

});

portfolio.controller('AddPortfolioCtrl', function ($scope, $rootScope, $routeParams, $location, $kinvey, User, Tools) {
    $rootScope.navLocation = 'portfolio';
    $scope.portfolios = [];
    $scope.tags = [];
    $scope.portfolio = {
        title: '',
        overview: '',
        pics: [],
        tags: [],
        username: '',
        link: '',
        orderBy: 0,
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
            Tools.cleanupAngularObject(portfolio);
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
});


/*
 * MANAGE portfolio POST CTRL
 * */
portfolio.controller('ManagePortfolioCtrl', function ($scope, $rootScope, $kinvey, User, $location) {
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

var ModalInstanceCtrl = function ($scope, $modalInstance, portfolio) {
    $scope.portfolio = portfolio;
    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};