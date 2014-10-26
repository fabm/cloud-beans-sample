/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />

interface ScopeUserList extends ng.IScope {
    showwait:boolean
    shownorowsnht:boolean
    shownhtcontent:boolean
    template:string
    state:any;
    removenht:(id:number)=>void
    users:any
    modalShown:boolean;
    toggleModal:Function;
    data:any;
    selectRole:(email:string, role:string, current:any)=>void;
    confirm:Function;
    addRole:Function;
    loading:boolean;
    loadingMessage:string;
    back:()=>void;
}

interface ScopeMain extends ng.IScope {
    authvar:string;
    authaction:()=>void;
}

interface GrowlAndState {
    growl:GrowlBH;
    state:{
        goto:(state:string)=>void;
    }
}

interface EndpointReturn {
    code:number;
    message:string;
}

var RouteState = {
    userList: 'users-allUsers',
    usersEdit: 'users-edit',
    home: 'default'
}

app.config(
    ($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider)=> {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state(RouteState.userList, {
                url: "/users",
                templateUrl: "views/usersmng/userslst.html",
                controller: Users.ListUsersCtrl
            })
            .state(RouteState.usersEdit, {
                url: "/users/edit/:email",
                templateUrl: "views/usersmng/usersup.html",
                controller: Users.UpdateUsersCtrl
            })
            /*
             .state(RouteState.articleEdit, {
             url: "/article/edit/:id",
             templateUrl: "views/artmng/articleedit.html",
             controller: Articles.EditArticleCtrl
             })
             */
            .state(RouteState.home, {
                url: "/",
                templateUrl: "views/default.html",
                controller: DefaultCtrl
            })
    }
);

app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '=',
            data: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
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
}

function passVars(map1, map2) {
    for (var k in map1) {
        map2[k] = map1[k];
    }
}

function loading(view) {
    view.template.url = templates.loading;
    view.template.message = localeMessage('loadingData', 'loading data ...');
}

module Users {

    export function ListUsersCtrl($scope:ScopeUserList, gns:GrowlAndState, userService:UserService) {

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

        function list(response:EndpointReturn) {
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

        $scope.back = ()=> {
            gns.state.goto(RouteState.home);
        }

        userService.loadApi(()=> {
            userService.list().execute({
                success: (response:EndpointReturn)=> {
                    list(response);
                },
                error: (response:EndpointReturn)=> {
                    $scope.$digest();
                }
            });
        });

        $scope['showUsersList'] = ()=> {
            switch ($scope.state) {
                case 'confirmDelete':
                case 'list':
                    return true;
                default :
                    return false;
            }
        }
    }

    export function UpdateUsersCtrl($scope, $stateParams, $q:ng.IQService, gns:GrowlAndState, userService:UserService) {
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

        var user:any = {email: null};

        $scope.create = $stateParams.email === '';

        function getRoles(response:EndpointReturn):void {
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
                success: (response:EndpointReturn) => {
                    getRoles(response);
                    $scope.$digest();
                },
                error: (response)=> {
                    view.template.url = templates.error;
                    view.template.message = response.message;
                    passVars(view, $scope);
                    $scope.$digest();
                }
            });
        }

        function updateUser(response:EndpointReturn) {
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
        $scope.save = () => {
            userService.loadApi(()=> {
                userService.updateRoles($scope.user).execute({
                    success: (response:EndpointReturn)=> {
                        updateUser(response);
                    },
                    error: (response)=> {
                        $scope.errors = response;
                        $scope.$digest();
                    }
                });
            });
        }
        $scope.buttonLabel = () => {
            if ($scope.create) return 'criar';
            else return 'atualizar';
        }

        $scope.back = ()=> {
            gns.state.goto(RouteState.userList);
        }
    }
}

interface AuthButtonCtrlScope extends ng.IScope {
    state:boolean;
    logout:()=>void;
    login:()=>void;
    update:()=>void;
    authvar:string;
    $location:ng.ILocationService;
    authaction:()=>void;
}

function DefaultCtrl($scope, $location, gns:GrowlAndState) {
    if (!gns.growl.isMsgShowed())
        gns.growl.showGrowl();
    $scope.goToUsers = ()=> {
        gns.state.goto(RouteState.userList);
    }
}

function AuthButtonCtrl($scope:AuthButtonCtrlScope, gns, $location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            update(false);
        }
    );

    var cbs = new CloudBeanSample(null);


    $scope.authaction = ()=> {
        if (ClientLoader.logged) {
            $scope.logout();
        } else {
            $scope.login();
        }
    }

    $scope.logout = () => {
        ClientLoader.logout();
        gns.state.goto(RouteState.home);
        $scope.state = false;
        update(false);
    }
    $scope.login = () => {
        cbs.login(()=> {
            if (ClientLoader.logged){
                $scope.state = ClientLoader.logged;
                gns.state.goto(RouteState.home);
            }
        });
    }

    var update = (apply:boolean)=> {
        $scope.authvar = $scope.state ? "logout" : "login";
        if (apply)
            $scope.$digest();
    }
    update(false);
}


app.controller(['AuthButtonCtrl', AuthButtonCtrl]);

