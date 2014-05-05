
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

var blog = angular.module('th3Blog', requires);

blog.config(function($routeProvider) {

    $routeProvider

        .when('/addPost', {
            controller: 'AddPostCtrl',
            templateUrl: '/partials/addPost'

        }).when('/editPost/:post', {
            controller: 'EditPostCtrl',
            templateUrl: '/partials/addPost'

        }).when('/post/:post', {
            controller: 'PostCtrl',
            templateUrl: '/partials/postView'

        }).when('/managePosts', {
            controller: 'ManageCtrl',
            templateUrl: '/partials/managePosts'

        });
});