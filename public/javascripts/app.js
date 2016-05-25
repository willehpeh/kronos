angular.module('KronosDashboard', ['ngRoute', 'ngAnimate', 'angular-storage'])
  .config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
