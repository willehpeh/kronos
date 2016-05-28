angular.module('KronosDashboard').factory('PressPhotoService', function PressPhotoService($http, $q) {

  return {

    newPressPhoto: function(pressphoto, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/pressphoto', {pressphoto: pressphoto, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getPressPhotos: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/pressphoto').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getPressPhoto: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/pressphoto/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    modifyPressPhoto: function(id, pressphoto, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/pressphoto/' + id, {pressphoto: pressphoto, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deletePressPhoto: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/pressphoto/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
});
