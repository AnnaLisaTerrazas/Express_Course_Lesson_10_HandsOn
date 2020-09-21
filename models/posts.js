'use strict';
module.exports = (sequelize,DataTypes) => {
  var posts = sequelize.define(
    'posts',
    {
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        autoIncrement: true,
        primaryKey: true
      },
      PostTitle: DataTypes.STRING,
      PostBody: DataTypes.STRING,
      UserId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false
      },
      Deleted: {
        type: DataTypes.BOOLEAN,
        default: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
    },
    {}
  );
  posts.associate = function(models){
    posts.belongsTo(models.users,{foreignKey: 'UserId'})
  };
  return posts;
}