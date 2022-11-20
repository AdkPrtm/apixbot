
module.exports = (Sequelize, DataTypes) => {
    const Resi = Sequelize.define('Resi', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
          resi: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          nama: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          status_cod: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          pembayaran_cod: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          fee_cod: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          lokasi: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          diterima: {
            type: DataTypes.STRING,
            defaultValue: 'Belum'
          },
          fee: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          }
    }, {
        tableName: 'tb_resi'
    })
    return Resi
}