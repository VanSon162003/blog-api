const { where } = require("sequelize");
const { Agent } = require("../db/models");

async function ContentSearch(agentIntent) {
    const agent = await Agent.findOne({
        where: {
            pattern: agentIntent,
        },
    });

    return agent;
}
module.exports = ContentSearch;
