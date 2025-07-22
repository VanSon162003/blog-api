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

exports.getListByMe = async (req, res) => {
    try {
        const posts = await postsService.getListByMe(req.user);

        response.success(res, 200, posts);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getBySlug = async (req, res) => {
    try {
        const posts = await postsService.getBySlug(req.params.slug, req.user);

        response.success(res, 200, posts);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};

exports.getByUserName = async (req, res) => {
    try {
        const posts = await postsService.getByUserName(
            req.params.username,
            req.user
        );

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

exports.getListByUserId = async (req, res) => {
    try {
        const posts = await postsService.getBookmarkedPostsByUser(req.user);
        response.success(res, 200, posts);
    } catch (err) {
        response.error(res, 400, err.message);
    }
};

exports.getRelatedPosts = async (req, res) => {
    try {
        const posts = await postsService.getRelatedPosts(
            req.params.postId,
            req.user
        );

        response.success(res, 200, posts);
    } catch (err) {
        response.error(res, 400, err.message);
    }
};

exports.create = async (req, res) => {
    try {
        const post = await postsService.create(req.file, req.body, req.user);
        response.success(res, 200, post);
    } catch (error) {
        response.error(res, 400, error.message);
    }
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
