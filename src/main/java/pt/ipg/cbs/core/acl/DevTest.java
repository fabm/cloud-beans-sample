package pt.ipg.cbs.core.acl;

import pt.ipg.cbs.cloud.model.DummyUser;
import pt.ipg.cbs.entities.UserSample;

public class DevTest {

  private UserSample currentUser = DummyUser.USER.getDummyUser();

  public void setUser(DummyUser dummyUser) {
    currentUser = dummyUser.getDummyUser();
  }

  public UserSample getCurrentUser() {
    return currentUser;
  }
}
