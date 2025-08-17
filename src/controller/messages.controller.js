const messagesService = require("../service/messages.service");
const response = require("../utils/response");
exports.getOneByName = async (req, res) => {
    console.log(req.params.name);

    const message = await messagesService.getByName(req.params.name);
    res.json({ data: message });
};

exports.getByConversationId = async (req, res) => {
    const message = await messagesService.getByConversationId(req.params.id);
    res.json({ data: message });
};

exports.create = async (req, res) => {
    try {
        const message = await messagesService.create(req.body, req.user);
        response.success(res, 201, message);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

// exports.update = async (req, res) => {
//     const message = await messagesService.update(req.params.id, req.body);

//     res.json(message);
// };

// exports.remove = async (req, res) => {
//     await messagesService.remove(req.params.id);
//     res.status(204).send();
// };
