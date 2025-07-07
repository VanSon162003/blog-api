require("dotenv").config();
require("module-alias/register");
const sendVerifyEmailJob = require("@/job/sendVerifyEmailJob");
const queueModel = require("@/models/queue.model");

const handlers = {
    sendVerifyEmailJob,
};

async function jobProcess(job) {
    const handler = handlers[job.type];
    if (handler) {
        try {
            await queueModel.update(job.id, { status: "processing" });
            await handler(job);
            await queueModel.update(job.id, { status: "completed" });
        } catch (error) {
            if (job.max_retries > job.retries_count) {
                await queueModel.update(job.id, {
                    status: "pending",
                    retries_count: job.retries_count + 1,
                    retried_at: new Date(Date.now() + 5000),
                });
            } else {
                await queueModel.update(job.id, {
                    status: "failed",
                });
            }
        }
    }
}

async function queueWorker() {
    while (true) {
        const jobs = await queueModel.findPendingJobs();
        for (let job of jobs) {
            await jobProcess(job);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

queueWorker();
