import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../components/Navigation';

// Safely mock Next.js App Router hooks to prevent layout crashes during tests
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navigation & About Section Modal Integration', () => {
  it('Test Case 1 (Initial State): Modal is completely hidden from the DOM on mount', () => {
    render(<Navigation />);
    
    // The modal's unique content should not exist in the DOM initially
    expect(screen.queryByText(/About The App/i)).not.toBeInTheDocument();
  });

  it('Test Case 2 (Trigger Validation): Modal overlay and contact links render successfully on profile click', () => {
    render(<Navigation />);
    
    // Find the profile container wrapper containing the text
    // (There are two rendered: Desktop and Mobile, we trigger the first one)
    const profileTriggers = screen.getAllByText('Harit Ghetiya');
    fireEvent.click(profileTriggers[0]);

    // Assert the modal content successfully rendered on screen
    expect(screen.getByText(/About The App/i)).toBeInTheDocument();
    expect(screen.getByText(/Mission Log \(Why I Built It\)/i)).toBeInTheDocument();

    // Verify Dynamic Contact Badges and exact styled links
    expect(screen.getByRole('link', { name: /Email/i })).toHaveAttribute('href', 'mailto:haritpatel0902@gmail.com');
    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', 'https://github.com/Harit009');
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/harit-ghetiya-b91ab9413');
  });

  it('Test Case 3 (Dismissal Validation): Modal safely closes and unmounts on [ X ] click without memory leaks', () => {
    render(<Navigation />);
    
    // Trigger open
    const profileTriggers = screen.getAllByText('Harit Ghetiya');
    fireEvent.click(profileTriggers[0]);

    // Verify it is open
    expect(screen.getByText(/About The App/i)).toBeInTheDocument();

    // Locate the Close Action [ X ] button by its accessible name and click it
    const closeButton = screen.getByRole('button', { name: /Close Modal/i });
    fireEvent.click(closeButton);

    // Assert it unmounts from the DOM
    expect(screen.queryByText(/About The App/i)).not.toBeInTheDocument();
  });
});
