const { where } = require("sequelize");
const { Like, Post } = require("../db/models");

class LikesService {
    async getAll(type, id) {
        const likes = await Like.findAll({
            where: {
                likeable_type: type,
                likeable_id: id,
            },
        });
        return likes;
    }

    async create(data) {
        const like = await Like.create(data);
        return like;
    }

    async update(user_id, data) {
        try {
            const like = await Like.findOne({
                where: {
                    user_id,
                    likeable_type: data.likeable_type,
                    likeable_id: data.likeable_id,
                },
            });

            if (!like) {
                throw new Error("Không tìm thấy bản ghi like");
            }

            like.is_like = data.is_like;
            await like.save();

            return like;
        } catch (error) {
            console.log("Lỗi khi update: ", error.message);
            return null;
        }
    }

    async checkLike(data) {
        const like = await Like.create(data);
        return like;
    }

    async remove(id, type) {
        await Like.destroy({
            where: { user_id: id, likeable_type: type },
        });

        return null;
    }
}

module.exports = new LikesService();
