import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@mantine/core';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
        router.replace('/');
    }
  }, [router]);

  const handleLogin = async () => {
   
    setIsLoading(true);
    const res = await fetch(
      "/api/login",
      {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email,password})
      }
    );
    const { token, error: resError } = await res.json();
    if (resError !== undefined) {
      setError(resError);
    } else {
      setError(undefined);
      localStorage.setItem("token", token);
      router.push('/');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
    }}>
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
          </label>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button 
                className="ButtonLogin"
                onClick={handleLogin}
                disabled={isLoading}
            >
                Login
            </Button>
      </div>
    </div>
  );
};

export default Login;
