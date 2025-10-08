/**
 * File routes
 */
import express from "express";
import fileUploadController from "../controllers/file.controller.js";
import { uploadImage } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File Management API
 */

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a image
 *     tags: [File]
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/",
  authenticateUser,
  uploadImage("file"),
  fileUploadController.uploadFileToDrive
);

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Get a file by Id
 *     tags: [File]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/:id", authenticateUser, fileUploadController.getFileByIdFromDrive);

/**
 * @swagger
 * /file/cleanupDrive:
 *   delete:
 *     summary: Delete unused files from Google Drive and database
 *     description: Finds all images in UploadFileModel that are not referenced in any Customer or User record and deletes them from Google Drive and DB.
 *     tags: [File]
 *     responses:
 *       200:
 *         description: Cleanup completed successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 deletedCount: 5
 *                 message: "Unused Drive files cleaned successfully"
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/cleanupDrive",
  // authenticateUser,
  fileUploadController.cleanupUnusedDriveFiles
);

/**
 * @swagger
 * /file/{id}:
 *   delete:
 *     summary: Delete a file from Google Drive and Database
 *     description: Deletes a file permanently from Google Drive using its stored Drive file ID, and removes the record from the database.
 *     tags: [File]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The database ID of the file record
 *     responses:
 *       200:
 *         description: File deleted successfully from Google Drive and DB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: File deleted successfully from Google Drive and DB
 *       404:
 *         description: File not found in DB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found in database
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/:id",
  authenticateUser,
  fileUploadController.deleteFileFromDrive
);

/**
 * @swagger
 * /file:
 *   get:
 *     summary: Get images based on filter (customer or user)
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [customer, user]
 *         required: true
 *         description: Filter type 'customer' or 'user'
 *     responses:
 *       200:
 *         description: List of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UploadFile'
 *       400:
 *         description: Invalid filter parameter
 *       500:
 *         description: Internal server error
 */
router.get("/", fileUploadController.getAllImagesByFilter);

export default router;
