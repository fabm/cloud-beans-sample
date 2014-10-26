package pt.ipg.cbs.core.injection;

import com.google.common.collect.Lists;
import com.google.inject.Scopes;
import com.google.inject.TypeLiteral;
import com.google.inject.servlet.RequestScoped;
import pt.gapiap.cloud.endpoints.authorization.UserWithRoles;
import pt.gapiap.cloud.endpoints.errors.ErrorArea;
import pt.gapiap.cloud.endpoints.errors.GlobalErrorArea;
import pt.gapiap.guice.AclInvokerTypeParameters;
import pt.gapiap.guice.GapiModule;
import pt.gapiap.proccess.validation.defaultValidator.languages.DefaultValidatorErrorArea;
import pt.gapiap.runtime.reflection.EnumArrayFromAnnotation;
import pt.gapiap.servlets.language.UploadErrorArea;
import pt.ipg.cbs.cloud.beans.user.UserCloudBean;
import pt.ipg.cbs.cloud.beans.user.UserCloudBeanImp;
import pt.ipg.cbs.core.acl.DevTest;
import pt.ipg.cbs.core.acl.annotations.ACLRole;
import pt.ipg.cbs.core.acl.annotations.RolesCapturerSample;
import pt.ipg.cbs.entities.Dao;
import pt.ipg.cbs.entities.UserSample;
import pt.ipg.cbs.roles.SampleRole;

import java.util.List;

public class MainModule extends GapiModule<SampleRole, UserSample> {


  @Override
  protected EnumArrayFromAnnotation getEnumArrayFromAnnotationClass() {
    return new RolesCapturerSample();
  }

  @Override
  protected Class<? extends AclInvokerTypeParameters> getInvokerTypeParameters() {
    return AclInvokerTypeParametersSample.class;
  }

  @Override
  protected List<? extends ErrorArea> getErrorAreas() {
    return Lists.newArrayList(
        new GlobalErrorArea(),
        new DefaultValidatorErrorArea(),
        new UploadErrorArea()
    );
  }

  @Override
  protected void configure() {
    super.configure();

    bind(UserCloudBean.class).to(UserCloudBeanImp.class).in(RequestScoped.class);

    bind(new TypeLiteral<UserWithRoles<SampleRole>>() {
    }).toProvider(UserSampleProvider.class);

    bind(new TypeLiteral<Dao<UserSample>>() {
    }).toInstance(new Dao<UserSample>(UserSample.class));


    bind(new TypeLiteral<EnumArrayFromAnnotation<SampleRole, ACLRole>>() {
    }).toInstance(getEnumArrayFromAnnotationClass());


    bind(DevTest.class).in(Scopes.SINGLETON);

  }
}
