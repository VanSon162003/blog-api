module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define(
        "Comment",
        {
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            author: DataTypes.STRING,
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: "comments",
            underscored: true,
            timestamps: true,
        }
    );

    comment.associate = (db) => {
        comment.belongsTo(db.Post, {
            foreignKey: "post_id",
            as: "post",
        });
    };

    return comment;
};
