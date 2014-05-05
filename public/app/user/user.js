/**
 * Created by james on 4/22/2014.
 */

var watchConnectivity = function () {
//    return function () {
//        $(window).on({
//            offline : $kinvey.Sync.offline,
//            online  : $kinvey.Sync.online
//        });
//        console.log('test')
//    }
};


app.factory('User', function ($kinvey, $location) {
    var self =  {
        user: {

        },
        loaded: false

    };
    var observers = [];

    function setUser (user) {
        self.user = user;
        self.notifyObservers();
        self.loaded = true;
        watchConnectivity();
    }

    self.loginAnonymous = function () {
        var result = $kinvey.User.login({
            username: 'Anonymous',
            password: 'Anonymous'
        });
        result.then(function () {
            setUser();
            if ($location.path() === '/user') {
                $location.path('/');
            }
        });
        console.log('Logging in Anonymous');

    };

    self.loginCachedUser = function (user) {
        setUser(user);
        console.log('Logging in cached user: '+user.username);

    };

    self.create = function (newUser) {
        if (!newUser) return;
        console.log('Creating new user...');
        var user = $kinvey.getActiveUser();
        if(null !== user) {
            var logoutPromise = $kinvey.User.logout({force: true});
            logoutPromise.then(function () {
                self.user = {};

                var promise = $kinvey.User.signup({
                    username: newUser.username,
                    password: newUser.password,
                    email: newUser.email,
                    type: 'user'
                });
                console.log('User: '+newUser.username+'  Created!');
                promise.then(setUser, function (err) {
                    alert('Create Error: ' + err.description);
                    self.loginAnonymous();
                });

            });
        } else {
            var promise = $kinvey.User.signup({
                username: newUser.username,
                password: newUser.password,
                email: newUser.email,
                type: 'user'
            });
            promise.then(setUser, function (err) {
                alert('Create Error: ' + err.description);
            });
        }

    };

    self.login = function (userLogin) {

        var user = $kinvey.getActiveUser();
        if(null !== user) {
            var logoutPromise = $kinvey.User.logout({force: true});

            logoutPromise.then(function () {
                self.user = {};
                var promise = $kinvey.User.login(userLogin.username, userLogin.password);
                promise.then(setUser, function (err) {
                    alert('Login Error: '+err.description);
                    self.loginAnonymous();
                });
            })
        } else {
            var promise = $kinvey.User.login(userLogin.username, userLogin.password);
            promise.then(setUser, function (err) {
                alert('Login Error: '+err.description);
            });
        }


    };
    self.logout = function () {
        var user = $kinvey.getActiveUser();
        if(null !== user) {
            var promise = $kinvey.User.logout({force: true});

            promise.then(function () {
                self.user = {};
                self.loginAnonymous()
            })
        }
    };

    self.addObserver = function (observeMe) {
        observers.push(observeMe);
    };

    self.notifyObservers = function () {
        for (var i in observers) {
            if (i !== null) observers[i](self.user);

        }
    };

    return self;
});


app.run(function ($kinvey, User, $location) {
        finishedIniting = $kinvey.init({
            appKey: 'kid_eVISsVhFfM',
            appSecret: 'e90f003a9a1d499a9895b5e0ffd9dec8',
            sync: { enable: true }
        });

    finishedIniting.then(function () {
        var promise = $kinvey.User.me();
        promise.then(function (user) {
            User.loginCachedUser(user);
//            $location.path('/user');

        }, function () {
            User.loginAnonymous();

        });

    });

});


app.controller('LoginCtrl', function ($scope, User, $rootScope) {
    $scope.loginBox = false;
    $scope.passwordCheck = '';
    $scope.userLogin = {
        username: '',
        password: '',
        email: ''
    };

    $scope.closeLogin = function () {
        $scope.loginBox = false;
        $scope.passwordCheck = '';
        $scope.userLogin = {
            username: '',
            password: '',
            email: ''
        };
    };

    $scope.createUser = function (loginCred) {
        if (loginCred.password !== $scope.passwordCheck) {
            alert('Passwords do not match');
        } else if (!loginCred.password || loginCred.password.length < 8) {
            alert('Password needs to be 8 characters or longer');
        } else if (!loginCred.username || loginCred.username.length < 2) {
            alert('Proper Username needs to be entered')
        }  else if (!loginCred.email || loginCred.email.length < 2) {
            alert('Proper Email needs to be entered')
        } else {
            User.create(loginCred);
        }

    };
    $scope.login = User.login;
    $scope.logout = User.logout;

    User.addObserver(function (user) {
        $scope.closeLogin();
//        console.log(user);
        $rootScope.user = user;
    })

});