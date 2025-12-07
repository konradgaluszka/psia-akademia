import type { JSX } from "react";

export type SocialProvider = "google" | "facebook" | "tiktok";

export const socialProviders: SocialProvider[] = [
  "google",
  "facebook",
  "tiktok"
];

export const providerIcons: Record<SocialProvider, JSX.Element> = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-.9 2.4-2 3.1l3.2 2.5c1.9-1.7 3-4.2 3-7.3 0-.7-.1-1.5-.2-2.2H12z"
      />
      <path
        fill="#34A853"
        d="M5.7 14.3l-.9.7-2.6 2c1.9 3.7 5.7 6.3 10.1 6.3 3 0 5.5-1 7.4-2.7l-3.2-2.5c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3z"
      />
      <path
        fill="#4A90E2"
        d="M3.1 7.7C2.4 9.1 2 10.6 2 12c0 1.4.4 2.9 1.1 4.3l3.7-2.9c-.2-.6-.3-1.2-.3-1.9 0-.7.1-1.3.3-1.9z"
      />
      <path
        fill="#FBBC05"
        d="M12 4.8c1.6 0 3 .6 4.2 1.7l3.1-3.1C17.5 1.4 15.1.4 12 .4 7.6.4 3.8 3 2 6.8l3.7 2.9C6.9 6.6 9.3 4.8 12 4.8z"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#1877F2"
        d="M12 0C5.4 0 0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.3c0-3 1.8-4.7 4.6-4.7 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4C19.6 23 24 18 24 12 24 5.4 18.6 0 12 0z"
      />
      <path
        fill="#FFF"
        d="M16.6 15.5 17.1 12h-3.4V9.6c0-1 .5-1.9 2-1.9h1.5V4.8s-1.3-.2-2.6-.2c-2.8 0-4.6 1.7-4.6 4.7V12h-3v3.5h3v8.4c.6.1 1.2.1 1.8.1s1.2 0 1.8-.1v-8.4h2.9z"
      />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#000"
        d="M18.9 6.4c-1.3-.8-2-1.8-2.2-3.2h-2.7v11.3c0 1-.8 1.9-1.9 1.9s-1.9-.8-1.9-1.9c0-.9.7-1.7 1.6-1.9v-2.8c-2.6.2-4.6 2.4-4.6 4.9 0 2.7 2.2 4.9 4.9 4.9s4.9-2.2 4.9-4.9V8.7c1 .8 2.2 1.2 3.5 1.3V7.1c-.5 0-1.1-.2-1.6-.4z"
      />
      <path
        fill="#FF004F"
        d="M16.7 6.5c.6.6 1.3 1 2.2 1.3V7.1c-.5 0-1.1-.2-1.6-.4-1.3-.8-2-1.8-2.2-3.2h-1.4v2.6c.3.8.9 1.6 1.7 2.2z"
      />
      <path
        fill="#00F2EA"
        d="M11.1 13.4c-1 .2-1.7 1-1.7 2 0 1.1.9 1.9 1.9 1.9s1.9-.8 1.9-1.9v-5h-1.9v3z"
      />
    </svg>
  )
};
