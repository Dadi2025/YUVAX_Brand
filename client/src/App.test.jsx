import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component to test setup without rendering the complex App
const TestComponent = () => <div>Hello Test World</div>;

describe('App', () => {
    it('renders the test component correctly', () => {
        render(<TestComponent />);
        expect(screen.getByText('Hello Test World')).toBeInTheDocument();
    });
});
