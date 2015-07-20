'use strict';

angular.module('fccnightlifeApp').factory('Auth',
  ['$location', '$rootScope', '$http', 'User', '$cookieStore', '$q', '$mdDialog', '$stateParams', function($location, $rootScope, $http,
    User, $cookieStore, $q, $mdDialog, $stateParams) {
    var currentUser = {};
    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {
      loginPopup: function(ev) {
        if ($stateParams.location) {
          $cookieStore.put('location', $stateParams.location);
        }
        $mdDialog.show({
          controller: ['$scope', '$mdDialog', '$window', function($scope, $mdDialog, $window) {
            $scope.loginOauth = function(provider) {
              $window.location.href = '/auth/' + provider;
            };

            $scope.cancel = function() {
              $cookieStore.remove('location');
              $mdDialog.hide();
            };
          }], templateUrl: 'app/account/login/login.html', parent: angular.element(document.body), targetEvent: ev
        }).then(function() {
          console.log('LoggedIn.');
        });
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if (currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  }]);
