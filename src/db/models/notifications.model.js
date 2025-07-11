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

    return notification;
};
