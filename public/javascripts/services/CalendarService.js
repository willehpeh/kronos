angular.module('KronosDashboard').factory('CalendarService', function CalendarService($http, $q) {

  return {

    newCalendarElement: function(element, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/calendarelement', {element: element, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getCalendarElements: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/calendarelement').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getCalendarElement: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/calendarelement/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      })

      return defer.promise;
    },

    modifyCalendarElement: function(id, element, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/calendarelement/' + id, {element: element, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteCalendarElement: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/calendarelement/' + id, {headers: {'x-access-token' : token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
});
