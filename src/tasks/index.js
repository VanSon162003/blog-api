const scheduleJob = require("../utils/scheduler");
const retrySendFailEmail = require("./retrySendFailEmail");

// task 2: Retry email lỗi mỗi 5 phút
scheduleJob("retry_report_email", "* * * * *", retrySendFailEmail);
