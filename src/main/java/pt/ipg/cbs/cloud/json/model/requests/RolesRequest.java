package pt.ipg.cbs.cloud.json.model.requests;

import pt.gapiap.proccess.validation.annotations.Email;

import javax.validation.constraints.NotNull;

public class RolesRequest{
  @NotNull
  @Email
  private String email;

  public void setEmail(String email) {
    this.email = email;
  }

  public String getEmail() {
    return email;
  }
}
