'use strict';

angular.module('fccnightlifeApp').controller('MainCtrl', function($scope, $http, socket, Auth) {
  $scope.user = {};
  $scope.places = [];

  $scope.searchLocation = function() {
    $scope.form.location.$error = {};
    $scope.form.location.$setValidity('', true);
    if (!$scope.user.location) {
      $scope.places.length = 0;
      socket.unsyncUpdates('places');
      return;
    }
    $http.get('/api/places/location/' + $scope.user.location.toLowerCase()).success(function(places) {
      $scope.places.length = 0;
      $scope.places = places;
      socket.syncUpdates('places', $scope.places);
    }).error(function(err) {
      $scope.places.length = 0;
      socket.unsyncUpdates('places');
      if (err.statusCode === 400) {
        $scope.form.location.$setValidity('location', false);
      }
    });
  };

  $scope.addThing = function() {
    if ($scope.newThing === '') {
      return;
    }
    $http.post('/api/things', {name: $scope.newThing});
    $scope.newThing = '';
  };

  $scope.addMe = function(place) {
    if (!Auth.isLoggedIn()) {
      Auth.loginPopup();
    } else {
      $http.put('/api/places/' + place._id, place).then(function(res) {
        _.assign(place, res.data);
      });
    }
  };

  $scope.removeMe = function(place) {
    if (!Auth.isLoggedIn()) {
      Auth.loginPopup();
    } else {
      $http.patch('/api/places/' + place._id, place).then(function(res) {
        _.assign(place, res.data);
      });
    }
  };

  $scope.going = function(place) {
    return _.indexOf(place.going, Auth.getCurrentUser()._id) > -1;
  };

  $scope.deleteThing = function(thing) {
    $http.delete('/api/things/' + thing._id);
  };

  $scope.$on('$destroy', function() {
    socket.unsyncUpdates('places');
  });
});
