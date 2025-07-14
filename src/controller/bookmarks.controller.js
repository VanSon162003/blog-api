const bookmarksService = require("../service/bookmarks.service");
const response = require("../utils/response");
exports.create = async (req, res) => {
    try {
        const bookmark = await bookmarksService.toggleBookmark(
            req.user,
            +req.params.postId
        );

        response.success(res, 200, bookmark);
    } catch (error) {
        response.error(res, 400, error.message);
    }
};
