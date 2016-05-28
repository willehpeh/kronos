angular.module('KronosDashboard', ['ngRoute', 'ngAnimate', 'angular-storage', 'ui.router', 'ui.bootstrap', 'ngFileUpload'])
  .config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.interceptors.push('errorInterceptor');
  }]);
