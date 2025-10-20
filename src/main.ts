import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';

// ✅ Enregistrer le locale français
registerLocaleData(localeFr);

// On enrichit appConfig avec HttpClient et LOCALE_ID
const configWithHttpClient = {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideHttpClient(withFetch()),        // HttpClient
    { provide: LOCALE_ID, useValue: 'fr' } // Locale français
  ]
};

bootstrapApplication(App, configWithHttpClient)
  .catch((err) => console.error(err));
