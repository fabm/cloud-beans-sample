var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="gapis.ts" />
var CloudBeanSample = (function (_super) {
    __extends(CloudBeanSample, _super);
    function CloudBeanSample(apiMapDepot) {
        _super.call(this, apiMapDepot);
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        _super.prototype.setClientID.call(this, '86843638616-6j1kqn7nfoact4unjqguuktpo9ue0m5e.apps.googleusercontent.com');
        _super.prototype.setScope.call(this, ['https://www.googleapis.com/auth/userinfo.email']);
    }
    return CloudBeanSample;
})(ClientLoader);

var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService(apiMapDepot) {
        _super.call(this, apiMapDepot);
        this.client = 'user';
    }
    UserService.loadAllRoles = function () {
        function create(alias, name) {
            return {
                name: name,
                alias: alias,
                role: false
            };
        }

        var all = [];
        all.push(create('moderator', 'MODERATOR'));
        all.push(create('administrator', 'ADMINISTRATOR'));
        all.push(create('user', 'USER'));
        return all;
    };

    UserService.prototype.getRoles = function (user) {
        var _this = this;
        var self = this;

        var onSuccess;

        var iResolver = {
            success: function (response) {
                if (response.code != 1) {
                    onSuccess(response);
                    return;
                }
                var allRoles = UserService.loadAllRoles();
                allRoles.forEach(function (value, index, arr) {
                    value.role = response.sampleRoles.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(response);
            },
            error: null,
            unauthorized: null
        };

        return {
            execute: function (resolver) {
                iResolver.error = resolver.error;
                iResolver.unauthorized = resolver.unauthorized;
                onSuccess = resolver.success;
                _super.prototype.loadApi.call(_this, function () {
                    var method = self.api['get']['roles'];
                    method.args = { email: user.email };
                    method.execute(iResolver);
                });
            }
        };
    };

    UserService.prototype.updateRoles = function (user) {
        var self = this;

        return {
            execute: function (resolver) {
                var rolesSelected = [];
                user.roles.forEach(function (value, index, arr) {
                    if (value.role)
                        rolesSelected.push(value.name);
                });
                var updateRoles = self.api['update']['roles'];
                updateRoles.args = { 'email': user.email, 'roles': rolesSelected };
                updateRoles.execute(resolver);
            }
        };
    };

    UserService.prototype.list = function () {
        return this.api['getAllUsers'];
    };
    return UserService;
})(CloudBeanSample);
//# sourceMappingURL=gapiCBS.js.map
