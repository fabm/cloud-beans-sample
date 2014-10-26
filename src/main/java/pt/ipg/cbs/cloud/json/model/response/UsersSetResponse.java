package pt.ipg.cbs.cloud.json.model.response;

import com.google.appengine.repackaged.org.codehaus.jackson.annotate.JsonProperty;
import com.google.appengine.repackaged.org.codehaus.jackson.annotate.JsonTypeName;
import pt.gapiap.cloud.endpoints.EndpointReturn;

import java.util.Collection;
import java.util.HashSet;

@JsonTypeName
public class UsersSetResponse extends EndpointReturn {
  private Collection<String> usersSet;

  public UsersSetResponse() {
    usersSet = new HashSet<>();
  }

  @JsonProperty(value = "list")
  public Collection<String> getUsersSet() {
    return usersSet;
  }
}
