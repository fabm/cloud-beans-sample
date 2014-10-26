package pt.ipg.cbs.entities;

import com.google.appengine.api.users.User;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import pt.gapiap.cloud.endpoints.authorization.UserWithRoles;
import pt.ipg.cbs.roles.SampleRole;

import java.util.Set;

@Entity
public class UserSample implements UserWithRoles<SampleRole> {

  @Id
  private String email;

  private Set<SampleRole> roles;

  @Override
  public Set<SampleRole> getRoles() {
    return roles;
  }

  public void setRoles(Set<SampleRole> roles) {
    this.roles = roles;
  }

  public String getEmail() {
    return email;
  }

  @Override
  public void setEmail(String email) {
    this.email = email;
  }
}
