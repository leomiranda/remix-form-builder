import { createCookieSessionStorage } from '@remix-run/node';
import { createThemeSessionResolver } from 'remix-themes';

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === 'production';

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'theme',
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secrets: ['Os5AHAA37Q'],
		// Set domain and secure only if in production
		...(isProduction
			? { domain: 'form-builder.leomiranda.com', secure: true }
			: {}),
	},
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
