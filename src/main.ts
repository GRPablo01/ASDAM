import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// 👉 active le français pour les pipes Angular (date, monnaie, etc.)
registerLocaleData(localeFr);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));