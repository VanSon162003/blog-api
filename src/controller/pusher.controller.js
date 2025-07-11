const pusher = require("../config/pusher");
const postsService = require("../service/posts.service");

exports.sendMessage = async (req, res) => {
    pusher.trigger(req.body.chanel, "new-message", {
        message: req.body.message,
    });
    res.send("oke");
};

exports.getAll = async (req, res) => {
    const post = await postsService.getById(req.params.id);
    res.json(post);
};

// exports.create = async (req, res) => {
//     const post = await postsService.create(req.body);
//     res.json(post);
// };

// exports.update = async (req, res) => {
//     const post = await postsService.update(req.params.id, req.body);

//     res.json(post);
// };

// exports.remove = async (req, res) => {
//     await postsService.remove(req.params.id);
//     res.status(204).send();
// };
