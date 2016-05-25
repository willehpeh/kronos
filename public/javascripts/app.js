angular.module('KronosDashboard', ['ngRoute', 'ngAnimate', 'angular-storage', 'ui.router'])
  .config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});
