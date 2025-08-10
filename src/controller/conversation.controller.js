const conversationsService = require("../service/conversation.service");
const response = require("../utils/response");

exports.getAll = async (req, res) => {
    try {
        const conversation = await conversationsService.getAll(req.user);
        response.success(res, 200, conversation);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getOne = async (req, res) => {
    try {
        const conversation = await conversationsService.getById(
            req.params.id,
            req.user
        );
        response.success(res, 200, conversation);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getOneByName = async (req, res) => {
    try {
        const conversation = await conversationsService.getByName(
            req.params.name
        );
        response.success(res, 200, conversation);
    } catch (error) {
        response.error(res, 400, error);
    }
};

exports.create = async (req, res) => {
    const { user1, user2 } = req.body;
    try {
        const conversation = await conversationsService.create(user1, user2);

        response.success(res, 200, conversation);
    } catch (error) {
        response.error(res, 400, error);
    }
};

exports.update = async (req, res) => {
    const conversation = await conversationsService.update(
        req.params.id,
        req.body
    );

    res.json(conversation);
};

exports.remove = async (req, res) => {
    await conversationsService.remove(req.params.id);
    res.status(204).send();
};
