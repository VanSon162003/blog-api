const likesService = require("../service/likes.service");

exports.create = async (req, res) => {
    const like = await likesService.create(req.body);
    res.json(like);
};

exports.update = async (req, res) => {
    const like = await likesService.update(req.params.userId, req.body);

    res.json(like);
};
