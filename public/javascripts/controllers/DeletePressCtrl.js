angular.module('KronosDashboard').controller('DeletePressCtrl', DeletePressCtrl);

function DeletePressCtrl(
  $scope,
  PressPhotoService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

    var getPressPhotoToDelete = function(id) {
      PressPhotoService.getPressPhoto(id).then(function(data) {
        console.log('Got the press photo : ');
        console.log(data);
        $scope.pressphoto = data;
      });
    }

    getPressPhotoToDelete(id);

    $scope.confirmDeletePressPhoto = function(id) {
      var id = id;
      var token = store.get('token');

      $('#delete-button').text('');
      $('#delete-button').add('span');
      $('#delete-button').children().addClass('fa fa-lg fa-spin fa-spinner');

      PressPhotoService.deletePressPhoto(id, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $uibModalInstance.close('Success!');
      }, function(data) {
        console.log("Failure!");
        console.log(data);
      })
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }
  }
