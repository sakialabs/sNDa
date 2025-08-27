/**
 * Case Table Component Tests
 * Testing data display and basic interactions
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CaseTable } from '@/components/coordinator/case-table';
import { render } from '../../utils/test-utils';

describe('CaseTable', () => {
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

  const defaultProps = {
    cases: mockCases,
    selectedCases: new Set<string>(),
    onSelectAllAction: vi.fn(),
    onSelectCaseAction: vi.fn(),
    loading: false,
    onViewCaseAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render table with case data', () => {
      render(<CaseTable {...defaultProps} />);

      // Check table headers
      expect(screen.getByText('Case')).toBeInTheDocument();
      expect(screen.getByText('Subject')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Urgency')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Check case data is displayed
      expect(screen.getByText('Test Case 1')).toBeInTheDocument();
      expect(screen.getByText('Test Case 2')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should display urgency scores correctly', () => {
      render(<CaseTable {...defaultProps} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should handle empty case list', () => {
      render(<CaseTable {...defaultProps} cases={[]} />);

      expect(screen.getByText(/no cases found/i)).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<CaseTable {...defaultProps} loading={true} />);

      expect(screen.getByText(/loading cases/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle view case action', async () => {
      const user = userEvent.setup();
      render(<CaseTable {...defaultProps} />);

      const viewButton = screen.getAllByText('View')[0];
      await user.click(viewButton);

      expect(defaultProps.onViewCaseAction).toHaveBeenCalledWith('case-1');
    });

    it('should handle case selection', async () => {
      const user = userEvent.setup();
      render(<CaseTable {...defaultProps} />);

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First case checkbox (index 0 is select all)

      expect(defaultProps.onSelectCaseAction).toHaveBeenCalledWith('case-1', true);
    });
  });

});