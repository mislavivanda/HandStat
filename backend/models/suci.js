'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class suci extends Model {
   
    static associate(models) {
    this.hasMany(models.utakmica,{foreignKey:'sudac1_id'});
    this.hasMany(models.utakmica,{foreignKey:{name:'sudac2_id',allowNull:true}});
    }
  };
  suci.init({
    maticni_broj:{
      type:DataTypes.STRING,
      primaryKey:true
    },
    ime: DataTypes.STRING,
    prezime: DataTypes.STRING,
    nacionalnost: DataTypes.STRING,
    datum_rodenja: DataTypes.DATE,
    mjesto: DataTypes.STRING,
    image_path: DataTypes.STRING,
    broj_utakmica: DataTypes.SMALLINT,
    prosjecna_ocjena: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'suci',
    freezeTableName: true,
    timestamps: false
  });
  return suci;
};