import React from 'react';
import { customRender } from "../utils/customRenderer";
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SaveDetails from '../../views/components/SaveDetails';

const render = customRender();

describe('SaveDetails component', () => {
    const mockSave = {
        category: 'Test Category',
        questions: [
            {
                statement: 'Test Statement 1',
                options: ['Option 1', 'Option 2', 'Option 3'],
                correct: 0,
                answer: 1,
                points: 10,
                time: 30
            },
            {
                statement: 'Test Statement 2',
                options: ['Option A', 'Option B', 'Option C'],
                correct: 2,
                answer: 2,
                points: 20,
                time: 45
            }
        ]
    };

    const mockBack = jest.fn();

    beforeEach(() => {
        render(<SaveDetails save={mockSave} back={mockBack} />);
    });

    it('renders summary and questions correctly', () => {
        expect(screen.getByText('Points: 30')).toBeInTheDocument(); // 10 + 20 points

        // Check if each question is rendered correctly
        const question1 = screen.getByText('1. Test Statement 1');
        expect(question1).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
        expect(screen.getByText('Points: 10')).toBeInTheDocument();
        expect(screen.getByText('Time: 30 s')).toBeInTheDocument();

        const question2 = screen.getByText('2. Test Statement 2');
        expect(question2).toBeInTheDocument();
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
        expect(screen.getByText('Option C')).toBeInTheDocument();
        expect(screen.getByText('Points: 20')).toBeInTheDocument();
        expect(screen.getByText('Time: 45 s')).toBeInTheDocument();
    });

    it('calls back function when "Go back" button is clicked', () => {
        const goBackButton = screen.getByText('Go back');
        fireEvent.click(goBackButton);
        expect(mockBack).toHaveBeenCalled();
    });
});
