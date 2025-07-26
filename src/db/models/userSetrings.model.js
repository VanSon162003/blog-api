module.exports = (sequelize, DataTypes) => {
    const userSetting = sequelize.define(
        "UserSetting",
        {
            user_id: {
                type: DataTypes.INTEGER({ unsigned: true }),
                allowNull: false,
                unique: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            data: {
                type: DataTypes.TEXT,
                defaultValue: null,
            },
        },
        {
            tableName: "user_setting",
            underscored: true,
            timestamps: true,
        }
    );

    userSetting.associate = (db) => {
        userSetting.belongsTo(db.User, { foreignKey: "user_id" });
    };

    return userSetting;
};
