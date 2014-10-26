package pt.ipg.cbs.core.acl;

import com.google.appengine.api.users.User;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.util.Types;
import pt.gapiap.cloud.endpoints.authorization.ACLInvoker;
import pt.gapiap.guice.AclInvokerTypeParameters;
import pt.ipg.cbs.core.injection.UserSampleProvider;

import java.lang.reflect.ParameterizedType;

public class ACLInvokerBuilder<T> {
  @Inject
  private Injector injector;

  @Inject
  private TypeLiteral<T> type;

  private ACLInvoker<?, ?, ?, T> aclInvoker() {
    AclInvokerTypeParameters aclInvokerTypeParameters = injector.getInstance(AclInvokerTypeParameters.class);

    ParameterizedType pt = Types.newParameterizedType(ACLInvoker.class,
        aclInvokerTypeParameters.getRoleClass(),
        aclInvokerTypeParameters.getUserWithRolesClass(),
        aclInvokerTypeParameters.getAnnotation(),
        type.getType()
    );
    return (ACLInvoker<?, ?, ?, T>) injector.getInstance(Key.get(pt));
  }

  public T execute(User user) {
    if (user != null) {
      System.out.println(String.format("current user in builder:%s", user.getEmail()));
      injector.getInstance(UserSampleProvider.class).setEmail(user.getEmail());
    }

    return aclInvoker().execute();
  }

  public T execute() {
    return execute(null);
  }

}