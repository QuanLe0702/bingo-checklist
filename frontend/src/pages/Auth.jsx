import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../store/authStore';

/**
 * Trang đăng nhập & đăng ký
 */
const Auth = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register: registerUser, loading, error } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [authMode, setAuthMode] = useState(mode);

  const onSubmit = async (data) => {
    try {
      if (authMode === 'login') {
        await login({ email: data.email, password: data.password });
      } else {
        await registerUser({
          username: data.username,
          email: data.email,
          password: data.password,
          displayName: data.displayName,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-bold text-blue-600 inline-block mb-2">
            🎯 Bingo Checklist
          </Link>
          <h2 className="text-2xl font-semibold">
            {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Tên đăng nhập *</label>
                <input
                  type="text"
                  {...register('username', { required: 'Username là bắt buộc', minLength: 3 })}
                  className="input"
                  placeholder="johndoe"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  {...register('displayName')}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              {...register('email', { required: 'Email là bắt buộc' })}
              className="input"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
            <input
              type="password"
              {...register('password', { required: 'Password là bắt buộc', minLength: 6 })}
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
            {authMode === 'login' && (
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {authMode === 'login' ? (
            <p>
              Chưa có tài khoản?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
