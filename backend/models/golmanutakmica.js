'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class golmanutakmica extends Model {
   
    static associate(models) {
      this.belongsTo(models.utakmica,{foreignKey:'broj_utakmice'});
      this.belongsTo(models.clanovitima,{foreignKey:'maticni_broj'});
      this.belongsTo(models.klub,{foreignKey:'klub_id'});
    }
  };
  golmanutakmica.init({
    obrane_ukupno: DataTypes.SMALLINT,
    primljeni_ukupno: DataTypes.SMALLINT,
    sedmerac_obrane: DataTypes.SMALLINT,
    sedmerac_primljeni: DataTypes.SMALLINT,
    iskljucenja: DataTypes.SMALLINT,
    zuti: DataTypes.SMALLINT,
    crveni: DataTypes.SMALLINT,
    plavi: DataTypes.SMALLINT,
    golovi: DataTypes.SMALLINT,
    pokusaji: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'golmanutakmica',
    freezeTableName: true,
    timestamps: false
  });
  return golmanutakmica;
};