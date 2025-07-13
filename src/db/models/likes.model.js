module.exports = (sequelize, DataTypes) => {
    const like = sequelize.define(
        "Like",
        {
            user_id: {
                type: DataTypes.INTEGER({ unsigned: true }),
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            likeable_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            likeable_id: {
                type: DataTypes.INTEGER({ unsigned: true }),
                allowNull: false,
            },

            is_like: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: "likes",
            underscored: true,
            timestamps: true,
        }
    );

    like.associate = (db) => {
        like.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
        like.belongsTo(db.Post, {
            foreignKey: "likeable_id",
            constraints: false,
            as: "post",
            scope: {
                likeable_type: "post",
            },
        });

        like.belongsTo(db.Comment, {
            foreignKey: "likeable_id",
            constraints: false,
            as: "comment",
            scope: {
                likeable_type: "comment",
            },
        });
    };

    return like;
};
