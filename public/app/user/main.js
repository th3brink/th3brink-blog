

var requires = [
//    'ngRoute',
//    'ngAnimate',
//    'ngCookies',
//    'ngResource',
//    'ngTouch',
//    'base64',
//    'kinvey',
//    'ui.bootstrap',
//    'ngAnimate',
//    'btford.markdown',
//    'th3blog.directives',
//    'th3blog.services'
];

var user = angular.module('th3User', requires);

user.config(function($routeProvider) {

    $routeProvider

        .when('/addPost', {
            controller: 'AddPostCtrl',
            templateUrl: '/partials/addPost'

        }).when('/post/:post', {
            controller: 'PostCtrl',
            templateUrl: '/partials/postView'

        }).when('/managePosts', {
            controller: 'BlogCtrl',
            templateUrl: '/partials/managePosts'

        });
});