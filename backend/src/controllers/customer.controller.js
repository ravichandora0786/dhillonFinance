import { Op, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import CustomerModel from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import UploadFileModel from "../models/uploadFile.model.js";
import TransactionModel from "../models/transaction.model.js";
import LoanModel from "../models/loan.model.js";
import {
  checkImageUrlExpired,
  s3getUploadedFile,
} from "../services/aws/s3.config.js";
import FileController from "./file.controller.js";
import { getGoogleDriveClient } from "../services/googleDrive.js";

/**
 * Refresh signed URL of a file if expired
 */
const refreshFileUrl = async (fileObj, folderName) => {
  if (!fileObj) return null;
  const isExpired = checkImageUrlExpired(fileObj.image);
  if (isExpired) {
    const newUrl = await s3getUploadedFile(fileObj.fileName, folderName);
    fileObj.image = newUrl;

    // DB update
    if (typeof fileObj.save === "function") {
      await fileObj.save();
    }
  }
  return fileObj;
};

/** Create Customer */
const createCustomer = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { mobileNumber, aadharNumber } = req.body;

    // check duplicate mobile
    const existing = await CustomerModel.findOne({ where: { mobileNumber } });
    if (existing)
      return next(new ApiError(400, "Mobile number already exists"));
    // check duplicate mobile
    const aadharExistingCheck = await CustomerModel.findOne({
      where: { aadharNumber },
    });
    if (aadharExistingCheck)
      return next(new ApiError(400, "Aadhar number already exists"));

    const customer = await CustomerModel.create(req.body, { transaction });
    await transaction.commit();
    return res
      .status(201)
      .json(
        new ApiResponse(201, customer, responseMessage.created("Customer"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Get all Customers with pagination, sorting, search, and next/previous page flags */
const getCustomers = asyncHandler(async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      search = "",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const searchCondition = search
      ? {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("firstName")),
              "LIKE",
              `%${search.toLowerCase()}%`
            ),
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("lastName")),
              "LIKE",
              `%${search.toLowerCase()}%`
            ),
            Sequelize.where(
              Sequelize.fn("LOWER", Sequelize.col("mobileNumber")),
              "LIKE",
              `%${search.toLowerCase()}%`
            ),
          ],
        }
      : {};

    const customers = await CustomerModel.findAndCountAll({
      where: searchCondition,
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
        { model: UploadFileModel, as: "otherFile" },
        {
          model: LoanModel,
          as: "loans",
          include: [
            {
              model: TransactionModel,
              as: "transactions",
              separate: true,
              order: [["createdAt", "DESC"]],
            },
          ],
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit,
      offset,
    });

    // Refresh file URLs for all customers
    // await Promise.all(
    //   customers.rows.map(async (customer) => {
    //     customer.aadharFile = await refreshFileUrl(
    //       customer.aadharFile,
    //       process.env.AADHAR_FOLDER
    //     );
    //     customer.panCardFile = await refreshFileUrl(
    //       customer.panCardFile,
    //       process.env.PANCARD_FOLDER
    //     );
    //     customer.agreementFile = await refreshFileUrl(
    //       customer.agreementFile,
    //       process.env.AGREEMENT_FOLDER
    //     );
    //     customer.profileFile = await refreshFileUrl(
    //       customer.profileFile,
    //       process.env.PROFILE_PIC_FOLDER
    //     );
    //   })
    // );

    // Map customers with loan/payment stats
    const customerData = customers.rows.map((customer) => {
      const loans = customer.loans || [];

      const loansWithStats = loans.map((loan) => {
        const repaymentsReceived = loan.transactions
          .filter((tx) => tx.transactionType === "Repayment")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const totalLateCharges = loan.transactions.reduce(
          (sum, tx) => sum + (parseFloat(tx.lateEMICharges) || 0),
          0
        );

        const repaymentsPending =
          parseFloat(loan.totalPayableAmount) - repaymentsReceived;

        return {
          ...loan.toJSON(),
          repaymentsReceived,
          repaymentsPending: repaymentsPending >= 0 ? repaymentsPending : 0,
          totalLateCharges,
        };
      });

      const totalLoans = loans.length;
      const closedLoans = loans.filter((l) => l.status === "Closed").length;
      const pendingLoans = loans.filter(
        (l) =>
          l.status === "Active" ||
          l.status === "Pending" ||
          l.status === "Defaulted"
      ).length;

      return {
        ...customer.toJSON(),
        totalLoans,
        closedLoans,
        pendingLoans,
        loans: loansWithStats,
      };
    });

    const totalPages = Math.ceil(customers.count / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total: customers.count,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          customers: customerData,
        },
        responseMessage.fetched("Customers")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get Customer by ID with loans/transactions stats */
const getCustomerById = asyncHandler(async (req, res, next) => {
  try {
    const customer = await CustomerModel.findByPk(req.params.id, {
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
        { model: UploadFileModel, as: "otherFile" },
        {
          model: LoanModel,
          as: "loans",
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TransactionModel,
              as: "transactions",
              attributes: ["amount", "transactionType", "createdAt"],
              separate: true,
              order: [["createdAt", "DESC"]],
            },
          ],
        },
      ],
    });

    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    // // Refresh file URLs
    // customer.aadharFile = await refreshFileUrl(
    //   customer.aadharFile,
    //   process.env.AADHAR_FOLDER
    // );
    // customer.panCardFile = await refreshFileUrl(
    //   customer.panCardFile,
    //   process.env.PANCARD_FOLDER
    // );
    // customer.agreementFile = await refreshFileUrl(
    //   customer.agreementFile,
    //   process.env.AGREEMENT_FOLDER
    // );
    // customer.profileFile = await refreshFileUrl(
    //   customer.profileFile,
    //   process.env.PROFILE_PIC_FOLDER
    // );

    const loans = customer.loans || [];

    const loansWithStats = loans.map((loan) => {
      const repaymentsReceived = loan.transactions
        .filter((tx) => tx.transactionType === "Repayment")
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      const totalLateCharges = loan.transactions.reduce(
        (sum, tx) => sum + (parseFloat(tx.lateEMICharges) || 0),
        0
      );

      const repaymentsPending =
        parseFloat(loan.totalPayableAmount) - repaymentsReceived;

      return {
        ...loan.toJSON(),
        repaymentsReceived,
        repaymentsPending: repaymentsPending >= 0 ? repaymentsPending : 0,
        totalLateCharges,
      };
    });

    const totalLoans = loans.length;
    const closedLoans = loans.filter((l) => l.status === "Closed").length;
    const pendingLoans = loans.filter(
      (l) =>
        l.status === "Active" ||
        l.status === "Pending" ||
        l.status === "Defaulted"
    ).length;

    const customerWithStats = {
      ...customer.toJSON(),
      totalLoans,
      closedLoans,
      pendingLoans,
      loans: loansWithStats,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          customerWithStats,
          responseMessage.fetched("Customer")
        )
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Update Customer */
const updateCustomer = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const customer = await CustomerModel.findByPk(req.params.id, {
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
        { model: UploadFileModel, as: "otherFile" },
      ],
    });

    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    const { aadharId, panCardId, agreementId, profileImageId, ...rest } =
      req.body;

    // If new files provided → delete old UploadFile row from DB
    if (aadharId && aadharId !== customer.aadharFile?.id) {
      if (customer.aadharFile?.id) {
        await UploadFileModel.destroy({
          where: { id: customer.aadharFile.id },
          force: true,
          transaction,
        });
      }
      rest.aadharId = aadharId;
    }

    if (panCardId && panCardId !== customer.panCardFile?.id) {
      if (customer.panCardFile?.id) {
        await UploadFileModel.destroy({
          where: { id: customer.panCardFile.id },
          force: true,
          transaction,
        });
      }
      rest.panCardId = panCardId;
    }

    if (agreementId && agreementId !== customer.agreementFile?.id) {
      if (customer.agreementFile?.id) {
        await UploadFileModel.destroy({
          where: { id: customer.agreementFile.id },
          force: true,
          transaction,
        });
      }
      rest.agreementId = agreementId;
    }

    if (profileImageId && profileImageId !== customer.profileFile?.id) {
      if (customer.profileFile?.id) {
        await UploadFileModel.destroy({
          where: { id: customer.profileFile.id },
          force: true,
          transaction,
        });
      }
      rest.profileImageId = profileImageId;
    }

    await customer.update(rest, { transaction });

    await transaction.commit();
    // Refresh all customer files and clean up unused S3 files
    // await FileController.getAllFilesInternal();
    return res
      .status(200)
      .json(
        new ApiResponse(200, customer, responseMessage.updated("Customer"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/** Delete Customer */
export const deleteCustomer = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Find customer
    const customer = await CustomerModel.findByPk(id, { transaction });
    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    // Find all loans of this customer
    const loans = await LoanModel.findAll({
      where: { customerId: id },
      transaction,
    });

    // Check if any loan is Active
    const activeLoan = loans.find((loan) => loan.status === "Active");
    if (activeLoan) {
      await transaction.rollback();
      return next(
        new ApiError(
          400,
          "Cannot delete customer: one or more loans are still Active"
        )
      );
    }

    // Find all transactions of this customer
    const transactions = await TransactionModel.findAll({
      where: { customerId: id },
      transaction,
    });

    // Delete all transactions
    for (const txn of transactions) {
      await txn.destroy({ force: true, transaction });
    }

    // Delete all loans (non-active)
    for (const loan of loans) {
      await loan.destroy({ force: true, transaction });
    }

    // Delete uploaded files from Google Drive and DB
    const drive = await getGoogleDriveClient();
    const fileIds = [
      customer.aadharImage,
      customer.panCardImage,
      customer.agreementImage,
      customer.profileImage,
      customer.otherImage,
    ].filter(Boolean);

    for (const fileId of fileIds) {
      try {
        const fileRecord = await UploadFileModel.findByPk(fileId, {
          transaction,
        });
        if (fileRecord) {
          await drive.files.delete({ fileId: fileRecord.imageKey });
          await fileRecord.destroy({ force: true, transaction });
        }
      } catch (err) {
        console.error(`Failed to delete file ${fileId}:`, err.message);
      }
    }

    // Finally delete the customer
    await customer.destroy({ force: true, transaction });

    // Commit all
    await transaction.commit();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          responseMessage.deleted("Customer and related data")
        )
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

const getCustomerOptions = asyncHandler(async (req, res, next) => {
  try {
    // Agar search query hai to filter karenge
    const { search = "" } = req.query;

    const searchCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { mobileNumber: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Fetch customers, only required fields
    const customers = await CustomerModel.findAll({
      attributes: ["id", "firstName", "lastName", "mobileNumber", "fatherName"],
      where: {
        ...searchCondition,
        status: "Active",
      },
      order: [["firstName", "ASC"]],
    });

    // Map to option format (optional)
    const options = customers.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName} s/o ${c.fatherName}`,
      mobileNumber: c.mobileNumber,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          status: "success",
          total: options.length,
          customers: options,
        },
        "Customers fetched successfully"
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get overall totals (customers, repaymentsReceived, repaymentsPending, disbursedAmount, totalProfit) for Active loans */
const getCustomerRepaymentStats = asyncHandler(async (req, res, next) => {
  try {
    // ---- Fetch customers, loans, and transactions ----
    const customers = await CustomerModel.findAll({
      include: [
        {
          model: LoanModel,
          as: "loans",
          include: [
            {
              model: TransactionModel,
              as: "transactions",
            },
          ],
        },
      ],
    });

    // ---- Customer Stats ----
    const customerStats = {
      Active: 0,
      Inactive: 0,
      Pending: 0,
      Blocked: 0,
      totalCustomers: customers.length,
    };

    customers.forEach((cust) => {
      if (customerStats[cust.status] !== undefined) {
        customerStats[cust.status]++;
      }
    });

    // ---- Loan Stats ----
    const loanStats = {
      Active: 0,
      Closed: 0,
      Defaulted: 0,
      Pending: 0,
      totalLoans: 0,
    };

    // ---- Aggregates ----
    let totalRepaymentsReceived = 0;
    let totalReceivedCharges = 0;
    let totalRepaymentsPending = 0;
    let totalActiveLoans = 0;
    let totalDisbursedAmount = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    const activeLoanCustomersSet = new Set();

    // ---- Loan Customers grouping (for count by status) ----
    const loanCustomers = {
      Active: 0,
      Closed: 0,
      Defaulted: 0,
      Pending: 0,
    };

    customers.forEach((customer) => {
      customer.loans.forEach((loan) => {
        // Count loan statuses
        if (loanStats[loan.status] !== undefined) {
          loanStats[loan.status]++;
          loanCustomers[loan.status]++;
        }
        loanStats.totalLoans++;

        // For Active or Closed loans
        if (loan.status === "Active" || loan.status === "Closed") {
          totalActiveLoans++;
          activeLoanCustomersSet.add(customer.id);

          totalDisbursedAmount += parseFloat(loan.amount || 0);

          // Repayments received
          const repaymentsReceived = loan.transactions
            .filter((tx) => tx.transactionType === "Repayment")
            .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

          // Late charges received
          const receivedCharges = loan.transactions
            .filter((tx) => tx.transactionType === "Repayment")
            .reduce((sum, tx) => sum + parseFloat(tx.lateEMICharges || 0), 0);

          totalReceivedCharges += receivedCharges;

          // Pending repayments
          const repaymentsPending =
            parseFloat(loan.totalPayableAmount || 0) - repaymentsReceived;

          totalRepaymentsReceived += repaymentsReceived;
          totalRepaymentsPending +=
            repaymentsPending >= 0 ? repaymentsPending : 0;
        }
      });
    });

    // ---- Add charges to total received ----
    totalRepaymentsReceived = Number(
      (totalRepaymentsReceived + totalReceivedCharges).toFixed(2)
    );
    totalRepaymentsPending = Number(totalRepaymentsPending.toFixed(2));
    totalDisbursedAmount = Number(totalDisbursedAmount.toFixed(2));

    // ---- Calculate total profit and loss ----
    const allLoans = customers.flatMap((c) => c.loans || []);
    totalProfit = allLoans.reduce(
      (sum, l) => sum + (parseFloat(l.profitAmount) || 0),
      0
    );
    totalLoss = allLoans.reduce(
      (sum, l) => sum + (parseFloat(l.lossAmount) || 0),
      0
    );

    // ---- Final response ----
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          customerStats,
          loanStats,
          loanCustomers,
          repaymentStats: {
            totalActiveLoans,
            totalActiveLoanCustomers: activeLoanCustomersSet.size,
            totalDisbursedAmount,
            totalRepaymentsReceived,
            totalRepaymentsPending,
            totalReceivedCharges,
            totalProfit,
            totalLoss,
          },
        },
        "Customer, loan, and profit stats calculated successfully"
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Get Customers with next EMI info */
const getCustomersNextEMI = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();

    // Fetch customers with active loans
    const customers = await CustomerModel.findAll({
      attributes: ["id", "firstName", "lastName", "mobileNumber"],
      include: [
        {
          model: LoanModel,
          as: "loans",
          where: { status: "Active" },
          required: true, // sirf active loans
          attributes: ["id", "nextEmiAmount", "startDate", "tenureMonths"],
        },
      ],
      order: [["firstName", "ASC"]],
    });

    const result = [];

    customers.forEach((customer) => {
      const loans = customer.loans || [];

      let nextEMI = null;

      loans.forEach((loan) => {
        const nextEmiAmount = parseFloat(loan.nextEmiAmount || 0);
        const startDate = new Date(loan.startDate);
        const tenure = loan.tenureMonths || 0;

        for (let i = 0; i < tenure; i++) {
          const emiDate = new Date(startDate);
          emiDate.setMonth(emiDate.getMonth() + i);

          // only consider EMIs not yet cleared (>= start date)
          if (!nextEMI || emiDate < nextEMI.date) {
            nextEMI = {
              date: emiDate,
              amount: nextEmiAmount,
              overdue: emiDate < today, // true if overdue
            };
          }
        }
      });

      if (nextEMI) {
        result.push({
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          mobileNumber: customer.mobileNumber,
          nextEMIDate: nextEMI.date.toISOString().split("T")[0],
          nextEMIAmount: nextEMI.amount,
          overdue: nextEMI.overdue,
        });
      }
    });

    // Sort by EMI date ascending (overdue will come first automatically)
    result.sort((a, b) => new Date(a.nextEMIDate) - new Date(b.nextEMIDate));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Next EMI details for all active customers fetched and sorted successfully"
        )
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/** Update Customer Status */
const updateCustomerStatusById = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Active", "Inactive", "Blocked"];
    if (!validStatuses.includes(status)) {
      return next(new ApiError(400, "Invalid status value"));
    }

    const customer = await CustomerModel.findByPk(id);
    if (!customer) {
      return next(new ApiError(404, "Customer not found"));
    }

    customer.status = status;
    await customer.save({ transaction });

    await transaction.commit();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { id: customer.id, status: customer.status },
          "Customer status updated successfully"
        )
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Get detailed printable customer loan statement (with optional loanId filter) including transactions, profile, and Dhillon Finance invoice info.
const getCustomerLoanDetailsById = asyncHandler(async (req, res, next) => {
  try {
    const { id: customerId } = req.params;
    const { loanId } = req.query;

    const customer = await CustomerModel.findByPk(customerId, {
      include: [
        { model: UploadFileModel, as: "aadharFile" },
        { model: UploadFileModel, as: "panCardFile" },
        { model: UploadFileModel, as: "agreementFile" },
        { model: UploadFileModel, as: "profileFile" },
        { model: UploadFileModel, as: "otherFile" },
        {
          model: LoanModel,
          as: "loans",
          where: loanId ? { id: loanId } : undefined,
          required: false,
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TransactionModel,
              as: "transactions",
              attributes: [
                "id",
                "amount",
                "transactionType",
                "lateEMICharges",
                "createdAt",
                "paymentMode",
                "transactionDate",
                "lateEMIDays",
              ],
              separate: true,
              order: [["createdAt", "DESC"]],
            },
          ],
        },
      ],
    });

    if (!customer)
      return next(new ApiError(404, responseMessage.notFound("Customer")));

    const loans = customer.loans || [];

    const totalLoans = loans.length;
    const activeLoans = loans.filter((l) => l.status === "Active").length;
    const closedLoans = loans.filter((l) => l.status === "Closed").length;

    const generateTransactionTable = (transactions) => {
      if (!transactions || transactions.length === 0)
        return `<tr><td colspan="6">No transactions found</td></tr>`;

      return transactions
        .map(
          (tx, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${new Date(tx.transactionDate).toLocaleDateString("en-IN")}</td>
            <td>${tx.transactionType}</td>
            <td>₹${tx.amount}</td>
            <td>${tx.lateEMIDays || 0}</td>
            <td>₹${tx.lateEMICharges || 0}</td>
            <td>${tx.paymentMode}</td>
            <td>₹${(
              parseFloat(tx.amount) + (parseFloat(tx.lateEMICharges) || 0)
            ).toFixed(2)}</td>
          </tr>`
        )
        .join("");
    };

    const generateLoanSection = (loan) => `
      <div class="section">
        <h3>Loan No.: ${loan.loanNumber}</h3>
        <table class="info-table">
          <tr><td><strong>Status:</strong> ${loan.status}</td></tr>
          <tr><td><strong>Loan Amount:</strong> ₹${loan.amount}</td>
              <td><strong>Total Payable:</strong> ₹${
                loan.totalPayableAmount
              }</td></tr>
          <tr><td><strong>Tenure:</strong> ${loan.tenureMonths} Months</td>
              <td><strong>Interest Rate:</strong> ${
                loan.interestRate
              }%</td></tr>
          <tr><td><strong>EMI Amount:</strong> ₹${loan.emiAmount}</td>
              <td><strong>Pending EMIs:</strong> ${loan.pendingEmis}</td></tr>
          <tr><td><strong>Start Date:</strong> ${loan.startDate}</td>
              <td><strong>End Date:</strong> ${loan.endDate}</td></tr>
        </table>

        <h4>Transaction Details</h4>
        <table class="transaction-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Late Days</th>
              <th>Late Charges (₹)</th>
              <th>Payment Mode</th>
              <th>Total Paid (₹)</th>
            </tr>
          </thead>
          <tbody>${generateTransactionTable(loan.transactions)}</tbody>
        </table>
      </div>
    `;

    const loansHTML = loans.map(generateLoanSection).join("<hr>");

    const invoiceDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Loan Statement - ${customer.firstName} ${customer.lastName}</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    color: #333;
    font-size: 12px;
    line-height: 1.5;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  .header img.logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
  }

  .company-info {
    text-align: right;
    font-size: 12px;
  }

  h2, h3, h4 {
    font-weight: bold;
    color: #222;
  }

  h2 { font-size: 14px; margin: 0; }
  h3 { font-size: 14px; margin-top: 10px; }
  h4 { font-size: 13px; margin-top: 8px; }

  .section {
    margin-bottom: 25px;
  }

  .info-table, .transaction-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .info-table td {
    padding: 5px 8px;
    vertical-align: top;
  }

  .transaction-table th, .transaction-table td {
    border: 1px solid #ccc;
    padding: 6px;
    text-align: left;
  }

  .transaction-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .customer-details {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    gap: 10px;
    align-items: start;
  }

  .profile-img {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    border: 1px solid #ccc;
    object-fit: cover;
  }

  .footer {
    margin-top: 50px;
    text-align: right;
    padding-top: 20px;
    font-size: 12px;
  }

  hr {
    border: none;
    border-top: 1px dashed #999;
    margin: 20px 0;
  }

  .logo-wrapper {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.logoText {
  display: none;
  width: 80px;
  height: 80px;
  border: 2px solid #999;
  border-radius: 50%;
  font-size: 26px;
  font-weight: bold;
  color: #222;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

</style>
</head>
<body>

  <div class="header">
    <div class="logo-wrapper">
  <img class="logo" src="https://your-company-logo-url.com/logo.png" alt="Company Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
  <div class="logoText">DF</div>
</div>
    <div class="company-info">
      <h2>Dhillon Finance</h2>
      <p>Contact: +91 9876543210</p>
      <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
    </div>
  </div>

  <div class="section">
    <h3>Customer Details</h3>
    <div class="customer-details">
      <div>
        <img src="${
          customer.profileFile?.image || ""
        }" alt="Profile Image" class="profile-img" />
      </div>

      <table class="info-table">
        <tr><td><strong>Full Name:</strong> ${customer.firstName} ${
      customer.lastName
    }</td></tr>
        <tr><td><strong>Father's Name:</strong> ${
          customer.fatherName || "-"
        }</td></tr>
        <tr><td><strong>Mobile No:</strong> ${customer.mobileNumber}</td></tr>
        <tr><td><strong>Address:</strong> ${customer.address}</td></tr>
        <tr><td><strong>City:</strong> ${customer.city}</td></tr>
        <tr><td><strong>Status:</strong> ${customer.status}</td></tr>
      </table>

      <table class="info-table">
        <tr><td><strong>Aadhar No:</strong> ${customer.aadharNumber}</td></tr>
        <tr><td><strong>PAN No:</strong> ${customer.panCardNumber}</td></tr>
        <tr><td><strong>Vehicle No:</strong> ${customer.vehicleNumber}</td></tr>
        ${
          !loanId
            ? `
            <tr><td><strong>Total Loans:</strong> ${totalLoans}</td></tr>
            <tr><td><strong>Active Loans:</strong> ${activeLoans}</td></tr>
            <tr><td><strong>Closed Loans:</strong> ${closedLoans}</td></tr>
            `
            : ""
        }
      </table>
    </div>
  </div>

  ${loansHTML}

  <div class="footer">
    <p>(signature & stamp)</p>
    <strong>Dhillon Finance</strong>
  </div>

</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

export default {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerOptions,
  getCustomerRepaymentStats,
  getCustomersNextEMI,
  updateCustomerStatusById,
  getCustomerLoanDetailsById,
};
