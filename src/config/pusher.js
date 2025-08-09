const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1",
    key: "app1",
    secret: "app1-secret-key",
    useTLS: process.env.USETLS,
    cluster: "",
    host: process.env.HOST,
    port: process.env.PORT,
});

module.exports = pusher;
