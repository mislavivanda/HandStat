'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sluzbenoosoblje extends Model {
   
    static associate(models) {
     this.hasMany(models.utakmica,{foreignKey:'nadzornik_id'});
     this.hasMany(models.utakmica,{foreignKey:'lijecnik_id'});
     this.hasMany(models.utakmica,{foreignKey:'zapisnicar_id'});
     this.hasMany(models.utakmica,{foreignKey:'mjvremena_id'});
    }
  };
  sluzbenoosoblje.init({
    maticni_broj: DataTypes.STRING,
    ime: DataTypes.STRING,
    prezime: DataTypes.STRING,
    datum_rodenja: DataTypes.DATE,
    image_path: DataTypes.STRING,
    rola: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'sluzbenoosoblje',
    freezeTableName: true,
    timestamps: false
  });
  return sluzbenoosoblje;
};