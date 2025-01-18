import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/LoginForm';
import { authService } from '@/services/auth.service';

export const LoginPage = () => {
  const navigate = useNavigate();
  
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      navigate('/dashboard');
    },
  });

  return (
    <div>
      <div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            start your 14-day free trial
          </Link>
        </p>
      </div>

      <div className="mt-10">
        <LoginForm
          onSubmit={(data) => loginMutation.mutate(data)}
          isLoading={loginMutation.isPending}
        />

        {loginMutation.isError && (
          <div className="mt-4 text-sm text-red-600">
            Invalid email or password
          </div>
        )}
      </div>
    </div>
  );
};