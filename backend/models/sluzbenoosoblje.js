'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sluzbenoosoblje extends Model {
   
    static associate(models) {
     this.hasMany(models.utakmica,{foreignKey:'nadzornik_id'});
     this.hasMany(models.utakmica,{foreignKey:{name:'lijecnik_id',allowNull:true}});
     this.hasMany(models.utakmica,{foreignKey:'zapisnicar_id'});
     this.hasMany(models.utakmica,{foreignKey:{name:'mjvremena_id',allowNull:true}});
    }
  };
  sluzbenoosoblje.init({
    maticni_broj:{
      type:DataTypes.STRING,
      primaryKey:true
    },
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