package pt.ipg.cbs.cloud.model;

import com.google.appengine.api.users.User;
import com.google.appengine.repackaged.com.google.common.collect.Sets;
import pt.ipg.cbs.entities.UserSample;
import pt.ipg.cbs.roles.SampleRole;

public enum DummyUser {
  USER("user-test"),
  MODERATOR("moderator-test"),
  ADMINISTRATOR("admin-test");

  private String nick;

  private DummyUser(String nick) {
    this.nick = nick;
  }

  public UserSample getDummyUser() {
    UserSample userSample = new UserSample();
    switch (this) {
      case ADMINISTRATOR:
        userSample.setRoles(Sets.immutableEnumSet(SampleRole.ADMINISTRATOR));
        break;
      case MODERATOR:
        userSample.setRoles(Sets.immutableEnumSet(SampleRole.MODERATOR));
        break;
      case USER:
        userSample.setRoles(Sets.immutableEnumSet(SampleRole.USER));
        break;
    }
    userSample.setEmail(nick+"@gmail.com");
    return userSample;
  }

}
