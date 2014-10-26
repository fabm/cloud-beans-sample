package pt.ipg.cbs.cloud.endpoints;

public interface EndpointsConstants {
  public static final String WEB_CLIENT_ID = "86843638616-6j1kqn7nfoact4unjqguuktpo9ue0m5e.apps.googleusercontent.com";
  public static final String ANDROID_CLIENT_ID = WEB_CLIENT_ID;
  public static final String IOS_CLIENT_ID = WEB_CLIENT_ID;
  public static final String ANDROID_AUDIENCE = WEB_CLIENT_ID;
  public static final String EMAIL_SCOPE = "https://www.googleapis.com/auth/userinfo.email";
  public static final String API_EXPLORER_CLIENT_ID
      = com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID;
}
