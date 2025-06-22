import type { Preview } from '@storybook/nextjs'
import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import '../app/globals.css'
import { ThemeProvider } from '../lib/theme-context'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      
      return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased ${theme === 'dark' ? 'dark' : ''}`}>
          <ThemeProvider>
            <div className="bg-background text-foreground p-4">
              <Story />
            </div>
          </ThemeProvider>
        </div>
      );
    },
  ],
};

export default preview;