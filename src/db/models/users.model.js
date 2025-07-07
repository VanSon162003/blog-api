module.exports = (sequelize, DataTypes) => {
    const topic = sequelize.define(
        "User",
        {
            name: {
                type: DataTypes.STRING,
            },
            username: DataTypes.TEXT,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
            },
            avatar: {
                type: DataTypes.STRING,
            },
            bio: {
                type: DataTypes.TEXT,
            },
        },
        {
            tableName: "users",
            underscored: true,
            timestamps: true,
        }
    );

    return topic;
};
