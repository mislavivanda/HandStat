'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mjestodvorana extends Model {
   
    static associate(models) {
    this.hasMany(models.utakmica,{foreignKey:'mjesto_id'});
    }
  };
  mjestodvorana.init({
    dvorana: DataTypes.STRING,
    mjesto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'mjestodvorana',
    freezeTableName: true,
    timestamps: false
  });
  return mjestodvorana;
};