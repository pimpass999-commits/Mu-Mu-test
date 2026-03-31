import { TaskStatus } from "@prisma/client";
import { eachDayOfInterval, endOfDay, format, startOfDay, subDays } from "date-fns";
import { prisma } from "../lib/prisma.js";
import { toPublicUser } from "../utils/serializers.js";

function getRangeDays(range: string | undefined) {
  return range === "30d" ? 30 : 7;
}

export async function getAnalyticsOverview(range?: string) {
  const days = getRangeDays(range);
  const startDate = startOfDay(subDays(new Date(), days - 1));
  const endDate = endOfDay(new Date());

  const [windowTasks, users, projects, allTasks] = await Promise.all([
    prisma.task.findMany({
      where: {
        OR: [
          { createdAt: { gte: startDate, lte: endDate } },
          { updatedAt: { gte: startDate, lte: endDate } },
          { completedAt: { gte: startDate, lte: endDate } },
        ],
      },
      select: {
        id: true,
        projectId: true,
        assigneeId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        completedAt: true,
      },
    }),
    prisma.user.findMany({ include: { assignedTasks: true } }),
    prisma.project.findMany({ include: { tasks: { select: { id: true } } } }),
    prisma.task.findMany({
      select: {
        id: true,
        assigneeId: true,
        status: true,
        createdAt: true,
        completedAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const completedTasks = allTasks.filter((task) => task.status === TaskStatus.DONE);
  const averageCompletionDays =
    completedTasks.length === 0
      ? 0
      : Number(
          (
            completedTasks.reduce((sum, task) => {
              const completedAt = task.completedAt ?? task.updatedAt;
              return sum + (completedAt.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            }, 0) / completedTasks.length
          ).toFixed(1),
        );

  const taskCompletionSeries = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
    name: format(date, "EEE"),
    created: windowTasks.filter(
      (task) => task.createdAt >= startOfDay(date) && task.createdAt <= endOfDay(date),
    ).length,
    completed: windowTasks.filter((task) => {
      const completedAt = task.completedAt ?? (task.status === TaskStatus.DONE ? task.updatedAt : null);
      return completedAt !== null && completedAt >= startOfDay(date) && completedAt <= endOfDay(date);
    }).length,
  }));

  const projectDistribution = projects.map((project) => ({
    name: project.name,
    value: project.tasks.length,
  }));

  const topPerformers = users
    .map((user) => {
      const assignedTaskCount = user.assignedTasks.length;
      const completedTaskCount = user.assignedTasks.filter((task) => task.status === TaskStatus.DONE).length;
      return {
        user: toPublicUser(user),
        assignedTaskCount,
        completedTaskCount,
        efficiency:
          assignedTaskCount === 0 ? 0 : Math.round((completedTaskCount / assignedTaskCount) * 100),
      };
    })
    .sort((a, b) => b.efficiency - a.efficiency || b.assignedTaskCount - a.assignedTaskCount)
    .slice(0, 4);

  const productivitySeries = [9, 11, 13, 15, 17, 19].map((hour) => ({
    time: format(new Date().setHours(hour, 0, 0, 0), "h a"),
    score: windowTasks.filter((task) => new Date(task.updatedAt).getHours() === hour).length,
  }));

  return {
    totals: {
      totalTasks: allTasks.length,
      activeMembers: users.length,
      completionRate:
        allTasks.length === 0 ? 0 : Math.round((completedTasks.length / allTasks.length) * 100),
      averageCompletionDays,
    },
    taskCompletionSeries,
    projectDistribution,
    topPerformers,
    productivitySeries,
  };
}
