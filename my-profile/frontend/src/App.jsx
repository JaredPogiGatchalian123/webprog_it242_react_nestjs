import { useEffect, useState } from 'react';

// Use a relative path so Vercel handles the routing to your backend automatically
const API_URL = '/api/guestbook';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });

  const load = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch entries');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        setForm({ name: '', message: '' });
        load();
      } else {
        console.error("Save error status:", res.status);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        load();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>My Profile & Guestbook</h1>
      
      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          placeholder="Name" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <textarea 
          placeholder="Message" 
          value={form.message} 
          onChange={e => setForm({...form, message: e.target.value})} 
          required 
          style={{ padding: '8px', minHeight: '100px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          Sign Guestbook
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Entries ({entries.length})</h3>
      {entries.length === 0 ? <p>No entries yet. Be the first to sign!</p> : (
        entries.map(e => (
          <div key={e.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0' }}><strong>{e.name}</strong></p>
              <p style={{ margin: '5px 0', color: '#555' }}>{e.message}</p>
            </div>
            <button 
              onClick={() => remove(e.id)} 
              style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}