/**
 * Customer model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CustomerModel = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panCardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadharImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panCardImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agreementImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "customers",
  }
);

export default CustomerModel;
