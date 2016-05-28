angular.module('KronosDashboard').controller('PressModalCtrl', PressModalCtrl);

function PressModalCtrl(
  $scope,
  PressPhotoService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance) {

    $scope.addNewPressPhoto = function() {
      var pressphoto = $scope.newPressPhoto;
      var token = store.get('token');
      $('#add-button').text('');
      $('#add-button').add('span');
      $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');
      PressPhotoService.newPressPhoto(pressphoto, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newPressPhoto = {};
        $uibModalInstance.close('Success!');

      }, function(data) {
        console.log("Failure!");
        console.log(data);
      });
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }

  }
