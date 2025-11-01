export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type TimelineItem = {
  title: string;
  organization: string;
  role?: string;
  period: string;
  location?: string;
  highlights: string[];
  link?: string;
};

export type Publication = {
  id: string;
  type: "C" | "J" | "P" | "S";
  title: string;
  authors: string;
  venue: string;
  year: string;
  note?: string;
  link?: string;
};

export type Project = {
  name: string;
  period: string;
  role?: string;
  organization?: string;
  description: string;
  highlights: string[];
  link?: string;
};

export type SkillCategory = {
  name: string;
  items: string[];
};

export type Honor = {
  title: string;
  organization: string;
  year: string;
};

export const siteConfig = {
  name: "Rongqi Lu",
  location: "Xi'an, China",
  email: "ronchy_lu@163.com",
  phone: "+86-189-0340-3141",
  tagline:
    "Control engineering graduate student exploring multi-agent reinforcement learning for intelligent robot teams.",
  shortBio:
    "I build robust coordination and exploration strategies for autonomous robots, connecting theoretical advances in multi-agent reinforcement learning with field deployment on UAV and ground robotic platforms.",
  avatar: "/images/profile.jpg",
  resume: "/files/cv.pdf",
  nav: [
    { label: "About", href: "#about" },
    { label: "Education", href: "#education" },
    { label: "Research", href: "#research" },
    { label: "Publications", href: "#publications" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Honors", href: "#honors" }
  ] satisfies NavItem[],
  socials: [
    { label: "GitHub", href: "https://github.com/Ronchy2000" },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=I8gQIVAAAAAJ"
    }
  ] satisfies SocialLink[],
  researchKeywords: [
    "Multi-agent Reinforcement Learning",
    "Distributed Multi-robot Systems",
    "Vision-Language Navigation",
    "Embedded Autonomy"
  ]
};

export const education: TimelineItem[] = [
  {
    title: "M.Eng. in Control Engineering",
    organization: "Xidian University",
    period: "Sep 2023 – Jun 2026 (expected)",
    location: "Xi'an, China",
    highlights: [
      "GPA 83.41% · Rank 13/137 (Top 10%)",
      "Graduate coursework spans matrix theory, stochastic processes, optimal control, and multi-agent cooperation."
    ]
  },
  {
    title: "Honors B.Eng. in Electronic Information Engineering",
    organization: "Sichuan Normal University",
    period: "Sep 2019 – Jun 2023",
    location: "Chengdu, China",
    highlights: [
      "GPA 3.61/4.00 · Rank 1/223 (Top 1%)",
      "Core focus on embedded systems, data acquisition, and networked communication."
    ]
  }
];

export const researchProjects: Project[] = [
  {
    name: "Phase-Adaptive Communication and Exploration (PACE)",
    period: "Aug 2024 – present",
    role: "Core Member",
    organization: "Xidian University · NSFC Project",
    description:
      "Multi-agent reinforcement learning framework that adapts between distributed exploration and communication-driven pursuit under partial observability.",
    highlights: [
      "Achieved 91% pursuit success rate in 4v1 pursuit-evasion tasks, outperforming MADDPG baseline by 13%.",
      "Proposed SimHash-enhanced coordination to alleviate low observability and sparse reward regimes.",
      "Two patent applications covering system-level deployment on heterogeneous UAV teams."
    ],
    link: "https://github.com/Ronchy2000/Multi-agent-RL"
  },
  {
    name: "Autonomous UAV–Ground Vehicle Navigation & Control",
    period: "Apr 2025 – present",
    role: "Core Member",
    organization: "Meituan Academy of Robotics Shenzhen",
    description:
      "Hybrid perception and control stack enabling centimeter-level autonomous navigation through RGB, LiDAR, and odometry fusion.",
    highlights: [
      "Delivered dual-mode control (pose & velocity) within ROS, ensuring stable execution under motion constraints.",
      "Designed motion planner attaining 10 cm arrival accuracy in dynamic scenes."
    ]
  },
  {
    name: "Visual-Inertial SLAM for Autonomous UAVs",
    period: "Oct 2022 – Apr 2023",
    role: "Team Lead",
    organization: "Sichuan Normal University",
    description:
      "Developed a visual-inertial SLAM pipeline with path planning for autonomous flight in cluttered indoor environments.",
    highlights: [
      "Integrated IMU with stereo vision achieving 0.3 m positional RMSE over 10-minute flights.",
      "Implemented A* based navigation to traverse obstacle-dense warehouse layouts."
    ]
  }
];

