import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { authService } from '@/services/auth.service';

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/dashboard');
    },
  });

  return (
    <div>
      <div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-10">
        <RegisterForm
          onSubmit={(data) => registerMutation.mutate(data)}
          isLoading={registerMutation.isPending}
        />

        {registerMutation.isError && (
          <div className="mt-4 text-sm text-red-600">
            Unable to create account. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};