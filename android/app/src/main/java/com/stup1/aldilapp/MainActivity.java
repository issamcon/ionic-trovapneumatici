package com.stup1.aldilapp;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
//import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import java.util.ArrayList;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.community.nativemarket.NativeMarket;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      //add(CapacitorFirebaseAuth.class);
      add(GoogleAuth.class);
      add(NativeMarket.class);
    }});
  }
}
