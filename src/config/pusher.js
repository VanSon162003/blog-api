const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1",
    key: "app1",
    secret: "app1-secret-key",
    useTLS: false,
    cluster: "",
    host: "103.20.97.228",
    port: 6001,
});

module.exports = pusher;
