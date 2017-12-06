
var app = angular.module('wooshop.controllers', ['wooshop.services'])

app.controller('AppCtrl', function($scope, $ionicLoading, $ionicModal, $timeout, $state, md5) {
    $scope.show = function() {
		$ionicLoading.show({
			template: '<ion-spinner class="base-spinner" icon="android"></ion-spinner>'
		});
	};
	var myEl = angular.element( document.querySelector( '#mailside' ) );
	console.log(myEl.innerHTML);
	//alert($scope.id);
	$scope.$watch('mailside' ,function() {
		
        $scope.message = 'Your email Hash is: ' + md5.createHash($scope.mailside || '');
      });
	$scope.hide = function(){
		$ionicLoading.hide();
	};
})

app.controller('CategoriesCtrl', function($rootScope, $scope, wooshopService) {
    $scope.show();
    wooshopService.getCategories().then(function(data) {
        //console.log(data);
        $scope.populateList= function() {
			$scope.cats = data;
		}
		 $scope.populateList();
         $scope.hide();
    })
})

app.controller('ProductsCtrl', function($rootScope, $scope, wooshopService) {
    $scope.show();
    wooshopService.getItems().then(function(data) {
        $scope.productsList= function() {
			$scope.products = data;
		}
		 $scope.productsList();
        $scope.hide();
    })

})
app.filter('ampersand', function(){
    return function(input){
        return input ? input.replace(/&amp;/, '&') : '';
    }
});
app.controller('ProductCtrl', function($rootScope, $scope, $stateParams, wooshopService, ngCart) {
    $scope.show();
    wooshopService.getItem($stateParams.productId).then(function (data){
        $scope.product =data;
         //console.log($scope.product);
        $scope.hide();
    })
});

app.controller('CategoryCtrl', function($scope, $stateParams, wooshopService, $stateParams) {
    $scope.show();
    wooshopService.getCatItems($stateParams.getCatSlug).then(function(data){
        $scope.productsList= function() {
            $scope.products = data;
            //console.log($scope.products);
        }
        $scope.productsList();
        $scope.hide();
    })
})

app.controller ('CartCtrl', function($rootScope, $scope, $stateParams, wooshopService, ngCart, SETTINGS) {

//$log.debug();
    wooshopService.getIndex().then(function(data){
        var currency = data.currency_format;
        var shipping_charge =  SETTINGS.shipping_charge;
        var tax_rate =  SETTINGS.tax_rate;
        //alert(SETTINGS.tax_rate);
		$scope.settings = {"paypal": {"business": "sameer_bizus@webzin.in", item_name: "Order", item_number: "item_number", currency_code: "USD"}}     
        ngCart.setTaxRate(tax_rate);
        ngCart.setShipping(shipping_charge); 
        ngCart.setCurrency(currency);
		$scope.pay = function(){
			//alert(ngCart.getSubTotal());
			//alert('inside pay');
			var value1 = "_xclick";
			var value2 = $scope.settings.paypal.business;
			var value3 = "en_US";
			var value4 = $scope.settings.paypal.item_name;
			var value5 = $scope.settings.paypal.item_number;
			//alert('sam');
			var formAttributes = '<html><head></head><body><form id="openpaypal" action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post">' +
			'<input type="hidden" name="cmd" value="' + value1 + '">' +
			'<input type="hidden" name="business" value="' + value2 + '">' +
			'<input type="hidden" name="lc" value="' + value3 + '">' +
			'<input type="hidden" name="item_name" value="' + value4 + '">' +
			'<input type="hidden" name="item_number" value="' + value5 + '">' +
			'<input type="hidden" name="amount" value="' + ngCart.getSubTotal() + '">' +
			'<input type="hidden" name="currency_code" value="USD">' +
			'<input type="hidden" name="button_subtype" value="services">' +
			'<input type="hidden" name="no_note" value="0">' +
			'<input type="hidden" name="tax_rate" value="'+ngCart.getTaxRate()+'">' +
			'<input type="hidden" name="shipping" value="'+ngCart.getShipping()+'">' +
			'<input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHostedGuest">' +
			'</form> <script type="text/javascript">document.getElementById("openpaypal").submit();</script></body></html>';
			var formUrl = 'data:text/html;base64,' + btoa(formAttributes);
			
			var browserOpen = window.cordova.InAppBrowser.open(
				formUrl ,
				"_blank",
				"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
			);
			};
		
    });
	app.controller ('CheckoutCtrl', function($rootScope, $scope, $stateParams, wooshopService, ngCart, SETTINGS) {
		alert('das');
		$scope.Pay = function(){
			var value1 = "_s-xclick";
			var value2 = "sameer_bizus@webzin.in";
			
			alert('sam');
			var formAttributes = '<html><head></head><body><form id="openpaypal" action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post">' +
			'<input type="hidden" name="cmd" value="' + value1 + '">' +
			'<input type="hidden" name="hosted_button_id" value="' + value2 + '">' +
			'</form> <script type="text/javascript">document.getElementById("openpaypal").submit();</script></body></html>';
			var formUrl = 'data:text/html;base64,' + btoa(formAttributes);
			
			var browserOpen = window.cordova.InAppBrowser.open(
				formUrl ,
				"_blank",
				"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
			);
			};
		console.log($scope.Pay);
	})
});

 
  


