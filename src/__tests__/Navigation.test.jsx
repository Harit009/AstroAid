import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../components/Navigation';

// Safely mock Next.js App Router hooks to prevent layout crashes during tests
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navigation — Profile Click Callback', () => {
  it('Test Case 1: Profile card is present on initial render', () => {
    render(<Navigation onProfileClick={() => {}} />);
    // Both desktop + mobile render the name — at least one should be in the DOM
    expect(screen.getAllByText('Harit Ghetiya').length).toBeGreaterThan(0);
  });

  it('Test Case 2: onProfileClick fires when the desktop profile button is clicked', () => {
    const mockOnProfileClick = jest.fn();
    render(<Navigation onProfileClick={mockOnProfileClick} />);

    // getAllByRole finds both desktop + mobile profile buttons
    const profileButtons = screen.getAllByRole('button');
    // Desktop profile button is the first button rendered
    fireEvent.click(profileButtons[0]);

    expect(mockOnProfileClick).toHaveBeenCalledTimes(1);
  });

  it('Test Case 3: onProfileClick fires when the mobile profile button is clicked', () => {
    const mockOnProfileClick = jest.fn();
    render(<Navigation onProfileClick={mockOnProfileClick} />);

    const profileButtons = screen.getAllByRole('button');
    // Mobile profile button is second
    fireEvent.click(profileButtons[1]);

    expect(mockOnProfileClick).toHaveBeenCalledTimes(1);
  });

  it('Test Case 4: Nav links for Home, Discovery, Tracker are rendered', () => {
    render(<Navigation onProfileClick={() => {}} />);
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /discovery/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /tracker/i }).length).toBeGreaterThan(0);
  });
});
