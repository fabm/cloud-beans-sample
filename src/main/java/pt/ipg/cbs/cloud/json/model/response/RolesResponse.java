package pt.ipg.cbs.cloud.json.model.response;

import com.google.appengine.repackaged.org.codehaus.jackson.annotate.JsonTypeName;
import pt.gapiap.cloud.endpoints.EndpointReturn;
import pt.ipg.cbs.roles.SampleRole;

import java.util.Set;

@JsonTypeName
public class RolesResponse extends EndpointReturn {
  private Set<SampleRole> sampleRoles;

  public Set<SampleRole> getSampleRoles() {
    return sampleRoles;
  }

  public void setSampleRoles(Set<SampleRole> sampleRole) {
    this.sampleRoles = sampleRole;
  }
}
