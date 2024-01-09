import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-6b854","appId":"1:813417845397:web:150984088217cd2310419c","storageBucket":"ring-of-fire-6b854.appspot.com","apiKey":"AIzaSyDSAZjS_gtfUUldfBTv8C_JHTySX4HWJ34","authDomain":"ring-of-fire-6b854.firebaseapp.com","messagingSenderId":"813417845397"}))), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-6b854","appId":"1:813417845397:web:150984088217cd2310419c","storageBucket":"ring-of-fire-6b854.appspot.com","apiKey":"AIzaSyDSAZjS_gtfUUldfBTv8C_JHTySX4HWJ34","authDomain":"ring-of-fire-6b854.firebaseapp.com","messagingSenderId":"813417845397"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
