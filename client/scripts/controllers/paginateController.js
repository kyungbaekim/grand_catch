myAppModule.controller('paginateController', function ($scope){
  $scope.pageChangeHandler = function(num){
    $scope.currTime = new Date();
    console.log("Opening page", num);
    console.log("Previous searched time:", $scope.searchTime);
    console.log("Current time:", $scope.currTime);
    var time_diff = ($scope.currTime - $scope.searchTime)/1000;
    console.log("The time difference:" + time_diff + "seconds")
    

  $scope.scrollTop = function (){
	  console.log('clicked scroll')
	  document.getElementById("scroll").scrollIntoView()
  }
    var timeRefreshInterval = 120;
    if(time_diff > timeRefreshInterval){
     	$scope.searchProduct();
    }
  }
})
