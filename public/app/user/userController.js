
var finishedIniting;
app.run(function ($kinvey) {
    finishedIniting = $kinvey.init({
        appKey: 'kid_eVISsVhFfM',
        appSecret: 'e90f003a9a1d499a9895b5e0ffd9dec8'
//        storage: 'local'
    });

});

/*
 * LOGIN CTRL
 * */
app.controller('LoginCtrl', function ($scope, $kinvey, $rootScope) {

    $scope.login = {};
    $scope.passwordCheck = '';
    $scope.loginBox = false;
    $scope.signup = false;

    $rootScope.userError = function (cb) {
        var result = $kinvey.User.login({
            username: 'Anonymous',
            password: 'Anonymous'
        });
        result.then(function (response) {
//                    console.log()
//            $rootScope.user = response;
            $scope.login = {};
            $scope.loginBox = false;
            if (cb) cb(response);
        })
    };

    finishedIniting.then(function () {
        $rootScope.userPromise = $kinvey.User.me();

        $rootScope.userPromise.then($rootScope.userSuccess, function (err) {
            console.log(err.status);
            $rootScope.userError($rootScope.userSuccess)
        });
    });


    $scope.closeLogin = function () {
        $scope.loginBox = false;
        $scope.login = {};

    };

    var pureLogout = function (cb) {
        var logoutR = null;
        if(null !== $rootScope.user) {
            logoutR = $kinvey.User.logout();
            logoutR.then(function() {
                cb()
            });
        } else cb();
    };

    $scope.initiateLogin = function () {

        var result = {};
        if ($scope.signup === false && ($scope.login && $scope.login.username.length > 2 && $scope.login.password.length > 7)) {
            pureLogout(function () {
                result = $kinvey.User.login({
                    username: $scope.login.username,
                    password: $scope.login.password
                });
                result.then(function (response) {
//                    console.log(response);
                    $rootScope.user = response;
                    $scope.login = {};
                    $scope.loginBox = false;
                }, function (err) {
                    console.log(err)
                })
            });

        } else if ($scope.login && $kinvey.User.checkUsernameExists($scope.login.username)) {
            alert('Username already exists');

        } else if ($scope.login && $scope.login.username.length > 2 && $scope.login.password.length > 7 &&
            $scope.login.password === $scope.passwordCheck && $scope.login.email.length > 4) {

            pureLogout(function () {
                result = $kinvey.User.signup({
                    username: $scope.login.username,
                    password: $scope.login.password,
                    email: $scope.login.email,
                    type : 'user'
                });
                result.then(function (response) {
                    $rootScope.user = response;
                    $scope.login = {};
                    $scope.loginBox = false;
                });
            });
        } else {
            alert('Improper credentials');
        }
    };
    $scope.initiateLogout = function () {
        $rootScope.user = $kinvey.getActiveUser();
//        console.log($rootScope.user)
        if(null !== $rootScope.user) {
//            console.log($rootScope.user)
            var result = $kinvey.User.logout();
            result.then(function() {
                $rootScope.user = {};
                $rootScope.userError($rootScope.userSuccess)
            });
        }
    };

});

