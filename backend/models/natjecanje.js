'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class natjecanje extends Model {
    
    static associate(models) {
    this.hasMany(models.utakmica,{foreignKey:'natjecanje_id'});
    this.belongsToMany(models.klub,{through: 'klubnatjecanje',as:'kluboviodnatjecanja',foreignKey: 'klub_id'});//U BELONGSTOMANY SE ALIAS ODNOSI NA TARGET MODELLL ODNOSNO NA KLUB U OVON SLUCAJU-> s tim alissom radimo kod joinanja odnosno includea
    this.belongsToMany(models.klub,{through: 'rezultati',as:'kluboviodnatjecanja',foreignKey: 'klub_id'});
  }
  };
  natjecanje.init({
    naziv: DataTypes.STRING,
    sezona: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'natjecanje',
    freezeTableName: true,
    timestamps: false
  });
  return natjecanje;
};