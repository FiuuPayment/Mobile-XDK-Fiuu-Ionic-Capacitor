import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet],
    providers: [InAppBrowser]
})
export class AppComponent {
  constructor() {}
}
