module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define(
        "Post",
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
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            thumbnail: {
                type: DataTypes.STRING,
                defaultValue: null,
            },
            description: {
                type: DataTypes.TEXT,
                defaultValue: null,
            },
            meta_title: {
                type: DataTypes.STRING,
                defaultValue: null,
            },
            meta_description: {
                type: DataTypes.TEXT,
                defaultValue: null,
            },
            content: {
                type: DataTypes.TEXT,
                defaultValue: null,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "draft",
            },
            visibility: {
                type: DataTypes.STRING,
                defaultValue: "public",
            },
            views_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            likes_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            published_at: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "posts",
            underscored: true,
            timestamps: true,
        }
    );

    post.associate = (db) => {
        post.belongsTo(db.Topic, {
            foreignKey: "topic_id",
            as: "topic",
        });
        post.belongsTo(db.User, {
            foreignKey: "user_id",
            as: "user",
        });

        post.hasMany(db.Comment, {
            foreignKey: "post_id",
            as: "comments",
        });
    };

    return post;
};
