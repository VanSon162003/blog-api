const messagesService = require("../service/messages.service");
exports.getOneByName = async (req, res) => {
    console.log(req.params.name);

    const message = await messagesService.getByName(req.params.name);
    res.json({ data: message });
};

exports.getByConversationId = async (req, res) => {
    const message = await messagesService.getByConversationId(req.params.id);
    res.json({ data: message });
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
