package pt.ipg.cbs.cloud.beans.user;

import com.google.common.collect.ImmutableMap;
import com.google.inject.Inject;
import com.google.inject.Injector;
import pt.gapiap.cloud.endpoints.EndpointReturn;
import pt.gapiap.cloud.endpoints.errors.Failure;
import pt.gapiap.cloud.endpoints.errors.FailureManager;
import pt.ipg.cbs.cloud.beans.user.errors.UserCloudBeanErrorContent;
import pt.ipg.cbs.cloud.json.model.requests.RolesRequest;
import pt.ipg.cbs.cloud.json.model.requests.UserUpdateRequest;
import pt.ipg.cbs.cloud.json.model.response.RolesResponse;
import pt.ipg.cbs.cloud.json.model.response.UsersSetResponse;
import pt.ipg.cbs.entities.Dao;
import pt.ipg.cbs.entities.UserSample;

import java.util.Collection;

public class UserCloudBeanImp implements UserCloudBean {

  @Inject
  private Dao<UserSample> userSampleDao;

  @Inject
  private UserSample userSample;

  @Inject
  private FailureManager failureManager;

  @Inject
  private Injector injector;

  @Override
  public UsersSetResponse getAllUsers() {
    UsersSetResponse usersSetResponse = new UsersSetResponse();
    Collection<String> usersSet = usersSetResponse.getUsersSet();
    for (UserSample userSample : userSampleDao.loadAll()) {
      usersSet.add(userSample.getEmail());
    }
    return usersSetResponse;
  }

  @Override
  public EndpointReturn updateRoles(UserUpdateRequest userUpdateRequest) {

    UserSample userSample = new UserSample();
    userSample.setEmail(userUpdateRequest.getEmail());
    userSample.setRoles(userUpdateRequest.getRoles());

    userSampleDao.save(userSample);

    EndpointReturn endpointReturn = injector.getInstance(EndpointReturn.class);
    endpointReturn.setMsgMap(
        ImmutableMap.of(
            "pt", "Utilizador atualizado com sucesso",
            "en", "User successfully updated")
    );

    return endpointReturn;
  }

  @Override
  public EndpointReturn getRoles(RolesRequest rolesRequest) {
    UserSample userWithRoles = userSampleDao.load(rolesRequest.getEmail());
    //do error
    if (userWithRoles == null) {
      Failure failure = failureManager
          .createFailure(UserCloudBeanErrorContent.USER_NOT_IN_BD, userWithRoles.getEmail());
      return new EndpointReturn(failure);
    }
    RolesResponse rolesResponse = new RolesResponse();
    rolesResponse.setSampleRoles(userWithRoles.getRoles());
    return rolesResponse;
  }

}
