package pt.ipg.cbs.cloud.json.model.requests;

import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.annotations.Email;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;
import pt.ipg.cbs.cloud.endpoints.user.UserApiConstants;
import pt.ipg.cbs.roles.SampleRole;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;

@ApiMethodParameters(
    api = UserApiConstants.API,
    method = UserApiConstants.UPDATE_ROLES,
    validators = DefaultValidator.class
)
public class UserUpdateRequest {
  @NotNull
  @Email
  private String email;

  @NotNull
  private Set<SampleRole> roles;

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Set<SampleRole> getRoles() {
    return roles;
  }

  public void setRoles(Set<SampleRole> roles) {
    this.roles = roles;
  }
}
