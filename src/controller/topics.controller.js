const topicsService = require("../service/topics.service");
const response = require("../utils/response");
exports.getList = async (req, res) => {
    try {
        const topics = await topicsService.getAll();

        response.success(res, 200, topics);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getBySlug = async (req, res) => {
    try {
        const topic = await topicsService.getBySlug(req.params.slug);
        response.success(res, 200, topic);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getOne = async (req, res) => {
    const topic = await topicsService.getById(req.params.id);
    res.json(topic);
};

exports.create = async (req, res) => {
    const topic = await topicsService.create(req.body);
    res.json(topic);
};

exports.update = async (req, res) => {
    const topic = await topicsService.update(req.params.id, req.body);

    res.json(topic);
};

exports.remove = async (req, res) => {
    await topicsService.remove(req.params.id);
    res.status(204).send();
};
