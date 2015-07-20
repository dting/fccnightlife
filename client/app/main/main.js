'use strict';

angular.module('fccnightlifeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main.location', {
        url: ':location',
        templateUrl: 'app/main/main.location.html',
        controller: 'LocationCtrl'
      });
  });
