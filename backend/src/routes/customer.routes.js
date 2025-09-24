import express from "express";
import customerController from "../controllers/customer.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
// import {
//   createCustomerSchema,
//   updateCustomerSchema,
// } from "../schemas/customer.schema.js";
// import validateSchema from "../middlewares/validationMiddleware.js";

const customerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         pinCode:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         aadharNumber:
 *           type: string
 *         panCardNumber:
 *           type: string
 *         aadharImage:
 *           type: string
 *         panCardImage:
 *           type: string
 *         agreementImage:
 *           type: string
 *         profileImage:
 *           type: string
 *         description:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/Customer" }
 *     responses:
 *       201:
 *         description: Customer created
 */
customerRouter.post(
  "/",
  authenticateUser,
  // validateSchema(createCustomerSchema),
  customerController.createCustomer
);

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Get list of customers with pagination, search, and sorting
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: "createdAt" }
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "DESC" }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of customers
 */
customerRouter.get("/", authenticateUser, customerController.getCustomers);

/**
 * @swagger
 * /customer/options:
 *   get:
 *     summary: Get customer list for dropdown
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by first name, last name or mobile number
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       mobileNumber:
 *                         type: string
 */

customerRouter.get(
  "/options",
  authenticateUser,
  customerController.getCustomerOptions
);

/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Customer fetched
 */
customerRouter.get(
  "/:id",
  authenticateUser,
  customerController.getCustomerById
);

/**
 * @swagger
 * /customer/{id}:
 *   put:
 *     summary: Update customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/Customer" }
 *     responses:
 *       200:
 *         description: Customer updated
 */
customerRouter.put(
  "/:id",
  authenticateUser,
  // validateSchema(updateCustomerSchema),
  customerController.updateCustomer
);

/**
 * @swagger
 * /customer/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Customer deleted
 */
customerRouter.delete(
  "/:id",
  authenticateUser,
  customerController.deleteCustomer
);

export default customerRouter;
