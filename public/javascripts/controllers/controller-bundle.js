(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('KronosDashboard').controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl(
  $scope,
  AuthService,
  WatchService,
  NewsService,
  PressPhotoService,
  CalendarService,
  AmbassadorService,
  store,
  $window,
  $timeout,
  $uibModal) {

  $scope.login = function() {
    var user = {username: $scope.username, password: $scope.password};
    AuthService.login(user).then(function(data) {
      console.log(data);
      store.set('token', data.token);
      $window.location.href = '/dashboard?token=' + store.get('token');
    }, function(data) {
      console.log(data);
    });
  }

  $scope.deleteWatch = function(id) {
    var token = store.get('token');
    $('#'+id).css({
      'color': '#AAA'
    });
    WatchService.deleteWatch(id, token).then(function(data) {
      console.log('Watch deleted.');
      console.log(data);
      getWatches();
    })
  }

  var getWatches = function() {
    WatchService.getWatches().then(function(data) {
      console.log("getWatches Success!");
      $scope.watchArray = data;
    });
  }

  var getAllNews = function() {
    NewsService.getNewsPosts().then(function(data) {
      console.log("getNews Success!");
      $scope.newsArray = data;
    }, function(data) {
      console.log("getNews went wrong!");
      console.log(data);
    });
  }

  var getAllPressPhotos = function() {
    PressPhotoService.getPressPhotos().then(function(data) {
      console.log("getPressPhotos Success!");
      $scope.pressPhotoArray = data;
    }, function(data) {
      console.log("getPressPhotos went wrong!");
      console.log(data);
    });
  }

  var getAllCalendarElements = function() {
    CalendarService.getCalendarElements().then(function(data) {
      console.log("getAllCalendarElements Success!");
      $scope.calendarElementArray = data;
    }, function(data) {
      console.log("getAllCalendarElements went wrong!");
      console.log(data);
    });
  }

  var getAllAmbassadors = function() {
    AmbassadorService.getAmbassadors().then(function(data) {
      console.log("getAllAmbassadors Success!");
      $scope.ambassadortArray = data;
    }, function(data) {
      console.log("getAllAmbassadors went wrong!");
      console.log(data);
    });
  }

  $scope.openWatchModal = function() {

    $uibModal.open({
      animation: true,
      templateUrl: 'partials/_watch-modal.html',
      controller: WatchModalCtrl
    }).result.then(function() {
      getWatches();
    });
  }

  $scope.modifyWatchModal = function(id) {

    $uibModal.open({
      animation: true,
      templateUrl: 'partials/_modify-watch-modal.html',
      controller: ModifyWatchModalCtrl,
      resolve: {
        id: function() {
          return id;
        }
      }
    }).result.then(function() {
      getWatches();
    });
  }

  getWatches();
  getAllNews();
  getAllPressPhotos();
  getAllCalendarElements();
  getAllAmbassadors();
}

},{}],2:[function(require,module,exports){
angular.module('KronosDashboard').controller('ModifyWatchModalCtrl', ModifyWatchModalCtrl);

function ModifyWatchModalCtrl(
  $scope,
  WatchService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

  var getWatchToModify = function(id) {
    WatchService.getWatch(id).then(function(data) {
      console.log('Got the watch: ');
      console.log(data);
      $scope.watchToModify = data;
    });
  }

  getWatchToModify(id);

  $scope.saveChanges = function(id) {
    var id = id;
    var watch = $scope.watchToModify;
    var token = store.get('token');

    $('#add-button').text('');
    $('#add-button').add('span');
    $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');

    WatchService.modifyWatch(id, watch, token).then(function(data) {
      console.log("Success!");
      console.log(data);
      $scope.newWatch = {};
      $uibModalInstance.close('Success!');
    });
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}

},{}],3:[function(require,module,exports){
angular.module('KronosDashboard').controller('WatchModalCtrl', WatchModalCtrl);

function WatchModalCtrl(
  $scope,
  WatchService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance) {

    $scope.addNewWatch = function() {
      var watch = $scope.newWatch;
      var token = store.get('token');
      store.set('watchTemp', watch);
      $('#add-button').text('');
      $('#add-button').add('span');
      $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');
      WatchService.newWatch(watch, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newWatch = {};
        $uibModalInstance.close('Success!');

      }, function(data) {
        console.log("Failure!");
        console.log(data);
        $scope.newWatch = store.get('watchTemp');
      });
    }

    $scope.ok = function() {
      $uibModalInstance.close('close');
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
  }

},{}],4:[function(require,module,exports){
var dashboard = require('./DashboardCtrl');
var modifyWatchModal = require('./ModifyWatchModalCtrl');
var watchModal = require('./WatchModalCtrl');

},{"./DashboardCtrl":1,"./ModifyWatchModalCtrl":2,"./WatchModalCtrl":3}]},{},[4]);
