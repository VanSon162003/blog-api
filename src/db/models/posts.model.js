module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define(
        "Post",
        {
            topic_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING,
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

        post.hasMany(db.Comment, {
            foreignKey: "post_id",
            as: "comments",
        });
    };

    return post;
};
