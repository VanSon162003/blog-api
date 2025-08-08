const { where } = require("sequelize");
const {
    User,
    Queue,
    UserSetting,
    UserNotification,
    Notification,
} = require("../db/models");
const validator = require("validator");
const pusher = require("../config/pusher");
const pusherService = require("./pusher.service");

class UsersService {
    canUserViewProfile(currentUser, targetUser, followingIds = []) {
        const profileVisibility = this.getUserProfileVisibility(targetUser);

        if (!currentUser) {
            return {
                canView: profileVisibility === "public",
                type: profileVisibility,
            };
        }

        if (targetUser.id === currentUser.id) {
            return {
                canView: true,
                type: "self",
            };
        }

        if (profileVisibility === "public") {
            return {
                canView: true,
                type: "public",
            };
        }

        if (profileVisibility === "followers") {
            return {
                canView: followingIds.includes(currentUser.id),
                type: "followers",
            };
        }

        if (profileVisibility === "private") {
            return {
                canView: false,
                type: "private",
            };
        }

        return {
            canView: false,
            type: "unknown",
        };
    }

    getUserProfileVisibility(user) {
        try {
            if (user.settings && user.settings.data) {
                const settingsData = JSON.parse(user.settings.data);
                return settingsData.profileVisibility || "public";
            }
            return "public";
        } catch (error) {
            console.log("Error parsing user settings:", error);
            return "public";
        }
    }

    async getUserFollowingIds(currentUser) {
        try {
            if (!currentUser) return [];

            const userFollowing = await User.findByPk(currentUser.id, {
                include: {
                    model: User,
                    as: "following",
                    attributes: ["id"],
                    through: { attributes: [] },
                },
            });

            if (!userFollowing || !userFollowing.following) {
                return [];
            }

            const ids = userFollowing.following.map((item) => item.id);
            return ids;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getUserByUsername(username, currentUser = null) {
        try {
            const user = await User.findOne({
                where: {
                    username,
                },
                include: [
                    {
                        model: UserSetting,
                        as: "settings",
                        required: false,
                    },
                    {
                        model: User,
                        as: "followers",
                        attributes: ["id"],
                    },
                ],
            });

            if (!user) {
                throw new Error("User does not exist");
            }

            const followerIds = user?.followers.map((item) => item.id);

            const result = this.canUserViewProfile(
                currentUser,
                user,
                followerIds
            );

            if (!result.canView) {
                console.log(result);

                return {
                    id: user.id,
                    username: user.username,
                    title: user.title,
                    avatar: user.avatar,
                    fullname: user.fullname,
                    canView: false,
                    type: result.type,
                    follower_count: user.follower_count,
                    following_count: user.following_count,
                };
            }

            // Trả về user data nếu có quyền xem
            return user;
        } catch (error) {
            throw error;
        }
    }

    async toggleFollow(currentUser, userId) {
        if (!currentUser)
            throw new Error("You must be logged in to follow someone.");
        if (currentUser.id === userId)
            throw new Error("You cannot follow yourself");

        const userFollowing = await User.findOne({
            where: { id: currentUser.id },
        });

        const userFollower = await User.findOne({
            where: { id: userId },
            include: {
                model: UserSetting,
                as: "settings",
                required: false,
            },
        });

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

            try {
                const settings = JSON.parse(userFollower.settings.data);
                if (settings) {
                    if (settings.emailNewFollowers) {
                        await Queue.create({
                            type: "sendNewFollowerJob",
                            payload: {
                                following: userFollower,
                                follower: userFollowing,
                            },
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }

            await pusherService.follow(
                { recipientId: userFollower.id },
                userFollowing
            );

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
            return await currentUser.update(newData);
        } catch (error) {
            throw new Error(error);
        }
    }

    async settings(data, currentUser) {
        if (!currentUser)
            throw new Error("You must be logged to edit settings");

        const { email, ...settings } = data;

        if (email !== currentUser.email) {
            if (email && !validator.isEmail(email)) {
                throw new Error("Invalid email address");
            }

            await currentUser.update({ verified_at: null, email });

            await Queue.create({
                type: "sendVerifyEmailJob",
                payload: { userId: currentUser.id },
            });
        }

        const user = await UserSetting.findOne({
            where: {
                user_id: currentUser.id,
            },
        });

        if (user) {
            user.data = JSON.stringify(settings);
            await user.save();
        } else {
            await UserSetting.create({
                user_id: currentUser.id,
                data: JSON.stringify(settings),
            });
        }
    }

    async notifications(notificationIds, currentUser) {
        if (!currentUser)
            throw new Error("You must be logged to edit settings");
        console.log(notificationIds);

        const result = await UserNotification.update(
            {
                read_at: Date.now(),
            },
            {
                where: {
                    user_id: currentUser.id,
                    notification_id: notificationIds,
                },
            }
        );

        console.log(result);
    }
}

module.exports = new UsersService();
