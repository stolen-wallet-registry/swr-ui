import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {
	it('renders a heading', () => {
		render(<Home />);

		const Body = screen.getByText(/Welcome to you app/i);
		expect(Body).toBeInTheDocument();
	});
});
