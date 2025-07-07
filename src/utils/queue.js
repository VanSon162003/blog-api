const queueModel = require("@/models/queue.model");

async function dispatch(type, payload, maxRetries = null) {
    const newQueue = {
        type,
        payload: JSON.stringify(payload),
        max_retries: maxRetries,
    };

    await queueModel.create(newQueue);
}

module.exports = {
    dispatch,
};
