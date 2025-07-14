const postsService = require("../service/posts.service");
const response = require("../utils/response");

exports.getList = async (req, res) => {
    try {
        const posts = await postsService.getAll(req.user);

        response.success(res, 200, posts);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getListByTopicId = async (req, res) => {
    try {
        const posts = await postsService.getListByTopicId(
            req.user,
            req.params.topicId
        );

        response.success(res, 200, posts);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.create = async (req, res) => {
    const post = await postsService.create(req.body);
    res.json(post);
};

exports.toggleLike = async (req, res) => {
    try {
        const result = await postsService.toggleLike(
            req.user,
            req.params.postId
        );
        response.success(res, 200, result);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.update = async (req, res) => {
    const post = await postsService.update(req.params.id, req.body);

    res.json(post);
};

exports.remove = async (req, res) => {
    await postsService.remove(req.params.id);
    res.status(204).send();
};
