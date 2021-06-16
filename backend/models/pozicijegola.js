'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pozicijegola extends Model {
   
    static associate(models) {
     this.belongsTo(models.utakmica,{foreignKey:'broj_utakmice'});
     this.belongsTo(models.clanovitima,{foreignKey:'maticni_broj'});
     this.belongsTo(models.dogadaj,{foreignKey:'dogadaj_id'});
    }
  };
  pozicijegola.init({
    pozicija: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'pozicijegola',
    freezeTableName: true,
    timestamps: false
  });
  return pozicijegola;
};