import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { workflowApi } from '../services/api';

function Home() {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWorkflows();
    }, []);

    async function loadWorkflows() {
        try {
            setLoading(true);
            const result = await workflowApi.getAll();
            setWorkflows(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this workflow?')) {
            return;
        }

        try {
            await workflowApi.delete(id);
            setWorkflows(workflows.filter(w => w.id !== id));
        } catch (err) {
            setError(err.message);
        }
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
            <h1 className="page-title">Workflow Builder Lite</h1>
            <p className="page-description">
                Create and run automated text processing workflows using AI.
            </p>

            {error && <div className="error-message">{error}</div>}

            <div className="grid-2">
                <div>
                    <div className="card">
                        <h2 className="card-title">Quick Actions</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <Link to="/create" className="btn btn-primary">
                                Create Workflow
                            </Link>
                            <Link to="/run" className="btn btn-secondary">
                                Run Workflow
                            </Link>
                        </div>
                    </div>

                    <div className="card mt-2">
                        <h2 className="card-title">Your Workflows</h2>
                        {workflows.length === 0 ? (
                            <div className="empty-state">
                                <p>No workflows yet.</p>
                                <Link to="/create" className="btn btn-primary mt-2">
                                    Create Your First Workflow
                                </Link>
                            </div>
                        ) : (
                            <div style={{ marginTop: '1rem' }}>
                                {workflows.map(workflow => (
                                    <div key={workflow.id} className="step-item">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{workflow.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                {workflow.steps.length} steps • {workflow._count?.runs || 0} runs
                                            </div>
                                        </div>
                                        <Link
                                            to={`/run?workflowId=${workflow.id}`}
                                            className="btn btn-secondary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        >
                                            Run
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(workflow.id)}
                                            className="btn btn-danger btn-icon"
                                            title="Delete workflow"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h2 className="card-title">Available Step Types</h2>
                        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                            <li><strong>clean</strong> - Remove extra whitespace and normalize text</li>
                            <li><strong>summarize</strong> - Generate a concise summary</li>
                            <li><strong>extract_keypoints</strong> - Extract key points as bullet list</li>
                            <li><strong>tag_category</strong> - Assign category tags</li>
                            <li><strong>sentiment</strong> - Analyze sentiment and tone</li>
                            <li><strong>generate_title</strong> - Generate a descriptive title</li>
                        </ul>
                    </div>

                    <div className="card mt-2">
                        <h2 className="card-title">How It Works</h2>
                        <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                            <li>Create a workflow with 2-4 steps</li>
                            <li>Each step processes the output of the previous step</li>
                            <li>Run the workflow with your input text</li>
                            <li>View the output of each step</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
