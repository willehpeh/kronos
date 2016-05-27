angular.module('KronosDashboard').controller('DeleteNewsCtrl', DeleteNewsCtrl);

function DeleteNewsCtrl(
  $scope,
  NewsService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance,
  id) {

    var getPostToDelete = function(id) {
      NewsService.getNewsPost(id).then(function(data) {
        console.log('Got the watch: ');
        console.log(data);
        $scope.post = data;
      });
    }

    getPostToDelete(id);

    $scope.confirmDeletePost = function(id) {
      var id = id;
      var token = store.get('token');

      $('#delete-button').text('');
      $('#delete-button').add('span');
      $('#delete-button').children().addClass('fa fa-lg fa-spin fa-spinner');

      NewsService.deleteNewsPost(id, token).then(function(data) {
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
