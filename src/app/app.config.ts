import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loggingInterceptor } from '@shared/components/interceptor/logging.interceptor';
import { authInterceptor } from '@auth/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor, authInterceptor])
    ), //se añade interceptor cuando lo este usando, como para guardar el token
  ],
};
