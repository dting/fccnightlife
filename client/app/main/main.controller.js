'use strict';

angular.module('fccnightlifeApp').controller('MainCtrl',
  ['$scope', '$http', 'socket', 'Auth', '$state', '$cookieStore', function($scope, $http, socket, Auth, $state,
    $cookieStore) {
    $scope.user = {};

    $scope.searchLocation = function() {
      $scope.form.location.$error = {};
      $scope.form.location.$setValidity('', true);
      $state.go('main.location', {location: $scope.user.location.toLowerCase()});
    };

    if ($cookieStore.get('location')) {
      $scope.user.location = $cookieStore.get('location');
      $cookieStore.remove('location');
      $state.go('main.location', {location: $scope.user.location.toLowerCase()});
    }
  }]).controller('LocationCtrl',
  ['$scope', '$http', 'socket', 'Auth', '$stateParams', function($scope, $http, socket, Auth, $stateParams) {
    $scope.places = [];
    if ($scope.user.location !== $stateParams.location) {
      $scope.user.location = $stateParams.location;
    }

    $http.get('/api/places/location/' + $stateParams.location).success(function(places) {
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

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('places');
    });
  }]);
