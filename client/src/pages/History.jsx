import { useState, useEffect } from 'react';
import { runApi } from '../services/api';

function History() {
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRun, setExpandedRun] = useState(null);

    useEffect(() => {
        loadRuns();
    }, []);

    async function loadRuns() {
        try {
            setLoading(true);
            const response = await runApi.getHistory(5);
            setRuns(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    function formatStepName(stepName) {
        return stepName.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function toggleExpand(runId) {
        setExpandedRun(expandedRun === runId ? null : runId);
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Run History</h1>
            <p className="page-description">
                View your last 5 workflow runs.
            </p>

            {error && <div className="error-message">{error}</div>}

            {runs.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <p>No workflow runs yet.</p>
                        <p className="text-muted mt-1">Run a workflow to see results here.</p>
                    </div>
                </div>
            ) : (
                <div className="history-list">
                    {runs.map(run => (
                        <div key={run.id} className="history-item">
                            <div
                                className="history-item-header"
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleExpand(run.id)}
                            >
                                <span className="history-item-workflow">
                                    {run.workflowName}
                                </span>
                                <span className="history-item-date">
                                    {formatDate(run.createdAt)}
                                </span>
                            </div>

                            <div className="history-item-input">
                                <strong>Input:</strong> {run.inputText}
                            </div>

                            <div className="history-item-meta">
                                <span>
                                    {run.stepOutputs.length} steps
                                </span>
                                <span>•</span>
                                <span>
                                    {run.totalExecutionTimeMs}ms total
                                </span>
                                <span style={{ marginLeft: 'auto', color: 'var(--primary-color)' }}>
                                    {expandedRun === run.id ? '▲ Hide details' : '▼ Show details'}
                                </span>
                            </div>

                            {expandedRun === run.id && (
                                <div style={{ marginTop: '1rem' }}>
                                    {run.stepOutputs.map((stepOutput, index) => (
                                        <div key={index} className="step-output-card">
                                            <div className="step-output-header">
                                                <span className="step-output-title">
                                                    Step {index + 1}: {formatStepName(stepOutput.step)}
                                                </span>
                                                <span className="step-output-time">
                                                    {stepOutput.executionTimeMs}ms
                                                </span>
                                            </div>
                                            <div className="step-output-content">
                                                {stepOutput.output}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '1rem' }}>
                <button
                    className="btn btn-secondary"
                    onClick={loadRuns}
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>
        </div>
    );
}

export default History;
