import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, TaskPriority, TaskStatus } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);

const statusMap: Record<string, TaskStatus> = {
  "To Do": TaskStatus.TO_DO,
  "In Progress": TaskStatus.IN_PROGRESS,
  Review: TaskStatus.REVIEW,
  Done: TaskStatus.DONE,
};

const priorityMap: Record<string, TaskPriority> = {
  Low: TaskPriority.LOW,
  Medium: TaskPriority.MEDIUM,
  High: TaskPriority.HIGH,
  Urgent: TaskPriority.URGENT,
};

const users = [
  {
    id: "u1",
    name: "MuMu",
    email: "pimpass999@gmail.com",
    role: "Product Manager",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuMu",
  },
  {
    id: "u2",
    name: "Noah Patel",
    email: "noah@example.com",
    role: "Frontend Developer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
  },
  {
    id: "u3",
    name: "Mia Rodriguez",
    email: "mia@example.com",
    role: "Designer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
  },
  {
    id: "u4",
    name: "Liam Johnson",
    email: "liam@example.com",
    role: "QA Engineer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
  },
];

const projects = [
  {
    id: "p1",
    ownerId: "u1",
    name: "Website Redesign",
    description: "Refresh the marketing site and improve conversion flows.",
    color: "#2563EB",
    memberIds: ["u1", "u2", "u3"],
    dueDate: "2026-04-20T00:00:00.000Z",
  },
  {
    id: "p2",
    ownerId: "u1",
    name: "Mobile App Launch",
    description: "Prepare the launch checklist and polish onboarding flows.",
    color: "#0EA5E9",
    memberIds: ["u1", "u2", "u4"],
    dueDate: "2026-05-05T00:00:00.000Z",
  },
  {
    id: "p3",
    ownerId: "u3",
    name: "Internal Ops Cleanup",
    description: "Streamline team documentation and handoff process.",
    color: "#3B82F6",
    memberIds: ["u3", "u4"],
    dueDate: "2026-04-12T00:00:00.000Z",
  },
];

const tasks = [
  {
    id: "t1",
    projectId: "p1",
    title: "Finalize homepage wireframes",
    description: "Create final wireframes for desktop and tablet breakpoints.",
    status: "In Progress",
    priority: "High",
    assigneeId: "u3",
    createdById: "u1",
    dueDate: "2026-04-03T00:00:00.000Z",
    createdAt: "2026-03-28T09:00:00.000Z",
    updatedAt: "2026-03-30T14:30:00.000Z",
    tags: ["Design", "Homepage"],
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Implement responsive hero section",
    description: "Build the hero section UI with responsive behavior.",
    status: "To Do",
    priority: "Medium",
    assigneeId: "u2",
    createdById: "u1",
    dueDate: "2026-04-05T00:00:00.000Z",
    createdAt: "2026-03-29T10:00:00.000Z",
    updatedAt: "2026-03-29T10:00:00.000Z",
    tags: ["Frontend"],
  },
  {
    id: "t3",
    projectId: "p2",
    title: "QA onboarding checklist",
    description: "Review and verify all onboarding screens before release.",
    status: "Review",
    priority: "Urgent",
    assigneeId: "u4",
    createdById: "u1",
    dueDate: "2026-04-01T00:00:00.000Z",
    createdAt: "2026-03-27T08:15:00.000Z",
    updatedAt: "2026-03-31T11:20:00.000Z",
    tags: ["QA", "Release"],
  },
  {
    id: "t4",
    projectId: "p2",
    title: "Polish signup confirmation UI",
    description: "Improve copy, spacing, and success illustration.",
    status: "Done",
    priority: "Low",
    assigneeId: "u3",
    createdById: "u1",
    dueDate: "2026-03-30T00:00:00.000Z",
    createdAt: "2026-03-24T13:40:00.000Z",
    updatedAt: "2026-03-30T17:00:00.000Z",
    tags: ["UX", "Onboarding"],
  },
  {
    id: "t5",
    projectId: "p3",
    title: "Organize handoff document template",
    description: "Create a reusable handoff template for internal ops work.",
    status: "To Do",
    priority: "Medium",
    assigneeId: "u1",
    createdById: "u3",
    dueDate: "2026-04-07T00:00:00.000Z",
    createdAt: "2026-03-30T07:30:00.000Z",
    updatedAt: "2026-03-30T07:30:00.000Z",
    tags: ["Ops", "Documentation"],
  },
  {
    id: "t6",
    projectId: "p1",
    title: "Review analytics dashboard copy",
    description: "Ensure labels and section headers are consistent.",
    status: "Review",
    priority: "High",
    assigneeId: "u1",
    createdById: "u1",
    dueDate: "2026-04-02T00:00:00.000Z",
    createdAt: "2026-03-26T15:00:00.000Z",
    updatedAt: "2026-03-31T09:10:00.000Z",
    tags: ["Content", "Dashboard"],
  },
];

const comments = [
  {
    id: "c1",
    taskId: "t1",
    authorId: "u1",
    content: "Please make sure the tablet layout keeps the CTA above the fold.",
    createdAt: "2026-03-30T10:20:00.000Z",
    updatedAt: "2026-03-30T10:20:00.000Z",
  },
  {
    id: "c2",
    taskId: "t1",
    authorId: "u3",
    content: "Updated the spacing and will share the revised wireframes shortly.",
    createdAt: "2026-03-30T11:05:00.000Z",
    updatedAt: "2026-03-30T11:05:00.000Z",
  },
  {
    id: "c3",
    taskId: "t3",
    authorId: "u4",
    content: "Found two copy issues in the final onboarding step.",
    createdAt: "2026-03-31T08:00:00.000Z",
    updatedAt: "2026-03-31T08:00:00.000Z",
  },
  {
    id: "c4",
    taskId: "t6",
    authorId: "u2",
    content: "I aligned the metric labels with the design file naming.",
    createdAt: "2026-03-31T09:30:00.000Z",
    updatedAt: "2026-03-31T09:30:00.000Z",
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", SALT_ROUNDS);

  await prisma.comment.deleteMany();
  await prisma.taskTag.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        email: user.email.toLowerCase(),
        passwordHash,
      },
    });
  }

  for (const project of projects) {
    await prisma.project.create({
      data: {
        id: project.id,
        ownerId: project.ownerId,
        name: project.name,
        description: project.description,
        color: project.color,
        dueDate: new Date(project.dueDate),
      },
    });

    for (const userId of Array.from(new Set([project.ownerId, ...project.memberIds]))) {
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId,
          membershipRole: userId === project.ownerId ? "owner" : "member",
        },
      });
    }
  }

  const positions = new Map<string, number>();
  for (const task of tasks) {
    const status = statusMap[task.status];
    const positionKey = `${task.projectId}:${status}`;
    const position = positions.get(positionKey) ?? 0;
    positions.set(positionKey, position + 1);

    await prisma.task.create({
      data: {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status,
        priority: priorityMap[task.priority],
        assigneeId: task.assigneeId,
        createdById: task.createdById,
        dueDate: new Date(task.dueDate),
        position,
        completedAt: task.status === "Done" ? new Date(task.updatedAt) : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        tags: {
          create: task.tags.map((value) => ({ value })),
        },
      },
    });
  }

  for (const comment of comments) {
    await prisma.comment.create({
      data: {
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
