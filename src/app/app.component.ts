import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins ,Capacitor} from '@capacitor/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService:AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
        if (Capacitor.isPluginAvailable('SplashScreen')) {
          this.splashScreen.hide();
        }
     // this.statusBar.styleDefault();
    });
  }
  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
