const { where } = require("sequelize");
const { Post } = require("../db/models");

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
}

module.exports = new BookmarksService();
