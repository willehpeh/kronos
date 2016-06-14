angular.module('KronosDashboard').factory('AccueilService', function AccueilService($http, $q) {
  return {
    getAccueil: function() {
      var myData = {};
      var defer = $q.defer();


      $http.get('/api/accueil').then(function(data) {
        myData = data.data;
        defer.resolve(myData);
      }, function(err) {
        myData = err;
        defer.resolve(myData);
      });

      return defer.promise;

    },
    setAccueil: function(images) {
      var myData = {};
      var defer = $q.defer();

      $http.put('/api/accueil/57602c98eb756a7229d17046', {images: images}).then(function(data) {
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
