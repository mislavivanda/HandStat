'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rezultati extends Model {
   
    static associate(models) {
      // define association here
    }
  };
  //SVE BIVŠE I SADAŠNJE POVEZANOSTI KLUBOVA I NATJECANJA-> NIŠTA SE NE BRIŠE OTUD
  rezultati.init({
    klub_id: DataTypes.SMALLINT,
    natjecanje_id: DataTypes.SMALLINT,
    pobjede: DataTypes.SMALLINT,
    porazi: DataTypes.SMALLINT,
    nerjeseni: DataTypes.SMALLINT,
    bodovi: DataTypes.SMALLINT,
    gol_razlika: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'rezultati',
    freezeTableName: true,
    timestamps: false
  });
  return rezultati;
};