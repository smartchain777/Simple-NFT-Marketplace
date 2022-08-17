import { render, screen } from '@testing-library/react';
import App from './App';

window.alert = jest.fn();
test('renders learn react link', () => 
{
  window.alert.mockClear();
  const app = render(<App />);
  expect(app).toMatchSnapshot();
});
