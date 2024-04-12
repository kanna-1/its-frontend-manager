import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useToast } from "@/components/ui/use-toast";



describe('ForgotPasswordForm', () => {
  it('handles form submission success', async () => {
    global.fetch = jest.fn(endpoint =>
      Promise.resolve({
        ok: true
      })
    );

    const mockSignIn = jest.fn()
    jest.mock('next-auth/react', () => ({
      signIn: mockSignIn
    }));

    const { getByRole, getByText, queryByText } = render(<ForgotPasswordForm />);
    // fireEvent.change(getByRole('textbox'), { target: { value: 'mockEmail@test.com' } });
    // fireEvent.submit(getByText('Reset'));

    await act( async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'mockEmail@test.com' } });
    });

    await act( async () => {
      fireEvent.submit(getByText('Reset'));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  

  it('handles form submission error', async () => {
    global.fetch = jest.fn(endpoint =>
      Promise.resolve({
        ok: false
      })
    );
    
    try {
      const { getByRole, getByText } = render(<ForgotPasswordForm />);
      await act( async () => {
        fireEvent.change(getByRole('textbox'), { target: { value: 'mockEmail@test.com' } });
      });
  
      await act( async () => {
        fireEvent.submit(getByText('Reset'));
      });
    } catch (error) {
      expect(error.message).not.toBeNull()
    }
    
  });
});
