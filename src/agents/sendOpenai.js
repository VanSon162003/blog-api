const { where } = require("sequelize");
const { Agent } = require("../db/models");
const openai = require("../utils/openai");

async function SendOpenai(agentIntent, messages) {
    console.log(messages);

    const agent = await Agent.findOne({
        where: {
            pattern: agentIntent,
        },
    });

    const result = await openai.send({
        input: [
            {
                role: "system",
                content: agent.system_prompt,
            },
            ...messages,
        ],
    });

    return JSON.parse(result);
}
module.exports = SendOpenai;
