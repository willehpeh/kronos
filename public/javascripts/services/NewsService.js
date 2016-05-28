angular.module('KronosDashboard').factory('NewsService', function NewsService($http, $q) {

  return {

    newNewsPost: function(post, token) {
      var response = {};
      var defer = $q.defer();

      $http.post('/api/newspost', {newspost: post, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      }, function(data) {
        response = data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getNewsPosts: function() {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/newspost').then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    getNewsPost: function(id) {
      var response = {};
      var defer = $q.defer();

      $http.get('/api/newspost/' + id).then(function(data) {
        response = data.data;
        defer.resolve(response);
      })

      return defer.promise;
    },

    modifyNewsPost: function(id, post, token) {
      var response = {};
      var defer = $q.defer();

      $http.put('/api/newspost/' + id, {newspost: post, token: token}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteNewsPost: function(id, token) {
      var response = {};
      var defer = $q.defer();

      $http.delete('/api/newspost/' + id, {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    },

    deleteNewsPhoto: function(id, photo, token) {
      var response = {};
      var defer = $q.defer();

      var photo = photo.slice(18);

      console.log("ID is: " + id);

      $http.delete('/api/newspost/rem-image/'+ id + '/' + photo,
      {headers: {'x-access-token': token}}).then(function(data) {
        response = data.data;
        defer.resolve(response);
      });

      return defer.promise;
    }
  }
});
