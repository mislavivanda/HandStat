'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class klub extends Model {
   
    static associate(models) {
     this.hasMany(models.utakmica,{foreignKey:'domaci_id'});
     this.hasMany(models.utakmica,{foreignKey:'gosti_id'});
     this.belongsToMany(models.natjecanje,{through: 'klubnatjecanje',as:'natjecanjaodkluba',foreignKey: 'natjecanje_id'});//trenutne povezanosti klubova i natjecanja
     this.hasMany(models.klubclanovi,{foreignKey:'klub_id'});
     this.hasMany(models.igracutakmica,{foreignKey:'klub_id'});
     this.hasMany(models.golmanutakmica,{foreignKey:'klub_id'});
     this.hasMany(models.stozerutakmica,{foreignKey:'klub_id'});
     this.belongsToMany(models.natjecanje,{through: 'rezultati',as:'natjecanjaodklubarez',foreignKey: 'natjecanje_id'});//trenutne i prošle poveznoasti + podaci relevantni za tablicu
    }                                                            //ALIASI MORAJU BITI JEDINSTVENI!!!
  };
  klub.init({
    drzava: DataTypes.STRING,
    grad: DataTypes.STRING,
    naziv: DataTypes.STRING,
    osnutak: DataTypes.STRING,
    image_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'klub',
    freezeTableName: true,
    timestamps: false
  });
  return klub;
};