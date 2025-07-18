const { where } = require("sequelize");
const { User } = require("../db/models");

class UsersService {
    async toggleFollow(currentUser, userId) {
        if (!currentUser)
            throw new Error("You must be logged in to follow someone.");
        if (currentUser.id === userId)
            throw new Error("You cannot follow yourself");

        const userFollowing = await User.findOne({
            where: { id: currentUser.id },
        });
        const userFollower = await User.findOne({ where: { id: userId } });

        const hasFollowingUser = await currentUser.hasFollowing(userId);

        if (hasFollowingUser) {
            userFollowing.following_count = Math.max(
                0,
                (userFollowing.following_count ?? 0) - 1
            );
            userFollower.follower_count = Math.max(
                0,
                (userFollowing.follower_count ?? 0) - 1
            );

            await userFollower.save();
            await userFollowing.save();
            return await currentUser.removeFollowing(userId);
        } else {
            userFollowing.following_count = userFollowing.following_count + 1;
            userFollower.follower_count = userFollower.follower_count + 1;

            await userFollower.save();
            await userFollowing.save();
            return await currentUser.addFollowing(userId);
        }
    }

    async checkFollowing(currentUser, userId) {
        if (!currentUser)
            throw new Error("You must be logged in to perform this check.");
        const userFollows = await User.findAll({
            where: { id: userId },
            include: [
                { model: User, as: "followers", where: { id: currentUser.id } },
            ],
        });

        if (userFollows.length === 0) return false;

        return true;
    }
}

module.exports = new UsersService();
