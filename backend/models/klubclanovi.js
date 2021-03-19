'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class klubclanovi extends Model {
   
    static associate(models) {
     this.belongsTo(models.clanovitima,{foreignKey:'maticni_broj'});
     this.belongsTo(models.klub,{foreignKey:'klub_id'});
     
    }
  };
  klubclanovi.init({
    pobjede: DataTypes.SMALLINT,
    porazi: DataTypes.SMALLINT,
    nerjeseno: DataTypes.SMALLINT,
    od: DataTypes.DATE,
    do: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'klubclanovi',
    freezeTableName: true,
    timestamps: false
  });
  return klubclanovi;
};