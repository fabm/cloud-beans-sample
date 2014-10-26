package pt.ipg.cbs.cloud.beans.user.errors;

import pt.gapiap.cloud.endpoints.errors.ErrorArea;
import pt.gapiap.cloud.endpoints.errors.ErrorContent;

import java.util.List;
import java.util.Map;

public class UserCloudBeanErrorArea extends ErrorArea{

  @Override
  protected List<? extends ErrorContent> getErrorContents() {
    return null;
  }

  @Override
  protected Map<String, ?> getArgumentsMap(int index) {
    return null;
  }

  @Override
  protected int[] getClientErrorIndexes() {
    return new int[0];
  }
}
