const { where } = require("sequelize");
const { Post, Bookmark } = require("../db/models");

class BookmarksService {
    async toggleBookmark(currentUser, postId) {
        if (!currentUser)
            throw new Error("You must be logged in to save this post.");

        const hasUserBookmark = await currentUser.hasBookmarkedPost(postId);

        if (hasUserBookmark) {
            return await currentUser.removeBookmarkedPost(postId);
        } else {
            return await currentUser.addBookmarkedPost(postId);
        }
    }

    async remove(currentUser, ids) {
        console.log(ids);

        if (!currentUser)
            throw new Error("You must be logged in to remove save all post.");

        if (!Array.isArray(ids) || ids.length === 0)
            throw new Error("No bookmark IDs provided");

        return await Bookmark.destroy({
            where: {
                id: ids,
            },
        });
    }
}

module.exports = new BookmarksService();
