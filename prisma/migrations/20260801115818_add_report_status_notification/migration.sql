-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'REPORT_STATUS_UPDATED';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "relatedReportId" TEXT;
