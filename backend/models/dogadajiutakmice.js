'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dogadajiutakmice extends Model {
   
    static associate(models) {
      this.belongsTo(models.utakmica,{foreignKey:'broj_utakmice'});
      this.belongsTo(models.dogadaj,{foreignKey:'dogadaj_id'});
      this.belongsTo(models.clanovitima,{foreignKey:{name:'maticni_broj',allowNull: true}});
    }
  };
  dogadajiutakmice.init({
    vrijeme: DataTypes.STRING,
    tim: DataTypes.SMALLINT,
    rez_domaci: DataTypes.SMALLINT,
    rez_gosti: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'dogadajiutakmice',
    freezeTableName: true,
    timestamps: false
  });
  return dogadajiutakmice;
};