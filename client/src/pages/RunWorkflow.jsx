import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { workflowApi, runApi } from '../services/api';

function RunWorkflow() {
    const [searchParams] = useSearchParams();
    const preselectedWorkflowId = searchParams.get('workflowId');

    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState(preselectedWorkflowId || '');
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingWorkflows, setLoadingWorkflows] = useState(true);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        loadWorkflows();
    }, []);

    async function loadWorkflows() {
        try {
            setLoadingWorkflows(true);
            const response = await workflowApi.getAll();
            setWorkflows(response.data);

            // Set preselected workflow if available
            if (preselectedWorkflowId && response.data.find(w => w.id === preselectedWorkflowId)) {
                setSelectedWorkflowId(preselectedWorkflowId);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingWorkflows(false);
        }
    }

    async function handleRun(e) {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!selectedWorkflowId) {
            setError('Please select a workflow');
            return;
        }

        if (!inputText.trim()) {
            setError('Input text cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const response = await runApi.execute(selectedWorkflowId, inputText.trim());
            setResult(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function formatStepName(stepName) {
        return stepName.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    if (loadingWorkflows) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Run Workflow</h1>
            <p className="page-description">
                Select a workflow and provide input text to process.
            </p>

            {error && <div className="error-message">{error}</div>}

            {workflows.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <p>No workflows available.</p>
                        <Link to="/create" className="btn btn-primary mt-2">
                            Create Your First Workflow
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid-2">
                    <div>
                        <div className="card">
                            <form onSubmit={handleRun}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="workflow">
                                        Select Workflow
                                    </label>
                                    <select
                                        id="workflow"
                                        className="form-select"
                                        value={selectedWorkflowId}
                                        onChange={(e) => setSelectedWorkflowId(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose a workflow...</option>
                                        {workflows.map(workflow => (
                                            <option key={workflow.id} value={workflow.id}>
                                                {workflow.name} ({workflow.steps.length} steps)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedWorkflowId && (
                                    <div className="form-group">
                                        <label className="form-label">Workflow Steps</label>
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            flexWrap: 'wrap',
                                            padding: '0.75rem',
                                            background: 'var(--background-color)',
                                            borderRadius: 'var(--border-radius)'
                                        }}>
                                            {workflows.find(w => w.id === selectedWorkflowId)?.steps.map((step, index) => (
                                                <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {index > 0 && <span>→</span>}
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: 'var(--primary-color)',
                                                        color: 'white',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {step.type}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label" htmlFor="inputText">
                                        Input Text
                                    </label>
                                    <textarea
                                        id="inputText"
                                        className="form-textarea"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Enter the text you want to process..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Run Workflow'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div>
                        {loading && (
                            <div className="card">
                                <div className="loading">
                                    <div className="spinner"></div>
                                </div>
                                <p className="text-center text-muted">Processing your workflow...</p>
                            </div>
                        )}

                        {result && (
                            <div>
                                <div className="card">
                                    <h2 className="card-title">Results</h2>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '1rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <span>Workflow: {result.workflowName}</span>
                                        <span>Total Time: {result.totalExecutionTimeMs}ms</span>
                                    </div>
                                </div>

                                {result.stepOutputs.map((stepOutput, index) => (
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
                </div>
            )}
        </div>
    );
}

export default RunWorkflow;