export const openSourceProjects: Project[] = [
  {
    name: "Multi-agent-RL",
    period: "2023 – 2025",
    role: "Maintainer",
    organization: "Open-source",
    description:
      "Comprehensive reinforcement learning benchmarks for predator-prey pursuit games with MADDPG, MATD3, and MA/HAPPO implementations on PettingZoo environments.",
    highlights: [
      "Includes distributional RND exploration and communication-aware coordination baselines.",
      "Provides reproducible training scripts, experiment tracking, and visualization utilities."
    ],
    link: "https://github.com/Ronchy2000/Multi-agent-RL"
  },
  {
    name: "Dynamic-Proxy-Pool",
    period: "2024 – present",
    organization: "Open-source",
    description:
      "Auto-rotating proxy pool with Poisson-distributed intervals, headless browsing integration, and anti-detection heuristics for reliable data acquisition.",
    highlights: [
      "Supports 100+ proxy nodes with health monitoring.",
      "Designed for traffic boosting tasks (CSDN/GitHub) and anonymized browsing."
    ],
    link: "https://github.com/Ronchy2000/Dynamic-Proxy-Pool"
  },
  {
    name: "Raspi-ImmortalWrt",
    period: "2024",
    organization: "Open-source",
    description:
      "Step-by-step Raspberry Pi configuration guide for ImmortalWrt, covering OpenClash, DNS optimization, and multi-path routing.",
    highlights: [
      "Includes reproducible configs for home-lab networking.",
      "Focuses on latency-sensitive workloads and privacy-first routing."
    ],
    link: "https://github.com/Ronchy2000/Raspi-ImmortalWrt"
  }
];

export const internships: TimelineItem[] = [
  {
    title: "AI Software Development Engineer Intern",
    organization: "Huawei Technologies · MAE-M Development Dept. III",
    period: "Jun 2025 – Aug 2025",
    location: "Xi'an, China",
    highlights: [
      "Improved network element log synchronization throughput by 15% via pipeline refactoring.",
      "Reduced NELog query latency by 30% through modular workflow design."
    ]
  },
  {
    title: "Embedded Software Engineer Intern",
    organization: "Xi'an Jutong Magnetic Technology Co., Ltd.",
    period: "Jun 2023 – Sep 2023",
    location: "Xi'an, China",
    highlights: [
      "Optimized SPI communication stack across STM32 and C8051 platforms for industrial edge devices.",
      "Shortened motor control response latency from 15 ms to 3 ms while raising control accuracy to 95%."
    ]
  }
];

export const publications: Publication[] = [
  {
    id: "S.1",
    type: "S",
    title: "Cooperative Exploration and Control in Pursuit–Evasion Games with Reinforcement Learning",
    authors: "Rongqi Lu*, et al.",
    venue: "Manuscript in revision prior to submission",
    year: "2025",
    note: "Spearheaded PACE framework for adaptive multi-robot coordination."
  },
  {
    id: "C.1",
    type: "C",
    title:
      "TOTAL: Multi-Corner Timing Optimization Based on Transfer and Active Learning",
    authors: "Wei W. Xing, Zheng Xing, Rongqi Lu*, et al.",
    venue: "ACM/IEEE Design Automation Conference (DAC), CCF-A",
    year: "2023",
    link: "https://doi.org/10.1109/DAC56929.2023.10247914"
  }
];

export const patents: Publication[] = [
  {
    id: "P.1",
    type: "P",
    title:
      "An Intelligent Cooperative Pursuit Method and System Under Incomplete Information Conditions",
    authors: "Yuanshi Zheng, Rongqi Lu*, et al.",
    venue: "China National Patent No. 202510738071.X",
    year: "2025"
  },
  {
    id: "P.2",
    type: "P",
    title:
      "A Method and System for Cooperative Pursuit Planning of Heterogeneous UAVs Under Local Observation",
    authors: "Yuanshi Zheng, Rongqi Lu*, et al.",
    venue: "China National Patent No. 202511338072.1",
    year: "2025"
  },
  {
    id: "P.3",
    type: "P",
    title:
      "Collaborative Target Network-Based Multi-agent Cooperative Exploration Method and System",
    authors: "Yuanshi Zheng, Rongqi Lu*, et al.",
    venue: "China National Patent No. 202511464448.3",
    year: "2025"
  }
];

export const honors: Honor[] = [
  {
    title: "Graduate Scholarship (First Prize)",
    organization: "Xidian University",
    year: "2025"
  },
  {
    title: "Outstanding Graduate",
    organization: "Sichuan Provincial Department of Education",
    year: "2023"
  },
  {
    title: "National Scholarship",
    organization: "Ministry of Education of the People's Republic of China",
    year: "2022"
  },
  {
    title: "National Scholarship for Encouragement",
    organization: "Ministry of Education of the People's Republic of China",
    year: "2021"
  },
  {
    title: "Undergraduate Scholarship (First Prize)",
    organization: "Sichuan Normal University",
    year: "2020 · 2021"
  }
] as const;

export const skills: SkillCategory[] = [
  {
    name: "Programming",
    items: ["Python", "C/C++", "Matlab", "Verilog HDL", "JavaScript", "Web3 tooling"]
  },
  {
    name: "Machine Learning",
    items: ["PyTorch", "TensorFlow", "Scikit-learn"]
  },
  {
    name: "Embedded & Hardware",
    items: [
      "STM32 Series",
      "TI MSP430/432",
      "C8051 MCUs",
      "PCB Design (EasyEDA)",
      "Hardware-Software Co-development"
    ]
  },
  {
    name: "Languages",
    items: ["English (fluent)", "Chinese (native)"]
  }
];
