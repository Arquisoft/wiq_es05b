// make app model for postgress ranking app Record(name,points,date)

module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    name: DataTypes.STRING,
    points: DataTypes.INTEGER,
    date: DataTypes.DATE,
  });

  return Record;
}