import { useState } from 'react';
import { useRouter } from 'next/router';



const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();

  const handleLogin = () => {
    if (password !== '1234') {
      setError('The code is incorrect.');
    } else {
      setError(undefined);
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
