package pt.ipg.cbs.cloud.json.model.response;

import com.google.appengine.repackaged.org.codehaus.jackson.annotate.JsonProperty;
import pt.gapiap.cloud.endpoints.EndpointReturn;

public class DummyUserResponse extends EndpointReturn{
  private String email;

  public DummyUserResponse(String email) {
    this.email = email;
  }

  @JsonProperty(value = "current")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
