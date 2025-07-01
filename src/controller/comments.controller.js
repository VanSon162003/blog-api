const commentsService = require("../service/comments.service");
exports.getList = async (req, res) => {
    const comments = await commentsService.getAll();
    res.json({ data: comments });
};

exports.getBySlug = async (req, res) => {
    const comment = await commentsService.getBySlug(req.params.slug);
    res.json(comment);
};

exports.getOne = async (req, res) => {
    const comment = await commentsService.getById(req.params.id);
    res.json(comment);
};

exports.getAllCommentsInPost = async (req, res) => {
    const comments = await commentsService.getAllCommentsInPost(
        req.params.postId
    );
    res.json(comments);
};

exports.create = async (req, res) => {
    console.log(req.body);

    const comment = await commentsService.create(req.body);
    res.json(comment);
};

exports.update = async (req, res) => {
    const comment = await commentsService.update(req.params.id, req.body);

    res.json(comment);
};

exports.remove = async (req, res) => {
    await commentsService.remove(req.params.id);
    res.status(204).send();
};
