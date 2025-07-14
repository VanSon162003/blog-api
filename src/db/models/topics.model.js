module.exports = (sequelize, DataTypes) => {
    const topic = sequelize.define(
        "Topic",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                defaultValue: null,
            },
            description: {
                type: DataTypes.TEXT,
                defaultValue: null,
            },
            posts_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: "topics",
            underscored: true,
            timestamps: true,
        }
    );

    topic.associate = (db) => {
        topic.belongsToMany(db.Post, {
            through: "post_topic",
            foreignKey: "topic_id",
            otherKey: "post_id",
            as: "posts",
        });
    };

    return topic;
};
