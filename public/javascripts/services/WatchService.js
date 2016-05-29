angular.module('KronosDashboard').factory('WatchService', function WatchService($http, $q, $window) {
  return {

    newWatch: function(watch, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/watch', {watch: watch, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        response = data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    getWatch: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/watch/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    modifyWatch: function(id, watch, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/watch/' + id, {watch: watch, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        response = data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteWatch: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/watch/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        console.log('Uh-oh, it broke...')
        response = data;
        defer.reject(response);
      });
      return defer.promise;
    },

    getWatches: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/watch').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteFrontPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();
      $http.delete('/api/watch/rem-front-image/' + id,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteBackPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();
      $http.delete('/api/watch/rem-back-image/' + id,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteQuarterPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();
      $http.delete('/api/watch/rem-quarter-image/' + id,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    },

    deleteExtraPhoto: function(id, photo, token) {
      var response = {};
      var defer = $q.defer();
      var photo = photo.slice(16);
      $http.delete('/api/watch/rem-extra-image/' + id + '/' + photo,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    }
  }
})
