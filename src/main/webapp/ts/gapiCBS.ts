/// <reference path="gapis.ts" />
class CloudBeanSample extends ClientLoader {
    constructor(apiMapDepot:ApiMapDepot) {
        super(apiMapDepot);
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        super.setClientID('86843638616-6j1kqn7nfoact4unjqguuktpo9ue0m5e.apps.googleusercontent.com');
        super.setScope(['https://www.googleapis.com/auth/userinfo.email']);
    }
}

interface Role {
    name:string;alias:string;role:boolean;
}

class UserService extends CloudBeanSample {
    constructor(apiMapDepot:ApiMapDepot) {
        super(apiMapDepot);
        this.client = 'user';
    }

    public static loadAllRoles():Array<Role> {
        function create(alias, name):Role {
            return {
                name: name,
                alias: alias,
                role: false
            };
        }

        var all:Array<Role> = [];
        all.push(create('moderator', 'MODERATOR'));
        all.push(create('administrator', 'ADMINISTRATOR'));
        all.push(create('user', 'USER'));
        return all;
    }

    getRoles(user):Executor {
        var self = this;

        var onSuccess;

        var iResolver = {
            success: (response)=> {
                if(response.code!=1){
                    onSuccess(response);
                    return;
                }
                var allRoles:Array<Role> = UserService.loadAllRoles();
                allRoles.forEach((value, index, arr)=> {
                    value.role = response.sampleRoles.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(response);
            },
            error: null,
            unauthorized: null
        };


        return {
            execute: (resolver:Resolve)=> {
                iResolver.error = resolver.error;
                iResolver.unauthorized = resolver.unauthorized;
                onSuccess = resolver.success;
                super.loadApi(()=> {
                    var method = self.api['get']['roles'];
                    method.args = {email: user.email};
                    method.execute(iResolver);
                });
            }
        };
    }

    updateRoles(user:{email:string;roles:Array<Role>}):Executor {
        var self = this;

        return {
            execute: (resolver:Resolve)=> {
                var rolesSelected:Array<string> = [];
                user.roles.forEach((value, index, arr)=> {
                    if (value.role)rolesSelected.push(value.name);
                });
                var updateRoles = self.api['update']['roles'];
                updateRoles.args = {'email': user.email, 'roles': rolesSelected};
                updateRoles.execute(resolver);
            }
        }
    }

    list():Executor {
        return this.api['getAllUsers'];
    }
}

