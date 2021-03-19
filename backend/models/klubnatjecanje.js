'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class klubnatjecanje extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };//TRENUTNE POVEZANOSTI KLUBA I NATJECANJA
  klubnatjecanje.init({
    natjecanje_id: DataTypes.SMALLINT,
    klub_id: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'klubnatjecanje',
    freezeTableName: true,
    timestamps: false
  });
  return klubnatjecanje;
};