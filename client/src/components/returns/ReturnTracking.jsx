import React from 'react';
import { Check } from 'lucide-react';

const ReturnTracking = ({ status, history }) => {
    const steps = [
        { id: 'requested', label: 'Requested' },
        { id: 'approved', label: 'Approved' },
        { id: 'picked_up', label: 'Picked Up' },
        { id: 'received', label: 'Received' },
        { id: 'completed', label: 'Refunded' }
    ];

    const getCurrentStepIndex = () => {
        return steps.findIndex(step => step.id === status);
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="tracking-timeline">
            {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                    <div key={step.id} className="timeline-step">
                        <div className={`step-dot ${isActive ? 'active' : ''}`}>
                            {isCompleted ? <Check size={16} /> : (index + 1)}
                        </div>
                        <div className={`step-label ${isActive ? 'active' : ''}`}>
                            {step.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReturnTracking;
