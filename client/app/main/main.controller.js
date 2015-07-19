'use strict';

angular.module('fccnightlifeApp').controller('MainCtrl', function($scope, $http, socket) {
  $scope.user = {};
  $scope.error = {};
  $scope.places = [];
  $scope.awesomeThings = [];

  $http.get('/api/things').success(function(awesomeThings) {
    $scope.awesomeThings = awesomeThings;
    socket.syncUpdates('thing', $scope.awesomeThings);
  });

  $scope.searchLocation = function() {
    $scope.form.location.$error = {};
    $scope.form.location.$setValidity('', true);
    if (!$scope.user.location) {
      $scope.places.length = 0;
      return;
    }
    $http.get('/api/places/location/' + $scope.user.location.toLowerCase()).success(function(places) {
      $scope.places.length = 0;
      $scope.places = places;
    }).error(function(err) {
      $scope.places.length = 0;
      console.log(err);
      if (err.statusCode === 400) {
        $scope.form.location.$setValidity('location', false);
      }
      console.log(err);
    });
  };
  $scope.addThing = function() {
    if ($scope.newThing === '') {
      return;
    }
    $http.post('/api/things', {name: $scope.newThing});
    $scope.newThing = '';
  };

  $scope.deleteThing = function(thing) {
    $http.delete('/api/things/' + thing._id);
  };

  $scope.$on('$destroy', function() {
    socket.unsyncUpdates('thing');
  });
}).controller('PlaceCtrl', function($scope, $http, socket) {
  $scope.awesomeThings = [];

  $http.get('/api/things').success(function(awesomeThings) {
    $scope.awesomeThings = awesomeThings;
    socket.syncUpdates('thing', $scope.awesomeThings);
  });

  $scope.addThing = function() {
    if ($scope.newThing === '') {
      return;
    }
    $http.post('/api/things', {name: $scope.newThing});
    $scope.newThing = '';
  };

  $scope.deleteThing = function(thing) {
    $http.delete('/api/things/' + thing._id);
  };

  $scope.$on('$destroy', function() {
    socket.unsyncUpdates('thing');
  });
});
