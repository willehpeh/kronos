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
