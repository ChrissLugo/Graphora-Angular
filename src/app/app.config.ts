import {
	ApplicationConfig,
	importProvidersFrom,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
	FONT_PICKER_CONFIG,
	FontPickerConfigInterface,
	FontPickerService,
} from 'ngx-font-picker';

import { routes } from './app.routes';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
	apiKey: 'AIzaSyDTYpMGdwg3qN_u-6MeHFxRc1tVCnhOvPE',
};
import {
	HttpClientModule,
	provideHttpClient,
	withFetch,
	withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

		importProvidersFrom(HttpClientModule),
		FontPickerService,

		{
			provide: FONT_PICKER_CONFIG,
			useValue: DEFAULT_FONT_PICKER_CONFIG,
		},
	],
};
