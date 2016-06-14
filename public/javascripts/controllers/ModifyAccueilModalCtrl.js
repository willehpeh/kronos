angular.module('KronosDashboard').controller('ModifyAccueilrModalCtrl', ModifyAccueilModalCtrl);

function ModifyAccueilModalCtrl(
  $scope,
  AccueilService,
  $window,
  $uibModal,
  $uibModalInstance,
  id) {

  var getAccueilToModify = function(id) {
    AccueilService.getAccueil().then(function(data) {
      $scope.accueilToModify = data[0];
    });
  }

  $scope.saveChanges = function() {
    var id = id;
    var images = $scope.accueilToModify.images;

    $('#add-button').text('');
    $('#add-button').add('span');
    $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');

    AccueilService.setAccueil(images).then(function(data) {
      $uibModalInstance.close('Success!');
    });
  }

  getAccueilToModify(id);

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }

}
