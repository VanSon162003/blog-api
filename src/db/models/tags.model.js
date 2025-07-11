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

    return tag;
};
