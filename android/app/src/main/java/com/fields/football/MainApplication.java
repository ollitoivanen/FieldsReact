package com.fields.football;

import android.app.Application;


import com.facebook.react.ReactApplication;
import com.dooboolab.RNIap.RNIapPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;



import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import com.airbnb.android.react.maps.MapsPackage;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNIapPackage(),
            new RNI18nPackage(),
            new ReactNativePushNotificationPackage(),
            new RNAndroidLocationEnablerPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new FastImageViewPackage(),
              new MapsPackage(),

            new RNFirebasePackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNFirebaseStoragePackage(),
              new RNFirebaseCrashlyticsPackage(),

      new RNFirebaseAuthPackage(),
              new RNFirebaseFirestorePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}