module.exports = (sequelize, DataTypes) => {
    const tag = sequelize.define(
        "Tag",
        {
            name: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
            },
        },
        {
            tableName: "tags",
            underscored: true,
            timestamps: true,
        }
    );

    tag.associate = (db) => {
        tag.belongsToMany(db.Post, {
            through: "post_tag",
            foreignKey: "tag_id",
            otherKey: "post_id",
            as: "posts",
        });
    };

    return tag;
};
