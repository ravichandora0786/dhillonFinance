import { google } from "googleapis";
import { Op, Sequelize } from "sequelize";
import UploadFileModel from "../models/uploadFile.model.js";
import {
  checkImageUrlExpired,
  listAllS3Files,
  s3DeleteFile,
  s3UploadFile,
  s3getUploadedFile,
} from "../services/aws/s3.config.js";
import {
  getGoogleDriveClient,
  uploadToDrive,
} from "../services/googleDrive.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sequelize from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import CustomerModel from "../models/customer.model.js";
import UserModel from "../models/user.model.js";

/**
 * Upload File to S3 and save to DB
 */
const uploadFile = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // Upload to S3
    const { presignedUrl, fileName } = await s3UploadFile(
      file,
      process.env.FOLDER_NAME || "uploads"
    );

    // Save file record in DB
    const uploadedFile = await UploadFileModel.create({
      image: presignedUrl,
      imageKey: fileName,
      isActive: true,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, uploadedFile, "File uploaded to S3 successfully")
      );
  } catch (error) {
    console.error("Upload File Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Get File URL by ID
 */
const getFileById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const fileRecord = await UploadFileModel.findOne({ where: { id } });
    if (!fileRecord) {
      return res.status(404).json({ message: "File not found" });
    }

    // Regenerate presigned URL if needed
    const presignedUrl = await s3getUploadedFile(
      fileRecord.imageKey,
      process.env.FOLDER_NAME || "uploads"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url: presignedUrl },
          "File URL fetched successfully"
        )
      );
  } catch (error) {
    console.error("Get File Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Get All Files with refreshed URLs and delete extra S3 files
 */
const getAllFiles = asyncHandler(async (req, res) => {
  const folderName = process.env.FOLDER_NAME || "uploads";

  // List S3 files keys only
  const s3Files = (await listAllS3Files(folderName)).map((file) =>
    file.Key.replace(`${folderName}/`, "")
  );

  // Get DB files
  const dbFiles = await UploadFileModel.findAll({ where: { isActive: true } });
  const dbFileKeys = dbFiles.map((file) => file.imageKey);

  // Delete S3 files not in DB
  const filesToDelete = s3Files.filter((key) => !dbFileKeys.includes(key));
  for (const key of filesToDelete) await s3DeleteFile(key, folderName);

  // Refresh expired URLs
  const refreshedFiles = await Promise.all(
    dbFiles.map(async (file) => {
      if (checkImageUrlExpired(file.image)) {
        file.image = await s3getUploadedFile(file.imageKey, folderName);
        await file.save();
      }
      return file;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, refreshedFiles, "All files fetched successfully")
    );
});

// Refresh all customer files and clean up unused S3 files
const getAllFilesInternal = async () => {
  const folderName = process.env.FOLDER_NAME || "uploads";

  // List S3 files keys only
  const s3Files = (await listAllS3Files(folderName)).map((file) =>
    file.Key.replace(`${folderName}/`, "")
  );

  // Get DB files
  const dbFiles = await UploadFileModel.findAll({ where: { isActive: true } });
  const dbFileKeys = dbFiles.map((file) => file.imageKey);

  // Delete S3 files not in DB
  const filesToDelete = s3Files.filter((key) => !dbFileKeys.includes(key));
  for (const key of filesToDelete) await s3DeleteFile(key, folderName);

  // Refresh expired URLs
  const refreshedFiles = await Promise.all(
    dbFiles.map(async (file) => {
      if (checkImageUrlExpired(file.image)) {
        file.image = await s3getUploadedFile(file.imageKey, folderName);
        await file.save();
      }
      return file;
    })
  );

  return refreshedFiles;
};

/**
 * Upload File to gmail drive and save to DB
 */
const uploadFileToDrive = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // Upload file to Google Drive
    const uploadedFile = await uploadToDrive(file.path, file.originalname);

    // Save file info in DB
    const uploadedFileRecord = await UploadFileModel.create({
      image: `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz`,
      imageKey: uploadedFile.id, // Drive fileId
      isActive: true,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          uploadedFileRecord,
          "File uploaded to Google Drive successfully"
        )
      );
  } catch (error) {
    console.error("Upload File Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Get File URL by ID from drive
 */
export const getFileByIdFromDrive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fileRecord = await UploadFileModel.findOne({ where: { id } });
  if (!fileRecord) return res.status(404).json({ message: "File not found" });

  const drive = await getGoogleDriveClient();

  const url = new URL(fileRecord.image);
  const fileId =
    url.searchParams.get("id") ||
    fileRecord.image.split("/d/")[1]?.split("/")[0];

  if (!fileId) return res.status(400).json({ message: "Invalid Drive URL" });

  const meta = await drive.files.get({ fileId, fields: "mimeType, name" });
  const driveFile = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  res.setHeader("Content-Type", meta.data.mimeType);
  driveFile.data.pipe(res); // send as stream
});

/**
 * Delete File from Google Drive and DB
 */
const deleteFileFromDrive = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Find file record from DB
    const fileRecord = await UploadFileModel.findOne({ where: { id } });
    if (!fileRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: "File not found in database" });
    }

    const fileId = fileRecord?.imageKey;
    if (!fileId) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid Google Drive File ID" });
    }

    // Get Drive client
    const drive = await getGoogleDriveClient();

    // Delete file from Google Drive
    await drive.files.delete({ fileId });

    // Delete record from DB
    await fileRecord.destroy({ force: true, transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "File deleted successfully from Google Drive and DB"
        )
      );
  } catch (error) {
    await transaction.rollback();
    next(new ApiError(500, error.message));
  }
});

