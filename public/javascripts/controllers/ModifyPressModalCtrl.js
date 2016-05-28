angular.module('KronosDashboard').controller('ModifyPressModalCtrl', ModifyPressModalCtrl);

function ModifyPressModalCtrl(
  $scope,
  PressPhotoService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

  var getPressPhotoToModify = function(id) {
    PressPhotoService.getPressPhoto(id).then(function(data) {
      console.log('Got the watch: ');
      console.log(data);
      $scope.pressphotoToModify = data;
    });
  }

  getPressPhotoToModify(id);

  $scope.saveChanges = function(id) {
    var id = id;
    var pressphoto = $scope.pressphotoToModify;
    var token = store.get('token');

    $('#add-button').text('');
    $('#add-button').add('span');
    $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');

    PressPhotoService.modifyPressPhoto(id, pressphoto, token).then(function(data) {
      console.log("Success!");
      console.log(data);
      $uibModalInstance.close('Success!');
    });
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}
