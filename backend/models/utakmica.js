'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class utakmica extends Model {
    static associate(models) {
      this.belongsTo(models.natjecanje,{foreignKey:'natjecanje_id'});
      this.belongsTo(models.mjestodvorana,{foreignKey:'mjesto_id'});
      this.belongsTo(models.sluzbenoosoblje,{foreignKey:'nadzornik_id'});
      this.belongsTo(models.sluzbenoosoblje,{foreignKey:'lijecnik_id'});
      this.belongsTo(models.sluzbenoosoblje,{foreignKey:'zapisnicar_id'});
      this.belongsTo(models.sluzbenoosoblje,{foreignKey:'mjvremena_id'});
      this.belongsTo(models.suci,{foreignKey:'sudac1_id'});
      this.belongsTo(models.suci,{foreignKey:'sudac2_id'});
      this.belongsTo(models.klub,{foreignKey:'domaci_id'});
      this.belongsTo(models.klub,{foreignKey:'gosti_id'});
      this.hasMany(models.igracutakmica,{foreignKey:'broj_utakmice'});
      this.hasMany(models.golmanutakmica,{foreignKey:'broj_utakmice'});
      this.hasMany(models.stozerutakmica,{foreignKey:'broj_utakmice'});
      this.hasMany(models.dogadajiutakmice,{foreignKey:'broj_utakmice'});
      this.hasMany(models.pozicijegola,{foreignKey:'broj_utakmice'});
    }
  };
  utakmica.init({
    broj_utakmice:{
      type:DataTypes.STRING,
      primaryKey:true
    },
    kolo: DataTypes.SMALLINT,
    datum: DataTypes.DATE,
    vrijeme: DataTypes.DATE,
    gledatelji: DataTypes.SMALLINT,
    rezultat_domaci: DataTypes.SMALLINT,
    rezultat_gosti: DataTypes.SMALLINT,
    sudac1_ocjena:DataTypes.FLOAT,
    sudac2_ocjena:DataTypes.FLOAT,
    status: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'utakmica',
    freezeTableName: true,
    timestamps: false
  });
  return utakmica;
};