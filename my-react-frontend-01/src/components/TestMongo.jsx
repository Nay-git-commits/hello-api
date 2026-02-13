import { useEffect, useState } from 'react';

export default function TestMongo() {
  const [result, setResult] = useState('Loading...');

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/mongo_test`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setResult(JSON.stringify(data, null, 2)))
      .catch((err) => setResult('Error: ' + err.message));
  }, []);

  return (
    <div>
      <h2>Test Mongo</h2>
      <pre>{result}</pre>
    </div>
  );
}
