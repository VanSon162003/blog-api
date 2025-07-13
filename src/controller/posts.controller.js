const postsService = require("../service/posts.service");

exports.getList = async (req, res) => {
    const { posts } = await postsService.getAll();

    res.json({ data: posts });
};

exports.create = async (req, res) => {
    const post = await postsService.create(req.body);
    res.json(post);
};

exports.update = async (req, res) => {
    const post = await postsService.update(req.params.id, req.body);

    res.json(post);
};

exports.remove = async (req, res) => {
    await postsService.remove(req.params.id);
    res.status(204).send();
};
