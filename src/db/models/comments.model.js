module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define(
        "Comment",
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
            post_id: {
                type: DataTypes.INTEGER({ unsigned: true }),
                allowNull: false,
                references: {
                    model: "posts",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            parent_id: {
                type: DataTypes.INTEGER({ unsigned: true }),
                defaultValue: null,
                references: {
                    model: "comments",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            deleted_at: {
                type: DataTypes.DATE,
                defaultValue: null,
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

        comment.belongsTo(db.User, {
            foreignKey: "user_id",
            as: "user",
        });
        comment.hasMany(db.Like, {
            foreignKey: "likeable_id",
            constraints: false,
            scope: {
                likeable_type: "comment",
            },
            as: "likes",
        });
    };

    return comment;
};
