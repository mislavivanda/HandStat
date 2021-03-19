'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class igracutakmica extends Model {
  
    static associate(models) {
     this.belongsTo(models.utakmica,{foreignKey:'broj_utakmice'});
     this.belongsTo(models.clanovitima,{foreignKey:'maticni_broj'});
     this.belongsTo(models.klub,{foreignKey:'klub_id'});
    }
  };
  igracutakmica.init({
    golovi: DataTypes.SMALLINT,
    pokusaji: DataTypes.SMALLINT,
    sedmerac_golovi: DataTypes.SMALLINT,
    sedmerac_pokusaji: DataTypes.SMALLINT,
    iskljucenja: DataTypes.SMALLINT,
    zuti: DataTypes.SMALLINT,
    crveni: DataTypes.SMALLINT,
    plavi: DataTypes.SMALLINT,
    tehnicke: DataTypes.SMALLINT,
    asistencije: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'igracutakmica',
    freezeTableName: true,
    timestamps: false
  });
  return igracutakmica;
};