package pt.ipg.cbs.core.injection;

import pt.gapiap.cloud.endpoints.authorization.UserWithRoles;
import pt.gapiap.guice.AclInvokerTypeParameters;
import pt.ipg.cbs.core.acl.annotations.ACLRole;
import pt.ipg.cbs.entities.UserSample;
import pt.ipg.cbs.roles.SampleRole;

import java.lang.annotation.Annotation;

public class AclInvokerTypeParametersSample implements AclInvokerTypeParameters {
  @Override
  public Class<? extends Enum<?>> getRoleClass() {
    return SampleRole.class;
  }

  @Override
  public Class<? extends UserWithRoles> getUserWithRolesClass() {
    return UserSample.class;
  }

  @Override
  public Class<? extends Annotation> getAnnotation() {
    return ACLRole.class;
  }
}
