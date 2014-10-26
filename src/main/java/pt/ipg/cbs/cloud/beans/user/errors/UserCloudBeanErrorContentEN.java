package pt.ipg.cbs.cloud.beans.user.errors;

import com.google.common.collect.ImmutableMap;
import pt.gapiap.cloud.endpoints.errors.ErrorTemplate;
import pt.gapiap.cloud.endpoints.errors.ParametrizedErrorTemplate;

import java.util.Iterator;
import java.util.Map;

public class UserCloudBeanErrorContentEN implements UserCloudBeanErrorContent {

  private ImmutableMap<Integer, ErrorTemplate> map;

  public UserCloudBeanErrorContentEN() {
    init();
  }

  private void init() {
    map = ImmutableMap.<Integer, ErrorTemplate>builder()
        .put(USER_NOT_IN_BD, new ParametrizedErrorTemplate("User {0} doesn't exist"))
        .build();
  }


  @Override
  public String getLanguage() {
    return "EN";
  }

  @Override
  public Map<String, ?> getArgs() {
    return null;
  }

  @Override
  public Iterator<Map.Entry<Integer, ErrorTemplate>> iterator() {
    return map.entrySet().iterator();
  }
}
