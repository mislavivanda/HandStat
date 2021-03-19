'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stozerutakmica extends Model {
   
    static associate(models) {
      this.belongsTo(models.utakmica,{foreignKey:'broj_utakmice'});
     this.belongsTo(models.clanovitima,{foreignKey:'maticni_broj'});
     this.belongsTo(models.klub,{foreignKey:'klub_id'});
    }
  };
  stozerutakmica.init({
    zuti: DataTypes.SMALLINT,
    crveni: DataTypes.SMALLINT,
    plavi: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'stozerutakmica',
    freezeTableName: true,
    timestamps: false
  });
  return stozerutakmica;
};