angular.module('KronosDashboard').controller('NewsModalCtrl', NewsModalCtrl);

function NewsModalCtrl(
  $scope,
  NewsService,
  store,
  $window,
  $timeout,
  $uibModal,
  $uibModalInstance) {

    $scope.addNewPost = function() {
      var post = $scope.newPost;
      var token = store.get('token');
      $('#add-button').text('');
      $('#add-button').add('span');
      $('#add-button').children().addClass('fa fa-lg fa-spin fa-spinner');
      NewsService.newNewsPost(post, token).then(function(data) {
        console.log("Success!");
        console.log(data);
        $scope.newPost = {};
        $uibModalInstance.close('Success!');

      }, function(data) {
        console.log("Failure!");
        console.log(data);
        $scope.newWatch = store.get('watchTemp');
      });
    }

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }

  }
