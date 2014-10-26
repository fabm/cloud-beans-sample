/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />

var RouteState = {
    userList: 'users-allUsers',
    usersEdit: 'users-edit',
    home: 'default'
};

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state(RouteState.userList, {
        url: "/users",
        templateUrl: "views/usersmng/userslst.html",
        controller: Users.ListUsersCtrl
    }).state(RouteState.usersEdit, {
        url: "/users/edit/:email",
        templateUrl: "views/usersmng/usersup.html",
        controller: Users.UpdateUsersCtrl
    }).state(RouteState.home, {
        url: "/",
        templateUrl: "views/default.html",
        controller: DefaultCtrl
    });
});

app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '=',
            data: '='
        },
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function () {
                scope.show = false;
            };
        },
        templateUrl: 'views/modal.html'
    };
});

var templates = {
    ok: "views/common/ok.html",
    returnT: "views/common/return.html",
    error: "views/common/error.html",
    loading: "views/common/loading.html"
};

function passVars(map1, map2) {
    for (var k in map1) {
        map2[k] = map1[k];
    }
}

function loading(view) {
    view.template.url = templates.loading;
    view.template.message = localeMessage('loadingData', 'loading data ...');
}

var Users;
(function (Users) {
    function ListUsersCtrl($scope, gns, userService) {
        function getView() {
            return {
                users: {
                    show: false,
                    list: null
                },
                template: {
                    url: null,
                    message: null
                }
            };
        }

        var view = getView();

        loading(view);

        passVars(view, $scope);

        function list(response) {
            view = getView();
            if (typeof (response.code) === 'undefined') {
                view.template.message = "Unexpected message return";
            }

            if (response.code == 1) {
                view.template.url = templates.returnT;
                view.users.list = response['list'];
                view.users.show = true;
            } else {
                view.template.url = templates.error;
                view.template.message = response.message;
            }
            passVars(view, $scope);
            $scope.$digest();
        }

        $scope.back = function () {
            gns.state.goto(RouteState.home);
        };

        userService.loadApi(function () {
            userService.list().execute({
                success: function (response) {
                    list(response);
                },
                error: function (response) {
                    $scope.$digest();
                }
            });
        });

        $scope['showUsersList'] = function () {
            switch ($scope.state) {
                case 'confirmDelete':
                case 'list':
                    return true;
                default:
                    return false;
            }
        };
    }
    Users.ListUsersCtrl = ListUsersCtrl;

    function UpdateUsersCtrl($scope, $stateParams, $q, gns, userService) {
        function getView() {
            return {
                template: {
                    message: null,
                    url: null
                }
            };
        }

        var view = getView();

        loading(view);

        var user = { email: null };

        $scope.create = $stateParams.email === '';

        function getRoles(response) {
            if (response.code == 1) {
                view = getView();
            } else {
                view.template.url = templates.error;
                view.template.message = response.message;
            }
            passVars(view, $scope);
        }

        if ($scope.create) {
            user.roles = UserService.loadAllRoles();
        } else {
            user.email = $stateParams.email;
            $scope.user = user;
            userService.getRoles(user).execute({
                success: function (response) {
                    getRoles(response);
                    $scope.$digest();
                },
                error: function (response) {
                    view.template.url = templates.error;
                    view.template.message = response.message;
                    passVars(view, $scope);
                    $scope.$digest();
                }
            });
        }

        function updateUser(response) {
            if (response.code == 1) {
                view.template.url = templates.ok;
            } else if (response.code == -1) {
                view = getView();
                $scope.errors = response.message;
            } else {
                view.template.url = templates.error;
            }
            view.template.message = response.message;
            passVars(view, $scope);
            $scope.$digest();
        }

        $scope.user = user;
        $scope.save = function () {
            userService.loadApi(function () {
                userService.updateRoles($scope.user).execute({
                    success: function (response) {
                        updateUser(response);
                    },
                    error: function (response) {
                        $scope.errors = response;
                        $scope.$digest();
                    }
                });
            });
        };
        $scope.buttonLabel = function () {
            if ($scope.create)
                return 'criar';
            else
                return 'atualizar';
        };

        $scope.back = function () {
            gns.state.goto(RouteState.userList);
        };
    }
    Users.UpdateUsersCtrl = UpdateUsersCtrl;
})(Users || (Users = {}));

function DefaultCtrl($scope, $location, gns) {
    if (!gns.growl.isMsgShowed())
        gns.growl.showGrowl();
    $scope.goToUsers = function () {
        gns.state.goto(RouteState.userList);
    };
}

function AuthButtonCtrl($scope, gns, $location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        update(false);
    });

    var cbs = new CloudBeanSample(null);

    $scope.authaction = function () {
        if (ClientLoader.logged) {
            $scope.logout();
        } else {
            $scope.login();
        }
    };

    $scope.logout = function () {
        ClientLoader.logout();
        gns.state.goto(RouteState.home);
        $scope.state = false;
        update(false);
    };
    $scope.login = function () {
        cbs.login(function () {
            if (ClientLoader.logged) {
                $scope.state = ClientLoader.logged;
                gns.state.goto(RouteState.home);
            }
        });
    };

    var update = function (apply) {
        $scope.authvar = $scope.state ? "logout" : "login";
        if (apply)
            $scope.$digest();
    };
    update(false);
}

app.controller(['AuthButtonCtrl', AuthButtonCtrl]);
//# sourceMappingURL=app.js.map
