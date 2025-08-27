/**
 * Coordinator Overview Cards Tests
 * Testing dashboard statistics display
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { OverviewCards } from '@/components/coordinator/overview-cards';
import { render } from '../../utils/test-utils';

describe('OverviewCards', () => {
  const mockCases = [
    {
      id: 'case-1',
      title: 'Test Case 1',
      status: 'NEW',
      urgency_score: 5,
      primary_subject: { first_name: 'John', last_name: 'Doe' },
      assigned_volunteer: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'case-2',
      title: 'Test Case 2',
      status: 'IN_PROGRESS',
      urgency_score: 8,
      primary_subject: { first_name: 'Jane', last_name: 'Smith' },
      assigned_volunteer: { first_name: 'Bob', last_name: 'Wilson' },
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render all overview cards with correct data', () => {
      render(<OverviewCards cases={mockCases} loading={false} />);

      // Check all cards are present
      expect(screen.getByText('Total Cases')).toBeInTheDocument();
      expect(screen.getByText('New Cases')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Unassigned')).toBeInTheDocument();

      // Check values
      expect(screen.getByText('2')).toBeInTheDocument(); // Total cases
      expect(screen.getByText('1')).toBeInTheDocument(); // New cases
    });

    it('should handle empty case list', () => {
      render(<OverviewCards cases={[]} loading={false} />);

      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('should show loading state', () => {
      render(<OverviewCards cases={[]} loading={true} />);

      // Should show skeleton loaders
      expect(screen.getByText('Total Cases')).toBeInTheDocument();
    });
  });

});