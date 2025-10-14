import express from "express";
import loanController from "../controllers/loan.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
// import { createLoanSchema, updateLoanSchema } from "../schemas/loan.schema.js";
// import validateSchema from "../middlewares/validationMiddleware.js";

const loanRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         customerId:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *         interestRate:
 *           type: number
 *         tenureMonths:
 *           type: integer
 *         emiAmount:
 *           type: number
 *         totalPayableAmount:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         installmentDate:
 *           type: string
 *           format: date
 *         nextEmiAmount:
 *           type: number
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /loan:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/Loan" }
 *     responses:
 *       201:
 *         description: Loan created
 */
loanRouter.post(
  "/",
  authenticateUser,
  // validateSchema(createLoanSchema),
  loanController.createLoan
);

/**
 * @swagger
 * /loan/upcoming-emi:
 *   get:
 *     summary: Get loans whose EMI installment is due within the next N days
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of days ahead to check (default 5)
 *       - in: query
 *         name: includeToday
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include loans with installmentDate today
 *     responses:
 *       200:
 *         description: List of upcoming EMIs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       amount:
 *                         type: string
 *                       installmentDate:
 *                         type: string
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           mobileNumber:
 *                             type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
loanRouter.get(
  "/upcoming-emi",
  authenticateUser,
  loanController.getUpcomingEmis
);

/**
 * @swagger
 * /loan:
 *   get:
 *     summary: Get list of loans with pagination, search, and filters
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema: { type: string }
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
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: List of loans
 */
loanRouter.get("/", authenticateUser, loanController.getLoans);

/**
 * @swagger
 * /loan/{id}:
 *   get:
 *     summary: Get loan by ID
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Loan fetched
 */
loanRouter.get("/:id", authenticateUser, loanController.getLoanById);

/**
 * @swagger
 * /loan/closeWithTransaction:
 *   put:
 *     summary: Close a loan by creating a final repayment transaction
 *     description: Closes the loan for a given customer by creating a final repayment transaction for the remaining pending amount. This operation is performed inside a database transaction for data integrity.
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - loanId
 *             properties:
 *               customerId:
 *                 type: integer
 *                 example: 5
 *                 description: ID of the customer
 *               loanId:
 *                 type: integer
 *                 example: 10
 *                 description: ID of the loan to close
 *     responses:
 *       200:
 *         description: Loan closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Loan closed successfully with final repayment transaction
 *                 data:
 *                   type: object
 *                   properties:
 *                     loan:
 *                       type: object
 *                       description: Updated loan details
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         status:
 *                           type: string
 *                           example: Closed
 *                         nextEmiAmount:
 *                           type: number
 *                           example: 0
 *                         pendingEmis:
 *                           type: integer
 *                           example: 0
 *                     finalTransaction:
 *                       type: object
 *                       description: Final repayment transaction created
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 45
 *                         transactionType:
 *                           type: string
 *                           example: Repayment
 *                         amount:
 *                           type: number
 *                           example: 10000
 *                         paymentMode:
 *                           type: string
 *                           example: Cash
 *       400:
 *         description: Missing or invalid input
 *       404:
 *         description: Loan or customer not found
 *       500:
 *         description: Internal server error
 */

loanRouter.put(
  "/closeWithTransaction",
  authenticateUser,
  loanController.closeLoanWithTransaction
);

/**
 * @swagger
 * /loan/{id}:
 *   put:
 *     summary: Update loan
 *     tags: [Loans]
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
 *           schema: { $ref: "#/components/schemas/Loan" }
 *     responses:
 *       200:
 *         description: Loan updated
 */
loanRouter.put(
  "/:id",
  authenticateUser,
  // validateSchema(updateLoanSchema),
  loanController.updateLoan
);

/**
 * @swagger
 * /loan/{id}:
 *   delete:
 *     summary: Delete loan
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Loan deleted
 */
loanRouter.delete("/:id", authenticateUser, loanController.deleteLoan);

export default loanRouter;
