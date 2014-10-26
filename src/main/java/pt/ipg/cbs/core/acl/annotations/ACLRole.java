package pt.ipg.cbs.core.acl.annotations;


import pt.ipg.cbs.roles.SampleRole;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ACLRole {
  SampleRole[] value();
}
