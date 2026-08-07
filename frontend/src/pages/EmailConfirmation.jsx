import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../api/authService';
import Loader from '../components/Loader';

const EmailConfirmation = ({ showToast }) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, pending
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('pending');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await authService.verifyEmail(token);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      showToast && showToast('Email verified successfully!', 'success');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Email verification failed. The link may have expired.');
      showToast && showToast('Email verification failed', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        {status === 'verifying' && (
          <>
            <Loader />
            <h2 className="text-2xl font-bold mt-4 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/login" className="btn-primary">
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link to="/register" className="block btn-primary">
                Register Again
              </Link>
              <Link to="/login" className="block text-secondary hover:underline">
                Go to Login
              </Link>
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> The verification link will expire in 24 hours. If you don't see the email, please check your spam folder.
              </p>
            </div>
            <Link to="/login" className="btn-primary">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;