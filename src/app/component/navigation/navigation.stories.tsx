import type { Meta, StoryObj } from '@storybook/react';
import Navigation from './navigation';
import React from 'react';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    brandName: 'Xcruser.net',
    items: [
      { label: 'Home', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    bgColor: 'dark',
    showMobileMenu: true,
  },
  argTypes: {
    brandName: {
      control: 'text',
      description: 'The brand name shown in the navigation',
    },
    items: {
      control: 'object',
      description: 'The navigation items to display',
    },
    bgColor: {
      control: 'select',
      options: ['dark', 'light', 'transparent'],
      description: 'The background color of the navigation',
    },
    showMobileMenu: {
      control: 'boolean',
      description: 'Whether to show the mobile menu button',
    },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const LightTheme: Story = {
  args: {
    bgColor: 'light',
  },
};

export const CustomBrand: Story = {
  args: {
    brandName: 'My Brand',
    items: [
      { label: 'Products', href: '#' },
      { label: 'Services', href: '#' },
      { label: 'About', href: '#' },
    ],
  },
};
