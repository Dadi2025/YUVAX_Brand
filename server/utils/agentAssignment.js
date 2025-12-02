import Agent from '../models/Agent.js';

/**
 * Auto-assign delivery agent based on PIN code
 * @param {String} pinCode - Delivery PIN code
 * @returns {Object|null} - Assigned agent or null
 */
export const assignAgentByPinCode = async (pinCode) => {
    try {
        // Find active agents covering this PIN code
        const agents = await Agent.find({
            pinCodes: pinCode,
            isActive: true
        }).sort({ assignedOrders: 1, rating: -1 }); // Sort by workload (ascending) and rating (descending)

        if (agents.length === 0) {
            console.log(`No agents available for PIN code: ${pinCode}`);
            return null;
        }

        // Select the agent with lowest workload and highest rating
        const selectedAgent = agents[0];

        // Increment assigned orders count
        selectedAgent.assignedOrders += 1;
        await selectedAgent.save();

        console.log(`Agent ${selectedAgent.name} assigned for PIN code: ${pinCode}`);
        return selectedAgent;
    } catch (error) {
        console.error('Agent assignment error:', error);
        return null;
    }
};

/**
 * Mark order as completed for agent
 * @param {String} agentId - Agent ID
 */
export const markOrderCompleted = async (agentId) => {
    try {
        const agent = await Agent.findById(agentId);
        if (agent) {
            agent.assignedOrders = Math.max(0, agent.assignedOrders - 1);
            agent.completedOrders += 1;
            await agent.save();
            console.log(`Order completed for agent: ${agent.name}`);
        }
    } catch (error) {
        console.error('Mark order completed error:', error);
    }
};

/**
 * Reassign order to different agent
 * @param {String} oldAgentId - Current agent ID
 * @param {String} newAgentId - New agent ID
 */
export const reassignAgent = async (oldAgentId, newAgentId) => {
    try {
        if (oldAgentId) {
            const oldAgent = await Agent.findById(oldAgentId);
            if (oldAgent) {
                oldAgent.assignedOrders = Math.max(0, oldAgent.assignedOrders - 1);
                await oldAgent.save();
            }
        }

        if (newAgentId) {
            const newAgent = await Agent.findById(newAgentId);
            if (newAgent) {
                newAgent.assignedOrders += 1;
                await newAgent.save();
            }
        }
    } catch (error) {
        console.error('Reassign agent error:', error);
    }
};
