'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiLogin, apiSignUp } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-client';
import styles from './page.module.css';

function safeRedirect(path) {
  if (!path || typeof path !== 'string') return null;
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

function LoginForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      setAuthSession({
        role: data.role,
        name: data.user?.name,
        email: data.user?.email,
      });

      // Full navigation so the auth cookie is reliably present for `proxy` on the next request.
      if (typeof window !== 'undefined') {
        const target = safeRedirect(
          new URLSearchParams(window.location.search).get('redirect'),
        );
        let next = '/';
        if (target) {
          if (target.startsWith('/admin') && data.role !== 'admin') {
            next = '/dashboard';
          } else {
            next = target;
          }
        }
        window.location.assign(next);
      } else {
        router.replace('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await apiSignUp(name, email, password);
      setIsSignUp(false);
      setError('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <Link href="/" prefetch={false} className={styles.backLink}>← Back to FACTACTO</Link>
        <div className={styles.brandContent}>
          <Image src="/images/ssn.jpeg" alt="SSN" width={80} height={80} className={styles.logo} />
          <p className={styles.factactoMark}>FACTACTO</p>
          <h1 className={styles.brandTitle}>Faculty sign-in</h1>
          <p className={styles.brandSub}>
            Department of Information Technology<br />
            SSN College of Engineering
          </p>
        </div>
        <div className={styles.loginQuote}>
          <p>&ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;</p>
          <cite> -  Nelson Mandela</cite>
        </div>
        <div className={styles.shapes}>
          <div className={styles.shape1} />
          <div className={styles.shape2} />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className={styles.formTitle}>Welcome back</h2>
                <p className={styles.formSubtitle}>Sign in to FACTACTO</p>

                <form onSubmit={handleLogin} className={styles.form}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                      id="login-email"
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@ssn.edu.in or admin@ssn"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && <p className={styles.error}>{error}</p>}

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <p className={styles.switchText}>
                  New here?{' '}
                  <button type="button" className={styles.switchBtn} onClick={() => { setIsSignUp(true); setError(''); }}>
                    Create an account
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className={styles.formTitle}>Create account</h2>
                <p className={styles.formSubtitle}>Join FACTACTO to track your activities</p>

                <form onSubmit={handleSignUp} className={styles.form}>
                  <div className="form-group">
                    <label htmlFor="signup-name">Full name</label>
                    <input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. K.L Rahul"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="signup-email">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@ssn.edu.in"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="signup-confirm">Confirm password</label>
                    <input
                      id="signup-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                    />
                  </div>

                  {error && <p className={styles.error}>{error}</p>}

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Creating...' : 'Create account'}
                  </button>
                </form>

                <p className={styles.switchText}>
                  Already have an account?{' '}
                  <button type="button" className={styles.switchBtn} onClick={() => { setIsSignUp(false); setError(''); }}>
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
