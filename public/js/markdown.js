/*
 * angular-markdown-directive v0.1.0
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.markdown', []).
    directive('btfMarkdown', function () {
        var converter = new Showdown.converter();
        var link = function(scope, element, attrs, model) {
            var render = function(){
                var htmlText = converter.makeHtml(model.$modelValue);
                element.html(htmlText);
            };
            scope.$watch(attrs['ngModel'], render);
        //            render();
        };
        return {
            restrict: 'E',
            require: 'ngModel',
            link: link
        }
    });
