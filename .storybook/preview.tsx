import type { Preview } from "@storybook/react";
import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import '../src/app/globals.css';

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
    nextjs: {
      appDirectory: true,
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white antialiased`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
