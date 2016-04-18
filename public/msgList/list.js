/**
 * Created by kojunghyun on 14. 12. 31..
 */
'use strict';

var myControllerModule = angular.module('listModule', ['ngRoute','myServiceModule']);

//-----------------------------------------------------------------------------
//controller : get paged data
myControllerModule.controller('listCtrl',
    ['$rootScope','$scope','$location','myHttpService','myGlobalDataService',
        function($rootScope,$scope, $location, myHttpService,myGlobalDataService) {
            
            myGlobalDataService.pageInfo.listPerPage = 5;

            $scope.listPerPage = myGlobalDataService.pageInfo.listPerPage ; //TEST

            //console.log("listCtrl init!!");//debug
            //--------------------------------------------------------------------
            //공통사용되는 함수를 $rootScope 에 정의...
            $rootScope.GoToPage = function () {
                $location.path( '/list' );
            };

            $rootScope.GoToUrl = function (url) {
                $location.path(url);
            };

            console.log("1");
            $scope.listIndexAry=myGlobalDataService.pageInfo.listIndexAry;
            console.log("2");
            //console.log( "listCtrl  :myHttpService.getPagedList!!" ); //debug
            myHttpService.getPagedList(myGlobalDataService.pageInfo.currentPage, myGlobalDataService.pageInfo.listPerPage);
            console.log("3");
            $scope.guestMsgs = myGlobalDataService.msgDatas;
            console.log("4");
            //$scope.testStr = "listCtrl!!!"; //test
        }]);
