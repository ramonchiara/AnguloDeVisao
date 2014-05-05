'use strict';

var anguloDeVisao = angular.module('AnguloDeVisaoApp', []);

anguloDeVisao.controller('AnguloDeVisaoCtrl', ['$scope', function($scope) {
        // 36 x 24 mm
        var h = 36;
        var v = 24;
        var d = Math.sqrt(h * h + v * v);

        var toDeg = 180 / Math.PI;
        var toRad = Math.PI / 180;

        $scope.updateFromF = function() {
            var rad = 2 * Math.atan(d / (2 * $scope.f));
            $scope.alfa = rad * toDeg;
            $scope.alfa = $scope.alfa.toFixed(4);
            $('#alfa').slider({value: $scope.alfa});
            $scope.draw();
        };

        $scope.updateFromAlfa = function() {
            var rad = ($scope.alfa) * toRad;
            $scope.f = d / (2 * Math.tan(rad / 2));
            $scope.f = $scope.f.toFixed(4);
            $('#f').slider({value: $scope.f});
            $scope.draw();
        };

        $scope.draw = function() {
            if (!$('#f').hasClass("ready")) {
                return;
            }

            var w = $scope.c.width;
            var h = $scope.c.height;
            var ctx = $scope.c.getContext('2d');
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, w, h);

            var x = 10;
            var y = h / 2;
            var minF = $('#f').slider('option', 'min');
            var maxF = $('#f').slider('option', 'max');
            var deltaF = maxF - minF;
            var minCF = h / 2 - x;
            var maxCF = w - 2 * x;
            var deltaCF = maxCF - minCF;
            var cf = ($scope.f - minF) * deltaCF / deltaF + minCF;

            var grd = ctx.createLinearGradient(0, 0, w, h);
            grd.addColorStop(0, '#ffc');
            grd.addColorStop(0.5, '#cff');
            grd.addColorStop(1, '#fcc');

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            ctx.fillStyle = grd;

            ctx.beginPath();
            ctx.arc(x, y, cf, 0, $scope.alfa * Math.PI / 180 / 2, false);
            ctx.lineTo(10, h / 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, cf, 0, -$scope.alfa * Math.PI / 180 / 2, true);
            ctx.lineTo(10, h / 2);
            ctx.fill();
            ctx.stroke();
        };

        $scope.f = 50;
        $scope.alfa = 0;

        $scope.c = document.getElementById('canvas');
        $scope.c.width = $scope.c.parentNode.offsetWidth;
        $scope.c.height = $scope.c.parentNode.offsetHeight;

        $scope.updateFromF();

    }]);

anguloDeVisao.directive('fSlider', function() {
    return {
        restrict: 'C',
        scope: {
            f: '=id'
        },
        link: function(scope, element, attrs) {
            element.slider({
                min: 0,
                value: scope.$parent.f,
                max: 2500,
                step: 1,
                slide: function(event, ui) {
                    scope.f = ui.value;
                    scope.$apply();
                },
                create: function(event, ui) {
                    event.target.classList.add('ready');
                }
            });
            scope.$watch('f', function() {
                scope.$parent.updateFromF();
            });
            scope.f = scope.$parent.f;
        }
    };
});

anguloDeVisao.directive('alfaSlider', function() {
    return {
        restrict: 'C',
        scope: {
            alfa: '=id'
        },
        link: function(scope, element, attrs) {
            element.slider({
                min: 0,
                value: scope.$parent.alfa,
                max: 180,
                step: 1,
                slide: function(event, ui) {
                    scope.alfa = ui.value;
                    scope.$apply();
                },
                create: function(event, ui) {
                    event.target.classList.add('ready');
                }
            });
            scope.$watch('alfa', function() {
                scope.$parent.updateFromAlfa();
            });
            scope.alfa = scope.$parent.alfa;
        }
    };
});
