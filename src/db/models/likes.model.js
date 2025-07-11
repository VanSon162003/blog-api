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
        },
        {
            tableName: "likes",
            underscored: true,
            timestamps: true,
        }
    );

    return like;
};
