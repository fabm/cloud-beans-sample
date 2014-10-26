/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="gapiCBS.ts" />
/// <reference path="api.ts" />
function getInjector() {
    return angular.element(document.body).injector();
}

var apiMapDepot = new ApiMapDepot(null);
angular.module('api.depot', []).factory('apiMapDepot', function ($http) {
    if (!apiMapDepot.allLoaded()) {
        $http({ method: 'GET', url: '/errors.json' }).success(function (data, status, headers, config) {
            apiMapDepot.setErros(data);
        }).error(function (data, status, headers, config) {
            console.log(data);
        });

        $http({ method: 'GET', url: '/js/gen/validationMap.json' }).success(function (data, status, headers, config) {
            apiMapDepot.setValidations(data);
        }).error(function (data, status, headers, config) {
            console.log(data);
        });

        $http({ method: 'GET', url: '/js/langMap.json' }).success(function (data, status, headers, config) {
            apiMapDepot.setFields(data);
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
    }
    return apiMapDepot;
});

var app = angular.module('cbs', ['ui.router', 'ui.growl', 'api.depot']);

app.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var modelName = attrs.fileModel;
            var model = $parse(modelName);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    if (scope.fileModelSetter)
                        var callback = scope.fileModelSetter[modelName];
                    if (callback && typeof (callback) === 'function')
                        callback(element[0].files[0]);
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

app.service('fileUpload', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function () {
        }).error(function () {
        });
    };
});

app.controller('myCtrlUpload', [
    '$scope', 'fileUpload', function ($scope, fileUpload) {
        $scope.uploadFile = function () {
            var file = $scope.myFile;
            console.log('file is ' + JSON.stringify(file));
            var uploadUrl = "/fileUpload";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };
    }]);

var AppEngineUpload = (function () {
    function AppEngineUpload() {
        this.urlToGetSessionUrl = '/upload';
    }
    AppEngineUpload.prototype.processUrlSession = function () {
        var self = this;
        var ajax = new XMLHttpRequest();
        ajax.open("GET", this.urlToGetSessionUrl, false);

        ajax.onload = function () {
            var response = eval('(' + ajax.responseText + ')');
            if (!response.error)
                self.urlSession = response.url;
        };
        ajax.send();
    };
    return AppEngineUpload;
})();

var GrowlBH = (function () {
    function GrowlBH($growl) {
        this.type = 0;
        this.msg = null;
        this.$growl = $growl;
    }
    GrowlBH.prototype.setMessage = function (message, type) {
        this.msg = message;
        this.type = type;
    };

    GrowlBH.prototype.isMsgShowed = function () {
        return this.msg == null;
    };

    GrowlBH.prototype.showGrowl = function () {
        var self = this;
        if (isNull(this.msg))
            return;
        var strType;
        var title;
        if (this.type == 0) {
            strType = 'success';
            title = 'Informação';
        } else if (this.type == 1) {
            strType = 'danger';
            title = 'Erro';
        }
        self.$growl.box(title, this.msg, {
            class: strType, sticky: false, timeout: 3000
        }).open();
        this.msg = null;
    };
    GrowlBH.typeMessage = {
        success: 0, error: 1
    };
    return GrowlBH;
})();

app.factory('gns', function ($state, $growl) {
    return {
        growl: new GrowlBH($growl),
        state: {
            goto: function (state) {
                $state.go(state, null, { reload: true });
            }
        }
    };
});

app.service('fUploadAppEngine', function ($http) {
    var self = this;
    self.form = new FormData();
    self.url;

    self.success = Log.cbr;
    self.error = Log.cbr;

    this.up = function (file) {
        self.form.append('file', file);
        var token = gapi.auth.getToken();
        var headers = { 'Content-Type': undefined };

        if (!isNull(token)) {
            headers['Authorization'] = token.access_token;
        }

        $http.post(self.url, self.form, {
            transformRequest: angular.identity,
            headers: headers
        }).success(function (data) {
            self.success(data.imagekey);
        }).error(self.error);
    };
});

app.factory('userService', function (apiMapDepot) {
    return new UserService(apiMapDepot);
});
//# sourceMappingURL=services.js.map
