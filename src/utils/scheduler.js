const cron = require("node-cron");
require("module-alias/register");
require("dotenv").config();

const activeTasks = {};

function scheduleJob(name, cronTime, handler) {
    if (activeTasks[name]) {
        console.log(`Task "${name}" already scheduled. Skipping.`);
        return;
    }

    const task = cron.schedule(cronTime, () => {
        try {
            handler();
        } catch (error) {
            console.error(`Error in task "${name}":`, error);
        }
    });

    activeTasks[name] = task;
}

module.exports = scheduleJob;
