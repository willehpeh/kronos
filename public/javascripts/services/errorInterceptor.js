angular.module('KronosDashboard').factory('errorInterceptor', function errorInterceptor($q, $rootScope, $window) {
  return {
    response: function(response) {
      console.log('Positive response.')
      response.data.status = response.status;
      return response;
    },
    responseError: function(rejection) {
      console.log('Rejected');
      if(rejection.status === 401) {
        $window.location.href = '/dashboard';
      }
      return $q.reject(rejection);
    }
  };
});
