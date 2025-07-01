const topicsService = require("../service/topics.service");
exports.getList = async (req, res) => {
    const topics = await topicsService.getAll();
    res.json({ data: topics });
};

exports.getBySlug = async (req, res) => {
    const topic = await topicsService.getBySlug(req.params.slug);
    res.json(topic);
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
