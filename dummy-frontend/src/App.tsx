import { useState } from 'react'

type HealthResult = string | { status: string; timestamp: string }

type InspectResult = {
  timestamp: string
  host: {
    machineName: string
    osDescription: string
    osArchitecture: string
    processArchitecture: string
    dotnetVersion: string
    processorCount: number
    ipAddresses: string[]
  }
  process: {
    pid: number
    workingDirectory: string
    uptimeSeconds: number
  }
  environmentVariables: Record<string, string>
  requestHeaders: Record<string, string>
}

function App() {
  const [health, setHealth] = useState<HealthResult | null>(null)
  const [inspect, setInspect] = useState<InspectResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const request = async <T,>(path: string, responseType: 'json' | 'text' = 'json'): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(path)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      if (responseType === 'text') {
        return (await res.text()) as T
      }

      const contentType = res.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        return (await res.json()) as T
      }

      return (await res.text()) as T
    } catch (e) {
      setError(String(e))
      return null
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    const data = await request<HealthResult>('/api/healthz', 'text')
    if (data) { setHealth(data); setInspect(null) }
  }

  const checkInspect = async () => {
    const data = await request<InspectResult>('/api/inspect', 'json')
    if (data) { setInspect(data); setHealth(null) }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Dummy Frontend</h1>
      <p style={{ color: '#666' }}>Use the buttons to probe the backend API.</p>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={checkHealth} disabled={loading} style={btnStyle}>
          GET /api/healthz
        </button>
        <button onClick={checkInspect} disabled={loading} style={btnStyle}>
          GET /api/inspect
        </button>
      </div>

      {error && (
        <pre style={{ background: '#fee', color: '#c00', padding: '1rem', borderRadius: 6 }}>
          {error}
        </pre>
      )}

      {health && (
        <section>
          <h2>Health</h2>
          <pre style={preStyle}>{typeof health === 'string' ? health : JSON.stringify(health, null, 2)}</pre>
        </section>
      )}

      {inspect && (
        <>
          <section>
            <h2>Host</h2>
            <KVTable rows={{
              'Machine Name': inspect.host.machineName,
              'OS': inspect.host.osDescription,
              'OS Architecture': inspect.host.osArchitecture,
              'Process Architecture': inspect.host.processArchitecture,
              '.NET Version': inspect.host.dotnetVersion,
              'Processor Count': String(inspect.host.processorCount),
              'IP Addresses': inspect.host.ipAddresses.join(', ') || '—',
            }} />
          </section>

          <section>
            <h2>Process</h2>
            <KVTable rows={{
              'PID': String(inspect.process.pid),
              'Working Directory': inspect.process.workingDirectory,
              'Uptime': `${inspect.process.uptimeSeconds}s`,
            }} />
          </section>

          <section>
            <h2>Environment Variables</h2>
            <KVTable rows={inspect.environmentVariables} />
          </section>

          <section>
            <h2>Request Headers</h2>
            <KVTable rows={inspect.requestHeaders} />
          </section>
        </>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  borderRadius: 6,
  border: '1px solid #ccc',
  background: '#f5f5f5',
}

const preStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: '1rem',
  borderRadius: 6,
  overflowX: 'auto',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '2px solid #ddd',
  background: '#f5f5f5',
}

const tdStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
  wordBreak: 'break-all',
}

function KVTable({ rows }: { rows: Record<string, string> }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>Key</th>
          <th style={thStyle}>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(rows).map(([key, value]) => (
          <tr key={key}>
            <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}><code>{key}</code></td>
            <td style={tdStyle}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default App
