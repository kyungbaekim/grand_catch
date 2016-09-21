myAppModule.controller('modalController', function ($scope, itemsFactory, $uibModal, $interval){
  $scope.isArray = angular.isArray;
  $scope.itemLoaded = true;

	$scope.ebayDisplay = function(item, size){
    console.log("calling ebayDisplay")
    $scope.itemLoaded = false;
    var modalInstance;
    modalInstance = $uibModal.open({
      templateUrl: 'partials/ebayDisplay.html',
      controller: ebayDisplayModalInstanceCtrl,
      size: size,
			scope: $scope,
      resolve: {
        item: function(){
					return item;
        }
      }
    });
	};

	var ebayDisplayModalInstanceCtrl = function ($uibModalInstance, $scope, item, $interval) {
		console.log(item)
		itemsFactory.getEbaySingleItem(item.id, function(response){
			$scope.itemDetail = response.Item;
			console.log($scope.itemDetail)
			$scope.itemLoaded = true;
			$scope.timeTill = ''

			$scope.$on("$destroy",function(){
		    if (angular.isDefined($scope.Timer)) {
		      $interval.cancel($scope.Timer);
		    }
			});

      //Initialize the Timer to run every 1000 milliseconds i.e. one second.
      $scope.Timer = $interval(function () {
				$scope.timeTill = ''
        //Display the time until the expiration
				var a = new Date();
				var b = new Date($scope.itemDetail.EndTime)
				var diffMs = (b - a); // milliseconds between now & end
				var diffDays = Math.round(diffMs / 86400000); // days
				var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
				var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
				if(diffMs > 0){
					if(diffDays > 0){
						$scope.timeTill += diffDays + "days ";
					}
					if(diffHrs > 0){
						$scope.timeTill += diffHrs + "hours ";
					}
					if(diffMins > 0){
						$scope.timeTill += diffMins + "minutes";
					}
					if(diffMs < 60000){
						$scope.timeTill += "Less than a minute";
					}
				}
				else{
					$scope.timeTill += "Item expired";
				}
				console.log($scope.timeTill)
      }, 1000);
		});

		$scope.ok = function() {
			$interval.cancel($scope.Timer);
	    $uibModalInstance.close('close');
	  };
	};

	$scope.amazonDisplay = function(item, size){
		// $scope.item = item
		$scope.itemLoaded = false;
    var modalInstance;
    modalInstance = $uibModal.open({
      templateUrl: 'partials/amazonDisplay.html',
      controller: amazonDisplayModalInstanceCtrl,
      size: size,
			scope: $scope,
      resolve: {
        item: function(){
					return item;
        }
      }
    });
	};

	var amazonDisplayModalInstanceCtrl = function ($uibModalInstance, $scope, item) {
    $scope.itemDetail = item
    console.log(item, $scope.itemDetail)
    $scope.itemLoaded = true;
		// itemsFactory.itemLookUp(item.id, function(data){
		// 	console.log('itemLookUp data', data)
		// 	$scope.itemDetail = data.result.Items.Item;
		// 	console.log($scope.itemDetail)
		// 	$scope.itemLoaded = true;
		// })

		$scope.ok = function() {
	    $uibModalInstance.close('close');
	  };
	};
})
