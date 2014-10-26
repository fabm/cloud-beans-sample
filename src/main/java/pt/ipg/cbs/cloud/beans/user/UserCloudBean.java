package pt.ipg.cbs.cloud.beans.user;

import pt.gapiap.cloud.endpoints.EndpointReturn;
import pt.ipg.cbs.cloud.json.model.requests.RolesRequest;
import pt.ipg.cbs.cloud.json.model.requests.UserUpdateRequest;
import pt.ipg.cbs.core.acl.annotations.ACLRole;
import pt.ipg.cbs.roles.SampleRole;


public interface UserCloudBean {
  @ACLRole(SampleRole.ADMINISTRATOR)
  EndpointReturn getAllUsers();

  @ACLRole(SampleRole.ADMINISTRATOR)
  EndpointReturn updateRoles(UserUpdateRequest userUpdateRequest);

  @ACLRole(SampleRole.ADMINISTRATOR)
  EndpointReturn getRoles(RolesRequest rolesRequest);
}
