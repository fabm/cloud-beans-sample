package pt.ipg.cbs.core.acl.annotations;

import pt.gapiap.runtime.reflection.EnumArrayFromAnnotation;
import pt.ipg.cbs.roles.SampleRole;

public class RolesCapturerSample implements EnumArrayFromAnnotation<SampleRole,ACLRole>{
  @Override
  public Class<ACLRole> getAnnotationClass() {
    return ACLRole.class;
  }

  @Override
  public SampleRole[] getEnumArray(ACLRole annotation) {
    return annotation.value();
  }
}
