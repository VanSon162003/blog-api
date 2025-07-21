const commentsService = require("../service/comments.service");
const response = require("../utils/response");

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
        req.params.postId,
        req.user
    );
    res.json(comments);
};

exports.toggleLike = async (req, res) => {
    try {
        const result = await commentsService.toggleLike(
            req.user,
            req.params.commentId
        );
        response.success(res, 200, result);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.create = async (req, res) => {
    try {
        const comment = await commentsService.create(req.user, req.body);
        response.success(res, 200, comment);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.update = async (req, res) => {
    try {
        const comment = await commentsService.update(
            req.params.id,
            req.body,
            req.user
        );

        response.success(res, 200, comment);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.remove = async (req, res) => {
    await commentsService.remove(req.params.id);
    res.status(204).send();
};
