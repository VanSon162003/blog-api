module.exports = (sequelize, DataTypes) => {
    const notification = sequelize.define(
        "Notification",
        {
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,
            },
            link: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
            },
            notifiable_type: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            notifiable_id: {
                type: DataTypes.INTEGER({ unsigned: true }),
                allowNull: false,
            },
        },
        {
            tableName: "notifications",
            underscored: true,
            timestamps: true,
        }
    );

    notification.associate = (db) => {
        notification.belongsToMany(db.User, {
            through: db.UserNotification,
            foreignKey: "notification_id",
            otherKey: "user_id",
            as: "users",
        });
    };

    return notification;
};
