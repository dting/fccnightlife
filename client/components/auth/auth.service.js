'use strict';

angular.module('fccnightlifeApp').factory('Auth',
  function Auth($location, $rootScope, $http, User, $cookieStore, $q, $mdDialog) {
    var currentUser = {};
    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {
      loginPopup : function(ev) {
        $mdDialog.show({
          controller: function($scope, $mdDialog, $window) {
            $scope.loginOauth = function(provider) {
              $window.location.href = '/auth/' + provider;
            };

            $scope.cancel = function() {
              $mdDialog.hide();
            };
          },
          templateUrl: 'app/account/login/login.html',
          parent: angular.element(document.body),
          targetEvent: ev
        }).then(function() {}, function() {});
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
  });
