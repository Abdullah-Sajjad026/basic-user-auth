const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  securityQuestion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  securityAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answerHint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash password before saving
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
  // Hash security answer too for extra security
  user.securityAnswer = await bcrypt.hash(
    user.securityAnswer.toLowerCase(),
    10
  );
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  if (user.changed("securityAnswer")) {
    user.securityAnswer = await bcrypt.hash(
      user.securityAnswer.toLowerCase(),
      10
    );
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.compareSecurityAnswer = async function (candidateAnswer) {
  return bcrypt.compare(candidateAnswer.toLowerCase(), this.securityAnswer);
};

module.exports = User;
