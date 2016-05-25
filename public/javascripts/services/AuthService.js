angular.module('KronosDashboard').factory('AuthService', function AuthService($http, $q) {
  return {
    login: function(user) {
      var myData = {};
      var defer = $q.defer();


      $http.post('/auth/login', user).then(function(data) {
        myData = data.data;
        defer.resolve(myData);
      }, function(err) {
        myData = err;
        defer.resolve(myData);
      });

      return defer.promise;

    }
  }
})
