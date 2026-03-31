import { User, Project, Task, Comment } from '../types';

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Ava Chen",
    email: "ava@example.com",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava"
  },
  {
    id: "u2",
    name: "Noah Patel",
    email: "noah@example.com",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah"
  },
  {
    id: "u3",
    name: "Mia Rodriguez",
    email: "mia@example.com",
    role: "Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia"
  },
  {
    id: "u4",
    name: "Liam Johnson",
    email: "liam@example.com",
    role: "QA Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam"
  }
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Refresh the marketing site and improve conversion flows.",
    color: "#2563EB",
    memberIds: ["u1", "u2", "u3"],
    progress: 65,
    dueDate: "2026-04-20"
  },
  {
    id: "p2",
    name: "Mobile App Launch",
    description: "Prepare the launch checklist and polish onboarding flows.",
    color: "#0EA5E9",
    memberIds: ["u1", "u2", "u4"],
    progress: 40,
    dueDate: "2026-05-05"
  },
  {
    id: "p3",
    name: "Internal Ops Cleanup",
    description: "Streamline team documentation and handoff process.",
    color: "#3B82F6",
    memberIds: ["u3", "u4"],
    progress: 80,
    dueDate: "2026-04-12"
  }
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    projectId: "p1",
    title: "Finalize homepage wireframes",
    description: "Create final wireframes for desktop and tablet breakpoints.",
    status: "In Progress",
    priority: "High",
    assigneeId: "u3",
    dueDate: "2026-04-03",
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-03-30T14:30:00Z",
    commentCount: 2,
    tags: ["Design", "Homepage"]
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Implement responsive hero section",
    description: "Build the hero section UI with responsive behavior.",
    status: "To Do",
    priority: "Medium",
    assigneeId: "u2",
    dueDate: "2026-04-05",
    createdAt: "2026-03-29T10:00:00Z",
    updatedAt: "2026-03-29T10:00:00Z",
    commentCount: 1,
    tags: ["Frontend"]
  },
  {
    id: "t3",
    projectId: "p2",
    title: "QA onboarding checklist",
    description: "Review and verify all onboarding screens before release.",
    status: "Review",
    priority: "Urgent",
    assigneeId: "u4",
    dueDate: "2026-04-01",
    createdAt: "2026-03-27T08:15:00Z",
    updatedAt: "2026-03-31T11:20:00Z",
    commentCount: 3,
    tags: ["QA", "Release"]
  },
  {
    id: "t4",
    projectId: "p2",
    title: "Polish signup confirmation UI",
    description: "Improve copy, spacing, and success illustration.",
    status: "Done",
    priority: "Low",
    assigneeId: "u3",
    dueDate: "2026-03-30",
    createdAt: "2026-03-24T13:40:00Z",
    updatedAt: "2026-03-30T17:00:00Z",
    commentCount: 0,
    tags: ["UX", "Onboarding"]
  },
  {
    id: "t5",
    projectId: "p3",
    title: "Organize handoff document template",
    description: "Create a reusable handoff template for internal ops work.",
    status: "To Do",
    priority: "Medium",
    assigneeId: "u1",
    dueDate: "2026-04-07",
    createdAt: "2026-03-30T07:30:00Z",
    updatedAt: "2026-03-30T07:30:00Z",
    commentCount: 1,
    tags: ["Ops", "Documentation"]
  },
  {
    id: "t6",
    projectId: "p1",
    title: "Review analytics dashboard copy",
    description: "Ensure labels and section headers are consistent.",
    status: "Review",
    priority: "High",
    assigneeId: "u1",
    dueDate: "2026-04-02",
    createdAt: "2026-03-26T15:00:00Z",
    updatedAt: "2026-03-31T09:10:00Z",
    commentCount: 4,
    tags: ["Content", "Dashboard"]
  }
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    taskId: "t1",
    authorId: "u1",
    content: "Please make sure the tablet layout keeps the CTA above the fold.",
    createdAt: "2026-03-30T10:20:00Z"
  },
  {
    id: "c2",
    taskId: "t1",
    authorId: "u3",
    content: "Updated the spacing and will share the revised wireframes shortly.",
    createdAt: "2026-03-30T11:05:00Z"
  },
  {
    id: "c3",
    taskId: "t3",
    authorId: "u4",
    content: "Found two copy issues in the final onboarding step.",
    createdAt: "2026-03-31T08:00:00Z"
  },
  {
    id: "c4",
    taskId: "t6",
    authorId: "u2",
    content: "I aligned the metric labels with the design file naming.",
    createdAt: "2026-03-31T09:30:00Z"
  }
];
