angular.module('KronosDashboard').factory('AmbassadorService', function AmbassadorService($http, $q) {

  return {

    newAmbassador: function(ambassador, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/ambassador', {ambassador: ambassador, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getAmbassadors: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/ambassador').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getAmbassador: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/ambassador/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    modifyAmbassador: function(id, ambassador, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/ambassador/' + id, {ambassador:ambassador, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteAmbassador: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/ambassador/' + id, {headers: {'x-access-token' : token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      })

      return defer.promise;
    },

    deleteAmbassadorPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();
      $http.delete('/api/ambassador/rem-image/' + id,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });
      return defer.promise;
    }

  }
});
