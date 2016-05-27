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
