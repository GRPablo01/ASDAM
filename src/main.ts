import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// On enrichit appConfig avec HttpClient
const configWithHttpClient = {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideHttpClient(withFetch()) // ✅ Active HttpClient avec Fetch API
  ]
};

bootstrapApplication(App, configWithHttpClient)
  .catch((err) => console.error(err));