export const cleanupUnusedDriveFiles = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    //  Get all uploaded files from DB
    const allFiles = await UploadFileModel.findAll({ transaction });
    const allFileIds = allFiles.map((f) => f.id);

    if (!allFileIds.length) {
      await transaction.commit();
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No uploaded files found"));
    }

    //  Find all image keys used in CustomerModel
    const customers = await CustomerModel.findAll({
      attributes: [
        "aadharImage",
        "panCardImage",
        "agreementImage",
        "profileImage",
        "otherImage",
      ],
      where: {
        [Op.or]: [
          { aadharImage: { [Op.in]: allFiles.map((f) => f.id) } },
          { panCardImage: { [Op.in]: allFiles.map((f) => f.id) } },
          { agreementImage: { [Op.in]: allFiles.map((f) => f.id) } },
          { profileImage: { [Op.in]: allFiles.map((f) => f.id) } },
          { otherImage: { [Op.in]: allFiles.map((f) => f.id) } },
        ],
      },
      transaction,
    });

    //  Collect all used UploadFile IDs
    const usedFileIds = new Set();
    customers.forEach((c) => {
      [
        c.aadharImage,
        c.panCardImage,
        c.agreementImage,
        c.profileImage,
        c.otherImage,
      ].forEach((id) => {
        if (id) usedFileIds.add(id);
      });
    });

    //  Filter out unused files (not linked to any customer)
    const unusedFiles = allFiles.filter((f) => !usedFileIds.has(f.id));

    console.log(`🗑 Found ${unusedFiles.length} unused Drive files`);

    if (unusedFiles.length === 0) {
      await transaction.commit();
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No unused files to delete"));
    }

    //  Initialize Drive client
    const drive = await getGoogleDriveClient();
    console.log(unusedFiles, "unusedFilesunusedFilesunusedFiles");
    //  Delete each unused file from Drive + DB
    for (const file of unusedFiles) {
      try {
        if (file.imageKey) {
          await drive.files.delete({ fileId: file.imageKey });
          console.log(`Deleted from Drive: ${file.imageKey}`);
        }
        await file.destroy({ force: true, transaction });
        console.log(`🗑 Removed from DB: ${file.imageKey}`);
      } catch (err) {
        console.error(`Failed to delete ${file.imageKey}:`, err.message);
      }
    }

    await transaction.commit();

    return res.status(200).json(
      new ApiResponse(200, {
        deletedCount: unusedFiles.length,
        message: "Unused Drive files cleaned successfully",
      })
    );
  } catch (error) {
    await transaction.rollback();
    console.error(" Cleanup Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error during cleanup",
      error: error.message,
    });
  }
});

/**
 * Get images based on filter type: 'customer' or 'user'
 * @route GET /api/v1/files?filter=customer|user
 */
export const getAllImagesByFilter = asyncHandler(async (req, res) => {
  const { filter, customerId } = req.query;

  if (!filter || !["customer", "user"].includes(filter)) {
    return res
      .status(400)
      .json({ message: "Invalid filter. Use 'customer' or 'user'" });
  }

  const transaction = await sequelize.transaction();

  try {
    let imageIds = [];

    if (filter === "customer") {
      // If customerId exists, filter by it
      const whereClause = customerId
        ? { id: customerId }
        : {
            [Op.or]: [
              { aadharImage: { [Op.not]: null } },
              { panCardImage: { [Op.not]: null } },
              { agreementImage: { [Op.not]: null } },
              { profileImage: { [Op.not]: null } },
              { otherImage: { [Op.not]: null } },
            ],
          };

      const customers = await CustomerModel.findAll({
        attributes: [
          "aadharImage",
          "panCardImage",
          "agreementImage",
          "profileImage",
          "otherImage",
        ],
        where: whereClause,
        transaction,
      });

      customers.forEach((c) => {
        imageIds.push(
          c.aadharImage,
          c.panCardImage,
          c.agreementImage,
          c.profileImage,
          c.otherImage
        );
      });
    } else if (filter === "user") {
      const users = await UserModel.findAll({
        attributes: ["profileImage"],
        where: {
          [Op.or]: [{ profileImage: { [Op.not]: null } }],
        },
        transaction,
      });

      users.forEach((u) => {
        imageIds.push(u.profileImage);
      });
    }

    // Remove null/undefined and duplicates
    imageIds = [...new Set(imageIds.filter((id) => id))];

    // Fetch actual images from UploadFileModel
    const images = await UploadFileModel.findAll({
      where: { id: { [Op.in]: imageIds } },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json(
      new ApiResponse(200, {
        message: customerId
          ? `Images for customer ${customerId} fetched successfully`
          : `${filter} images fetched successfully`,
        count: images.length,
        data: images,
      })
    );
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching images:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default {
  uploadFile,
  getFileById,
  getAllFiles,
  getAllFilesInternal,
  uploadFileToDrive,
  getFileByIdFromDrive,
  deleteFileFromDrive,
  cleanupUnusedDriveFiles,
  getAllImagesByFilter,
};
