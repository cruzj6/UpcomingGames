!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports){var app=angular.module("welcomePage",[]);app.config(function($interpolateProvider){$interpolateProvider.startSymbol("{[{"),$interpolateProvider.endSymbol("}]}")}),app.controller("welcomePageCntrl",function($scope,$http){})}]);