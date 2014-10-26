package pt.ipg.cbs.core;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.servlet.GuiceServletContextListener;
import pt.ipg.cbs.core.injection.MainModule;
import pt.ipg.cbs.core.injection.SampleServletModule;

public class ContextListenerSample extends GuiceServletContextListener {

  @Override
  protected Injector getInjector() {
    return Guice.createInjector(new MainModule(), new SampleServletModule());
  }
}
