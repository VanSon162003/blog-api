module.exports = (sequelize, DataTypes) => {
    const conversation = sequelize.define(
        "Conversation",
        {
            name: {
                type: DataTypes.STRING(50),
            },
            avatar: {
                type: DataTypes.STRING(255),
                defaultValue: null,
            },
            last_message_at: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "conversations",
            underscored: true,
            timestamps: true,
        }
    );

    conversation.associate = (db) => {
        conversation.belongsToMany(db.User, {
            through: "user_conversation",
            foreignKey: "conversation_id",
            otherKey: "user_id",
            as: "users",
        });

        conversation.hasMany(db.Message, {
            foreignKey: "conversation_id",
            as: "messages",
        });
    };

    return conversation;
};
