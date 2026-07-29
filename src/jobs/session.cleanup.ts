import cron from "node-cron";
import prisma from "../lib/prisma";

export const startSessionCleanupJob = () => {
  // Runs every day at 3:00 AM
  cron.schedule("0 3 * * *", async () => {
    try {
      const result = await prisma.accountSession.deleteMany({
        where: {
          OR: [
            {
              expiresAt: {
                lt: new Date(),
              },
            },
            {
              isRevoked: true,
              revokedAt: {
                lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
      });

      console.log(`Session cleanup completed: ${result.count} deleted`);
    } catch (error) {
      console.error("Session cleanup failed:", error);
    }
  });
};
