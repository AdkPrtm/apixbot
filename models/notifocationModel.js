module.exports = (Sequelize, DataType) => {
  const Notification = Sequelize.define('Notification', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    resi: {
      type: DataType.STRING,
      allowNull: false,
    },
    nomor_hp: {
      type: DataType.BIGINT(11),
      allowNull: false,
    },
    createdAt: {
      type: DataType.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataType.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'tb_notification'
  })

  return Notification
} 