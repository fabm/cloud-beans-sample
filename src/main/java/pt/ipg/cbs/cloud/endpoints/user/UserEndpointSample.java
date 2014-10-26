package pt.ipg.cbs.cloud.endpoints.user;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.users.User;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Inject;
import pt.gapiap.cloud.endpoints.EndpointReturn;
import pt.ipg.cbs.cloud.beans.user.UserCloudBean;
import pt.ipg.cbs.cloud.endpoints.EndpointsConstants;
import pt.ipg.cbs.cloud.json.model.requests.RolesRequest;
import pt.ipg.cbs.cloud.json.model.requests.UserChangeDummyUserRequest;
import pt.ipg.cbs.cloud.json.model.requests.UserUpdateRequest;
import pt.ipg.cbs.cloud.json.model.response.DummyUserResponse;
import pt.ipg.cbs.core.acl.ACLInvokerBuilder;
import pt.ipg.cbs.core.acl.DevTest;

@Api(name = "user",
    version = "v1",
    description = "Endpoint UserSample",
    scopes = {EndpointsConstants.EMAIL_SCOPE},
    clientIds = {
        EndpointsConstants.WEB_CLIENT_ID,
        EndpointsConstants.ANDROID_CLIENT_ID,
        EndpointsConstants.IOS_CLIENT_ID,
        EndpointsConstants.API_EXPLORER_CLIENT_ID
    },
    audiences = {EndpointsConstants.ANDROID_AUDIENCE}
)

public class UserEndpointSample {

  @Inject
  DevTest devTest;

  @Inject
  private ACLInvokerBuilder<UserCloudBean> aclBuilder;

  @ApiMethod(name = UserApiConstants.GET_ALL_USERS, httpMethod = ApiMethod.HttpMethod.GET, path = "/" + UserApiConstants.GET_ALL_USERS)
  public EndpointReturn getAllUsers(User user) {
    return aclBuilder.execute(user).getAllUsers();
  }

  @ApiMethod(name = "setDummy", path = "set-dummy")
  public EndpointReturn setDummy(UserChangeDummyUserRequest dummyUser) {
    devTest.setUser(dummyUser.getDummyUser());
    return new DummyUserResponse(devTest.getCurrentUser().getEmail());
  }

  @ApiMethod(name = UserApiConstants.UPDATE_ROLES, path = "/" + UserApiConstants.UPDATE_ROLES)
  public EndpointReturn updateRoles(User user, UserUpdateRequest userUpdateRequest) {
    return aclBuilder
        .execute(user)
        .updateRoles(userUpdateRequest);
  }

  @ApiMethod(name = UserApiConstants.GET_ROLES, path = "/" + UserApiConstants.GET_ROLES)
  public EndpointReturn getRoles(User user, RolesRequest rolesRequest) {
    return aclBuilder
        .execute(user)
        .getRoles(rolesRequest);
  }

  @ApiMethod(name = "currentUser", path = "/current-user")
  public Object currentUser(User user) {
    ImmutableMap.Builder<Object, Object> builder = ImmutableMap.builder();
    if (user == null) {
      builder.put("no", "authentication");
    } else {
      builder.put("user", user.getEmail());
    }
    return builder.build();
  }

}

