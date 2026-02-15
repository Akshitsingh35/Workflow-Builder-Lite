import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowApi } from '../services/api';

const STEP_TYPES = [
    { type: 'clean', description: 'Clean and normalize text', usesLLM: false },
    { type: 'summarize', description: 'Generate a concise summary', usesLLM: true },
    { type: 'extract_keypoints', description: 'Extract key points as bullet list', usesLLM: true },
    { type: 'tag_category', description: 'Assign category tags', usesLLM: true },
    { type: 'sentiment', description: 'Analyze sentiment and tone', usesLLM: true },
    { type: 'generate_title', description: 'Generate a descriptive title', usesLLM: true }
];

function CreateWorkflow() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [steps, setSteps] = useState([
        { type: 'clean' },
        { type: 'summarize' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    function addStep() {
        if (steps.length >= 4) {
            setError('Maximum 4 steps allowed');
            return;
        }
        setSteps([...steps, { type: 'summarize' }]);
        setError(null);
    }

    function removeStep(index) {
        if (steps.length <= 2) {
            setError('Minimum 2 steps required');
            return;
        }
        setSteps(steps.filter((_, i) => i !== index));
        setError(null);
    }

    function updateStep(index, type) {
        const newSteps = [...steps];
        newSteps[index] = { type };
        setSteps(newSteps);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim()) {
            setError('Workflow name is required');
            return;
        }

        if (steps.length < 2 || steps.length > 4) {
            setError('Workflow must have between 2 and 4 steps');
            return;
        }

        try {
            setLoading(true);
            const result = await workflowApi.create({ name: name.trim(), steps });
            setSuccess('Workflow created successfully!');

            // Redirect to run page after a short delay
            setTimeout(() => {
                navigate(`/run?workflowId=${result.data.id}`);
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="page-title">Create Workflow</h1>
            <p className="page-description">
                Build a workflow with 2-4 steps. Each step will process the output of the previous step.
            </p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Workflow Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter workflow name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Steps ({steps.length}/4)
                        </label>
                        <div className="step-builder">
                            {steps.map((step, index) => (
                                <div key={index} className="step-item">
                                    <span className="step-number">#{index + 1}</span>
                                    <select
                                        className="form-select"
                                        value={step.type}
                                        onChange={(e) => updateStep(index, e.target.value)}
                                    >
                                        {STEP_TYPES.map(st => (
                                            <option key={st.type} value={st.type}>
                                                {st.type} - {st.description} {st.usesLLM ? '(LLM)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="btn btn-danger btn-icon"
                                        disabled={steps.length <= 2}
                                        title="Remove step"
                                    >
                                        −
                                    </button>
                                </div>
                            ))}
                        </div>

                        {steps.length < 4 && (
                            <button
                                type="button"
                                onClick={addStep}
                                className="btn btn-secondary"
                            >
                                + Add Step
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <h3 style={{ marginBottom: '0.5rem' }}>Workflow Preview</h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            padding: '1rem',
                            background: 'var(--background-color)',
                            borderRadius: 'var(--border-radius)'
                        }}>
                            <span style={{ fontWeight: 500 }}>Input</span>
                            {steps.map((step, index) => (
                                <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>→</span>
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
                            <span>→</span>
                            <span style={{ fontWeight: 500 }}>Output</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Workflow'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateWorkflow;
