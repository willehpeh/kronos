angular.module('KronosDashboard', ['ngRoute', 'ngAnimate', 'angular-storage', 'ui.router', 'ui.bootstrap'])
  .config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
