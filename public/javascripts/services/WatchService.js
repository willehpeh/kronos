angular.module('KronosDashboard').factory('WatchService', function WatchService($http, $q) {
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
      });
      return defer.promise;
    },

    deleteWatch: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/watch/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
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
      return defer.promise
    }
  }
})
