import {Injectable} from "@angular/core";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Platform, NavController} from "ionic-angular";
import {Subscription} from "rxjs";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import { ModalController } from 'ionic-angular';
import {LockScreenPage} from "../pages/lock-screen/lock-screen";

@Injectable()
export class LockService {

  private onPauseSubscription:Subscription;
  private onResumeSubscription:Subscription;
  private lockScreen:any;
  private initialized:boolean = false;
  private isLocked:boolean = false;

  constructor(public platform:Platform,
              public splashScreen: SplashScreen,
              public modalCtrl : ModalController,
              public faio: FingerprintAIO) {

  }

  init() {
    if (this.initialized) {
      return;
    }

    this.lockScreen = this.modalCtrl.create(LockScreenPage);

    this.platform.ready().then(() => {
      this.onPauseSubscription = this.platform.pause.subscribe(() => {
        this.splashScreen.show();
      });

      this.onResumeSubscription = this.platform.resume.subscribe(() => {

        if (!this.isLocked) {
          this.isLocked = true;
          this.lockScreen.present();
          this.showFingerPrint();
        }

        this.splashScreen.hide();
      });
    });
  }

  showFingerPrint() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password',   //Only necessary for Android
      disableBackup:true,       //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin',      //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
    })
    .then((result: any) => {
      console.log(result);
      this.lockScreen.dismiss();
      this.isLocked = false;
    })
    .catch((error: any) => console.log(error));
  }
}
