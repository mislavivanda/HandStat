'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class klub extends Model {
   
    static associate(models) {
     this.hasMany(models.utakmica,{foreignKey:'domaci_id'});
     this.hasMany(models.utakmica,{foreignKey:'gosti_id'});//KOD BELONGSTOMANY ASOCIJACIJA ALIAS SE ODNOSI NA TARGET MODEL-> U OVOM SLUCAJU NA natjecanje MODEL I TAJ ALIAS KORISTIMO KADA U ASOCIJACIJAMA S klubom INCLUDEAMO natjecanje , KAKO klub PRIPADA VISE natjecanja(BELONGSTOMAY) ONDA SE FOREIGN KEY OD RAZREDA(U OVOM SLUCAJU EKSPLICITNO DEFINIRAN klub_id) POSTAVLJA U TARGETU ODNOSNO U OVOM SLUČAJU U VEZNU(THROUGH) TABLICU
     this.belongsToMany(models.natjecanje,{through: 'klubnatjecanje',as:'kluboviodnatjecanja',foreignKey: 'klub_id'});//trenutne povezanosti klubova i natjecanja
     this.hasMany(models.klubclanovi,{foreignKey:'klub_id'});//U BELONGSTOMANY SE ALIAS ODNOSI NA TARGET MODELLL ODNOSNO NA natjecanje U OVON SLUCAJU-> to je alias koji navodimo kod includeanja natjecanja
     this.hasMany(models.igracutakmica,{foreignKey:'klub_id'});
     this.hasMany(models.golmanutakmica,{foreignKey:'klub_id'});
     this.hasMany(models.stozerutakmica,{foreignKey:'klub_id'});
     this.belongsToMany(models.natjecanje,{through: 'rezultati',as:'kluboviodnatjecanjarez',foreignKey: 'klub_id'});//trenutne i prošle poveznoasti + podaci relevantni za tablicu
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