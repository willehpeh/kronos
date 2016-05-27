angular.module('KronosDashboard').controller('ModifyNewsModalCtrl', ModifyNewsModalCtrl);

function ModifyNewsModalCtrl(
  $scope,
  NewsService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

  var getPostToModify = function(id) {
    NewsService.getNewsPost(id).then(function(data) {
      console.log('Got the watch: ');
      console.log(data);
      $scope.postToModify = data;
    });
  }

  getPostToModify(id);

  $scope.saveChanges = function(id) {
    var id = id;
    var post = $scope.postToModify;
    var token = store.get('token');

    $('#add-button').text('');
    $('#add-button').add('span');
    $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');

    NewsService.modifyNewsPost(id, post, token).then(function(data) {
      console.log("Success!");
      console.log(data);
      $scope.newPost = {};
      $uibModalInstance.close('Success!');
    });
  }

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  }
}
