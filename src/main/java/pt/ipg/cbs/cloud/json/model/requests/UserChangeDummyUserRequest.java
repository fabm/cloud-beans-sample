package pt.ipg.cbs.cloud.json.model.requests;

import pt.ipg.cbs.cloud.model.DummyUser;

public class UserChangeDummyUserRequest {
  public DummyUser getDummyUser() {
    return dummyUser;
  }

  public void setDummyUser(DummyUser dummyUser) {
    this.dummyUser = dummyUser;
  }

  DummyUser dummyUser;
}
