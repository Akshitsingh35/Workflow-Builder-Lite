import { useState, useEffect } from 'react';
import { healthApi } from '../services/api';

function Status() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);

    useEffect(() => {
        checkHealth();
    }, []);

    async function checkHealth() {
        try {
            setLoading(true);
            setError(null);
            const response = await healthApi.getStatus();
            setHealth(response.data);
            setLastChecked(new Date());
        } catch (err) {
            setError(err.message);
            // Still try to show partial data if available
            setHealth({
                server: 'error',
                database: 'error',
                llm: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    function StatusBadge({ status }) {
        const isOk = status === 'ok';
        return (
            <span className={`status-indicator ${isOk ? 'status-ok' : 'status-error'}`}>
                {isOk ? '● ' : '○ '}
                {status.toUpperCase()}
            </span>
        );
    }

    return (
        <div>
            <h1 className="page-title">System Status</h1>
            <p className="page-description">
                Monitor the health of server, database, and LLM services.
            </p>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    <div className="status-grid">
                        <div className="status-card">
                            <div className="status-card-title">Server</div>
                            <div className="status-card-value">
                                <StatusBadge status={health?.server || 'error'} />
                            </div>
                            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                Express.js API Server
                            </p>
                        </div>

                        <div className="status-card">
                            <div className="status-card-title">Database</div>
                            <div className="status-card-value">
                                <StatusBadge status={health?.database || 'error'} />
                            </div>
                            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                PostgreSQL via Prisma
                            </p>
                        </div>

                        <div className="status-card">
                            <div className="status-card-title">LLM Service</div>
                            <div className="status-card-value">
                                <StatusBadge status={health?.llm || 'error'} />
                            </div>
                            <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                Google Gemini (Free Tier)
                            </p>
                        </div>
                    </div>

                    <div className="card mt-2">
                        <h3 className="card-title">Health Check Details</h3>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Server Status</td>
                                    <td style={{ padding: '0.5rem 0' }}><StatusBadge status={health?.server || 'error'} /></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Database Connection</td>
                                    <td style={{ padding: '0.5rem 0' }}><StatusBadge status={health?.database || 'error'} /></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>LLM API Connection</td>
                                    <td style={{ padding: '0.5rem 0' }}><StatusBadge status={health?.llm || 'error'} /></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Last Checked</td>
                                    <td style={{ padding: '0.5rem 0' }}>
                                        {lastChecked ? lastChecked.toLocaleString() : 'Never'}
                                    </td>
                                </tr>
                                {health?.timestamp && (
                                    <tr>
                                        <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Server Timestamp</td>
                                        <td style={{ padding: '0.5rem 0' }}>
                                            {new Date(health.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card mt-2">
                        <h3 className="card-title">Environment Info</h3>
                        <table style={{ width: '100%', marginTop: '1rem' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Backend</td>
                                    <td style={{ padding: '0.5rem 0' }}>Node.js + Express</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Database</td>
                                    <td style={{ padding: '0.5rem 0' }}>PostgreSQL</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>ORM</td>
                                    <td style={{ padding: '0.5rem 0' }}>Prisma</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Frontend</td>
                                    <td style={{ padding: '0.5rem 0' }}>React + Vite</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>LLM Provider</td>
                                    <td style={{ padding: '0.5rem 0' }}>Google Gemini (Free Tier)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={checkHealth}
                            disabled={loading}
                        >
                            {loading ? 'Checking...' : 'Refresh Status'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Status;
