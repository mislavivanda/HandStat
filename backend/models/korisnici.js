'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class korisnici extends Model {
    static associate(models) {
      this.belongsTo(models.sluzbenoosoblje,{foreignKey:'maticni_broj'});
    }
  };
  korisnici.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'korisnici',
    freezeTableName: true,
    timestamps: false
  });
  return korisnici;
};