-- CreateEnum
CREATE TYPE "ReportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('RECEIVED', 'UNDER_REVIEW', 'NEED_MORE_INFO', 'RESOLVED', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('BUG_REPORT', 'APP_CRASH', 'UI_DISPLAY_ISSUE', 'FEATURE_REQUEST', 'PERFORMANCE_ISSUE', 'LOGIN_PROBLEM', 'BORROW_REQUEST_ISSUE', 'ITEM_LISTING_ISSUE', 'NOTIFICATION_ISSUE', 'SCAM_OR_FRAUD', 'FAKE_LISTING', 'HARASSMENT_OR_ABUSE', 'INAPPROPRIATE_CONTENT', 'SPAM', 'ACCOUNT_ISSUE', 'SECURITY_CONCERN', 'PRIVACY_CONCERN', 'PAYMENT_ISSUE', 'OTHER');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "ReportCategory" NOT NULL,
    "priority" "ReportPriority" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relatedItemId" TEXT,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ReportStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reports_referenceCode_key" ON "reports"("referenceCode");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "reports"("userId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_category_idx" ON "reports"("category");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
