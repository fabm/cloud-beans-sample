package pt.ipg.cbs.core.injection;

import com.google.api.server.spi.guice.GuiceSystemServiceServletModule;
import com.google.inject.Injector;
import com.google.inject.Provides;
import com.google.inject.TypeLiteral;
import com.google.inject.servlet.RequestScoped;
import pt.gapiap.servlets.ClientErrorsServlet;
import pt.ipg.cbs.cloud.beans.user.UserCloudBean;
import pt.ipg.cbs.cloud.endpoints.user.UserEndpointSample;

import java.util.HashSet;
import java.util.Set;

public class SampleServletModule extends GuiceSystemServiceServletModule {

  @Override
  protected void configureServlets() {
    super.configureServlets();

    Set<Class<?>> cloudEndpointsClasses = new HashSet<>();

    cloudEndpointsClasses.add(UserEndpointSample.class);

    this.serve("/errors.json").with(new ClientErrorsServlet());
    this.serveGuiceSystemServiceServlet("/_ah/spi/*", cloudEndpointsClasses);
  }

}
