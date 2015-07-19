'use strict';

angular.module('fccnightlifeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main.place', {
        url: '/:place',
        templateUrl: 'app/main/main.place.html',
        controller: 'PlaceCtrl'
      });
  });
