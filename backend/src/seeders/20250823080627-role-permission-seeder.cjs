"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = {
  async up({ context: queryInterface, context: { sequelize } }) {
    await sequelize.transaction(async (transaction) => {
      // Define role list with login permissions
      const roleNames = ["Admin", "co-Admin"];

      const roles = roleNames.map((name) => ({
        id: uuidv4(),
        name,
        description: name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("roles", roles, { transaction });

      // Define permissions
      const permissionNames = [
        "VIEW LIST",
        "CREATE",
        "EDIT",
        "DELETE",
        "VIEW DETAILS",
        "PRINT",
        "DOWNLOARD",
      ];

      const permissions = permissionNames.map((name) => ({
        id: uuidv4(),
        name,
        description: name,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("permissions", permissions, {
        transaction,
      });

      // Define activities
      const activityNames = [
        "DASHBOARD",
        "STUDENTS",
        "TEACHER",
        "PERMISSIONS",
        "DEPARTMENT",
        "ROLE",
        "PARENTS",
        "ACCOUNT",
        "SUBJECT",
        "SYLLABUS",
        "CLASS ROUTINE",
        "CLASS",
        "LEAVE TYPE",
        "ATTENDENCE",
        "EXAM",
        "ROOM",
        "USERS",
        "GRADES",
        "SECTION",
        "NOTICE",
      ];

      const activities = activityNames.map((name) => ({
        id: uuidv4(),
        name,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("activities", activities, {
        transaction,
      });

      // Assign all permissions to Admin for all activities
      const adminRole = roles.find((r) => r.name === "Admin");

      const activityPermissions = activities.map((activity) => ({
        id: uuidv4(),
        activityId: activity.id,
        permissionIds: JSON.stringify(permissions.map((p) => p.id)),
        roleId: adminRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert(
        "activityPermissions",
        activityPermissions,
        { transaction }
      );

      // Create default admin user
      const hashedPassword = await bcrypt.hash("Test@1234", 10);
      const users = [
        {
          id: uuidv4(),
          email: "ravikumar62843@gmail.com",
          roleId: adminRole.id,
          mobileNumber: "9657643786",
          password: hashedPassword,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert("users", users, { transaction });
    });
  },

  async down({ context: queryInterface, context: { sequelize } }) {
    await sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete("users", null, { transaction });
      await queryInterface.bulkDelete("activityPermissions", null, {
        transaction,
      });
      await queryInterface.bulkDelete("activities", null, { transaction });
      await queryInterface.bulkDelete("permissions", null, { transaction });
      await queryInterface.bulkDelete("roles", null, { transaction });
    });
  },
};
