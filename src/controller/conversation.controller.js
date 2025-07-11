const conversationsService = require("../service/conversation.service");
exports.getOneByName = async (req, res) => {
    console.log(req.params.name);

    const conversation = await conversationsService.getByName(req.params.name);
    res.json({ data: conversation });
};

// exports.getBySlug = async (req, res) => {
//     const post = await postsService.getBySlug(req.params.slug);
//     res.json(post);
// };

// exports.getOne = async (req, res) => {
//     const post = await postsService.getById(req.params.id);
//     res.json(post);
// };

// exports.countAllPostsInTopic = async (req, res) => {
//     const count = await postsService.countAllPostsInTopic(req.params.topicId);
//     res.json(count);
// };

// exports.getAllCommentsInPost = async (req, res) => {
//     const count = await postsService.getAllCommentsInPost(req.params.topicId);
//     res.json(count);
// };

// exports.create = async (req, res) => {
//     const post = await postsService.create(req.body);
//     res.json(post);
// };

// exports.update = async (req, res) => {
//     const post = await postsService.update(req.params.id, req.body);

//     res.json(post);
// };

// exports.remove = async (req, res) => {
//     await postsService.remove(req.params.id);
//     res.status(204).send();
// };
