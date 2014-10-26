package pt.ipg.cbs.core.injection;

import com.google.api.server.spi.auth.AuthUtils;
import com.google.api.server.spi.auth.UserContainer;
import com.google.appengine.repackaged.com.google.common.collect.ImmutableSet;
import com.google.appengine.repackaged.com.google.common.collect.Sets;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.servlet.RequestScoped;
import pt.gapiap.cloud.endpoints.authorization.AppEnvironment;
import pt.gapiap.guice.UserWithRolesProvider;
import pt.ipg.cbs.core.acl.DevTest;
import pt.ipg.cbs.entities.Dao;
import pt.ipg.cbs.entities.UserSample;
import pt.ipg.cbs.roles.SampleRole;

import javax.servlet.http.HttpServletRequest;


@RequestScoped
public class UserSampleProvider implements UserWithRolesProvider<SampleRole> {

  private UserSample userSample;
  @Inject
  private Dao<UserSample> userSampleDao;

  @Inject
  private void init(AppEnvironment appEnvironment, Injector injector) {
    if (appEnvironment.isDevMode()) {
      userSample = injector.getInstance(DevTest.class).getCurrentUser();
    }
  }

  @Override
  public UserSample get() {
    return userSample;
  }

  @Override
  public void setEmail(String email) {
    if (email.equalsIgnoreCase("francisco.ab.monteiro@gmail.com")) {
      userSample = new UserSample();
      userSample.setEmail(email);
      ImmutableSet<SampleRole> roles = Sets.immutableEnumSet(SampleRole.ADMINISTRATOR);
      userSample.setRoles(roles);
    } else {
      userSample = userSampleDao.load(email);
    }
  }
}
