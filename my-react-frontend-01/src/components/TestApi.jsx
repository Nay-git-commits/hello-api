import { useEffect, useState } from 'react';

export default function TestApi() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/hello`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setMessage(data.message ?? JSON.stringify(data)))
      .catch((err) => setMessage('Error: ' + err.message));
  }, []);

  return (
    <div>
      <h2>Test API</h2>
      <pre>{message}</pre>
    </div>
  );
}
