module.exports = (sequelize, DataTypes) => {
    const topic = sequelize.define(
        "Topic",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: DataTypes.TEXT,
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "topics",
            underscored: true,
            timestamps: true,
        }
    );

    topic.associate = (db) => {
        topic.hasMany(db.Post, {
            foreignKey: "topic_id",
            as: "posts",
        });
    };

    return topic;
};
