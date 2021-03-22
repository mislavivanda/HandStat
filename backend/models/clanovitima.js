'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  //igraci+golmani+strucni stozer,neki atributi kod strucnog stozera ce biti null
  class clanovitima extends Model {
   
    static associate(models) {
     this.hasMany(models.klubclanovi,{foreignKey:'maticni_broj'});
     this.hasMany(models.igracutakmica,{foreignKey:'maticni_broj'});
     this.hasMany(models.golmanutakmica,{foreignKey:'maticni_broj'});
     this.hasMany(models.stozerutakmica,{foreignKey:'maticni_broj'});
     this.hasMany(models.dogadajiutakmice,{foreignKey:'maticni_broj'});
     this.hasMany(models.pozicijegola,{foreignKey:'maticni_broj'});
    }
  };
  clanovitima.init({
    maticni_broj:{
      type:DataTypes.STRING,
      primaryKey:true
    },
    ime: DataTypes.STRING,
    prezime: DataTypes.STRING,
    broj_dresa: DataTypes.SMALLINT,
    nacionalnost: DataTypes.STRING,
    datum_rodenja: DataTypes.DATE,
    visina: DataTypes.SMALLINT,
    tezina: DataTypes.SMALLINT,
    image_path: DataTypes.STRING,
    rola: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'clanovitima',
    freezeTableName: true,
    timestamps: false
  });
  return clanovitima;
};