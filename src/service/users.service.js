const { where } = require("sequelize");
const { User } = require("../db/models");

class UsersService {
    async getUserByUsername(username) {
        const user = await User.findOne({
            where: {
                username,
            },
        });

        if (!user) throw new Error("User does not exits");
        return user;
    }

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
                (userFollower.follower_count ?? 0) - 1
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

    async editProfile(avatarOrCoverPath, data, currentUser) {
        if (!currentUser) throw new Error("You must be logged to edit");

        const updateData = {};

        if (avatarOrCoverPath) {
            if (avatarOrCoverPath.avatar?.[0].path != null)
                updateData.avatar = avatarOrCoverPath.avatar?.[0].path.replace(
                    /\\/g,
                    "/"
                ); // normalize path
            if (avatarOrCoverPath.cover_image?.[0].path != null)
                updateData.cover_image =
                    avatarOrCoverPath.cover_image?.[0].path.replace(/\\/g, "/");
        }

        const newData = { ...updateData, ...data };

        try {
            return await User.update(newData, {
                where: { id: currentUser.id },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new UsersService();
