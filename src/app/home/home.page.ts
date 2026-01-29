import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { CommonModule, NgIf } from '@angular/common';
import { FiuuPayment } from 'fiuuxdk-capacitor-plugin';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, NgIf, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  isAndroid: boolean = false;
  paymentStatus: string = 'Not Started';

  constructor(private platform: Platform, private alertCtrl: AlertController) {}

  async ngOnInit() {
    const info = await Device.getInfo();
    this.isAndroid = info.platform === 'android';
  }

  async startFiuuPayment() {
    console.log('Starting Fiuu Payment');

    await this.platform.ready();
    console.log('Platform is ready');

    if (!FiuuPayment || !FiuuPayment.startPayment) {
      console.error('FiuuPayment plugin not available!');
      this.presentAlert('FiuuPayment plugin is not available!');
      return;
    }

    let paymentDetails = {
      mp_username: "",
      mp_password: "",
      mp_merchant_ID: "",
      mp_app_name: "",
      mp_verification_key: '',
      mp_amount: "1.10",
      mp_order_ID: "",
      mp_currency: "MYR",
      mp_country: "MY",
      mp_channel: "multi",
      mp_bill_description: "description",
      mp_bill_name: "John Doe",
      mp_bill_email: "johndoe@example.com",
      mp_bill_mobile: "",
    };

    try {
      const result = await FiuuPayment.startPayment(paymentDetails);
      console.log('Payment Result:', result);
      this.paymentStatus = `Payment Success: ${JSON.stringify(result)}`;
      this.presentAlert('Payment Successful!');
    } catch (error) {
      console.error('Payment Error:', error);
      this.paymentStatus = `Payment Failed: ${error}`;
      this.presentAlert('Payment Failed!');
    }
  }

  async startGooglePayPayment() {
    console.log('Starting Google Pay Payment');

    await this.platform.ready();
    console.log('Platform is ready');

    if (!this.platform.is('android')) {
      console.error('Google Pay is only supported on Android.');
      return;
    }

    const paymentDetails: any = {
      mp_merchant_ID: '',
      mp_verification_key: '',
      mp_amount: '1.10',
      mp_order_ID: '1523765091',
      mp_currency: 'MYR',
      mp_country: 'MY',
      mp_bill_description: 'description',
      mp_bill_name: 'John Doe',
      mp_bill_email: 'johndoe@example.com',
      mp_bill_mobile: '105567754',
      mp_extended_vcode: false,
      mp_sandbox_mode: true,
    };

    try {
      const result = await FiuuPayment.startPayment(paymentDetails);
      this.paymentStatus = `Payment Success: ${JSON.stringify(result)}`;
      this.presentAlert('Payment Successful!');
    } catch (error) {
      this.paymentStatus = `Payment Failed: ${error}`;
      this.presentAlert('Payment Failed!');
    }
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Payment Status',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
