module.exports = (sequelize, DataTypes) => {
    const agent = sequelize.define(
        "Agent",
        {
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            pattern: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            system_prompt: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            tableName: "agents",
            underscored: true,
            timestamps: true,
        }
    );

    return agent;
};
