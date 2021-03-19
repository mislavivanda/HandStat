'use strict';
const {
  Model
} = require('sequelize');
//PAZIT DA REDOSLIJED SEEDANJA DOGADAJA U BAZU BUDE DOGOVOREN KAO U MOCKDATA
module.exports = (sequelize, DataTypes) => {
  class dogadaj extends Model {
  
    static associate(models) {
     this.hasMany(models.dogadajiutakmice,{foreignKey:'dogadaj_id'});
     this.hasMany(models.pozicijegola,{foreignKey:'dogadaj_id'});
    }
  };
  dogadaj.init({
    naziv: DataTypes.STRING,
    tip: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'dogadaj',
    freezeTableName: true,
    timestamps: false
  });
  return dogadaj;
};