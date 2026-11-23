export const en = {
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    education: "Education",
    contact: "Contact",
    downloadCV: "Download CV",
    themeToggleLight: "Switch to Light Mode",
    themeToggleDark: "Switch to Dark Mode",
    language: "Language",
    menuOpen: "Open navigation menu",
    menuClose: "Close navigation menu",
  },
  hero: {
    badge: "OPEN TO PFE OPPORTUNITIES – 2027",
    greeting: "Hi, I'm",
    name: "Abderrahman El Harakani.",
    role: "Data Scientist & AI Engineer",
    roleTagline: "Building Intelligent Solutions.",
    description: "I'm a Data Science Master's student passionate about Artificial Intelligence, Machine Learning, and Data Analytics. I transform complex data into meaningful insights and build intelligent applications that solve real-world problems.",
    exploreProjects: "Explore My Projects",
    downloadCV: "Download My CV",
    getInTouch: "Get In Touch",
    githubTitle: "View GitHub Profile",
    linkedinTitle: "View LinkedIn Profile",
    emailTitle: "Send Email",
    illustrationAlt: "Interactive Data Science and AI Neural Architecture Visualization",
    photoPlaceholderHint: "Photo slot: Replace with your professional photograph or keep the interactive AI visual.",
  },
  about: {
    title: "About Me",
    subtitle: "Passionate about Data, Intelligence, and Innovation.",
    bio1: "I'm currently pursuing the second year of a Master's degree in Data Science at École Normale Supérieure (ENS) in Tétouan, Morocco.",
    bio2: "My interests lie at the intersection of Data Science and Artificial Intelligence. I work on predictive modeling, Deep Learning, Computer Vision, Generative AI, and Data Analytics.",
    bio3: "I enjoy developing complete solutions, from data collection and preprocessing to model development, evaluation, deployment, and interactive applications.",
    bio4: "I'm continuously learning and exploring emerging technologies to turn theoretical knowledge into practical solutions.",
    highlight1Title: "DATA SCIENCE",
    highlight1Desc: "Statistical analysis, predictive modeling, feature engineering, and extracting insights from complex datasets.",
    highlight2Title: "ARTIFICIAL INTELLIGENCE",
    highlight2Desc: "Machine Learning, Deep Learning, Computer Vision, and Generative AI applications.",
    highlight3Title: "AI ENGINEERING",
    highlight3Desc: "Building intelligent applications, integrating LLMs, developing APIs, and deploying AI solutions.",
  },
  skills: {
    title: "Technical Expertise",
    subtitle: "Technologies and tools I use to transform ideas into solutions.",
    cat1Title: "Programming & Data Processing",
    cat1Desc: "Core languages and quantitative computing libraries for data manipulation and statistical processing.",
    cat2Title: "Machine Learning",
    cat2Desc: "Supervised and unsupervised algorithms, feature engineering, and robust model evaluation pipelines.",
    cat3Title: "Deep Learning & Computer Vision",
    cat3Desc: "Neural architectures, transfer learning, image feature extraction, and real-time computer vision.",
    cat4Title: "Generative AI & LLM Engineering",
    cat4Desc: "Retrieval-Augmented Generation (RAG), vector embeddings, agentic workflows, and fast LLM inference.",
    cat5Title: "Data Analytics & Visualization",
    cat5Desc: "Exploratory data analysis, interactive business intelligence dashboards, and visual storytelling.",
    cat6Title: "Development & Databases",
    cat6Desc: "Modern API frameworks, relational and NoSQL databases, containerization, and version control.",
  },
  projects: {
    title: "Featured Projects",
    subtitle: "Turning ideas into practical intelligent solutions.",
    filterAll: "All Projects",
    filterAI: "Artificial Intelligence",
    filterML: "Machine Learning",
    filterDL: "Deep Learning",
    filterAnalytics: "Data Analytics",
    problemLabel: "Problem Solved",
    approachLabel: "Technical Approach",
    keyFeaturesLabel: "Key Capabilities",
    techLabel: "Tech Stack",
    viewDetails: "View Details",
    githubRepo: "GitHub Repository",
    liveDemo: "Live Demo",
    closeModal: "Close Project Details",
    comingSoon: "Link will be linked upon repository publication",

    // Project 1: TERRALIS
    terralis: {
      title: "Satellite Image Classification – TERRALIS",
      category: "Deep Learning / Computer Vision",
      description: "A satellite image classification project using Sentinel-2 imagery and the EuroSAT dataset, containing approximately 27,000 images across 10 land-use and land-cover classes.",
      problem: "Automating land-use and land-cover classification from high-resolution satellite imagery across diverse European terrestrial topographies.",
      approach: "Applied transfer learning benchmarks comparing ResNet50, EfficientNet-B0, and MobileNetV3 with rigorous preprocessing and deployed into a real-time Streamlit web app.",
      features: [
        "Transfer Learning implementation",
        "Empirical benchmark of ResNet50, EfficientNet-B0, and MobileNetV3",
        "Robust multispectral image preprocessing pipeline",
        "Comprehensive model evaluation & confusion matrix metrics",
        "Interactive inference dashboard integrated in Streamlit"
      ]
    },

    // Project 2: DocuMind AI
    documind: {
      title: "DocuMind AI – Intelligent PDF Assistant",
      category: "Artificial Intelligence / Generative AI",
      description: "An intelligent document question-answering application based on Retrieval-Augmented Generation.",
      problem: "Overcoming static PDF reading limitations by enabling contextual, semantic querying across dense technical and academic documents without hallucinations.",
      approach: "Built a production-grade RAG pipeline using LangChain, semantic chunking, Sentence Transformers embeddings, vector storage, and high-speed Groq API LLM inference.",
      features: [
        "Automated PDF extraction and clean text chunking",
        "Dense semantic embeddings with Sentence Transformers",
        "Vector-based similarity retrieval and reranking",
        "Contextual, grounded question answering with citations",
        "High-performance Groq API integration for sub-second responses"
      ]
    },

    // Project 3: Machine Learning Studio
    mlstudio: {
      title: "Machine Learning Studio – Interactive ML Platform",
      category: "Machine Learning",
      description: "An interactive application designed to simplify Machine Learning workflows.",
      problem: "Complex, code-heavy modeling pipelines create bottlenecks for rapid experimentation, exploratory analysis, and quick algorithm comparison.",
      approach: "Developed an end-to-end interactive platform in Streamlit featuring automated EDA, dynamic correlation heatmaps, one-click preprocessing, and multi-model training/evaluation.",
      features: [
        "Seamless CSV dataset upload & schema parsing",
        "Automated exploratory data analysis with Plotly visualizations",
        "Interactive correlation matrices and distribution plots",
        "Automated feature encoding and missing value imputation",
        "Multi-model training with comparative accuracy, precision, and recall metrics"
      ]
    },

    // Project 4: Sales & Operations Dashboard
    sales: {
      title: "Sales & Operations Analytics Dashboard",
      category: "Data Analytics",
      description: "An interactive Power BI dashboard designed to analyze business performance and operational metrics.",
      problem: "Disparate business data sources made it difficult to gain real-time visibility into sales trends, regional distribution, and supply operations.",
      approach: "Engineered robust star-schema data models in Power Query, crafted DAX measures for year-over-year revenue velocity, and built intuitive multi-tier executive dashboards.",
      features: [
        "Core revenue, margin, and volume sales KPIs",
        "Product category performance and basket breakdown",
        "Geographic performance heatmaps and market penetration views",
        "Operational efficiency and fulfillment bottleneck tracking",
        "Fully interactive cross-filtering and drill-through navigation"
      ]
    },

    // Project 5: Healthcare Emergency Analytics
    healthcare: {
      title: "Healthcare Emergency Analytics Dashboard",
      category: "Data Analytics",
      description: "A healthcare analytics dashboard focused on emergency department performance.",
      problem: "Emergency departments face overcrowding and unpredictable patient flows that challenge resource allocation and increase waiting times.",
      approach: "Transformed historical triage and admissions records into an analytical Power BI suite tracking critical patient flow bottlenecks and clinician capacity.",
      features: [
        "Emergency department admission trends and triage severity tracking",
        "Patient waiting-time monitoring against clinical SLA thresholds",
        "Healthcare operational performance and bed-turnover indicators",
        "Peak-hour admissions forecasting and shift-level workload insights",
        "Granular patient demographic and departmental drill-down views"
      ]
    }
  },
  education: {
    title: "Education & Academic Background",
    subtitle: "Solid theoretical grounding and applied mathematical foundations.",
    degree: "Master's Degree in Data Science – Second Year",
    institution: "École Normale Supérieure (ENS), Tétouan, Morocco",
    period: "2025 – Present",
    description: "Advanced studies in Data Science, Statistics, Machine Learning, Deep Learning, Optimization, and Artificial Intelligence.",
    academicPillarsTitle: "Key Academic Pillars",
    pillars: [
      "Statistical Learning & Advanced Probability",
      "Deep Learning Architectures & Computer Vision",
      "Mathematical Optimization & Predictive Modeling",
      "Big Data Systems, Cloud & AI Engineering"
    ]
  },
  focus: {
    title: "What I'm Exploring",
    subtitle: "Continuous learning and emerging technological frontiers.",
    card1Title: "Generative AI & LLM Engineering",
    card1Desc: "Exploring RAG architectures, embeddings, vector databases, LLM applications, and intelligent AI assistants.",
    card1Topics: ["RAG Pipelines", "Vector Databases", "Prompt Engineering", "Autonomous Agents"],
    card2Title: "MLOps & AI Deployment",
    card2Desc: "Learning how to build reproducible, scalable, and production-ready Machine Learning systems.",
    card2Topics: ["Docker Containerization", "FastAPI Endpoints", "Model Monitoring", "CI/CD for ML"],
    card3Title: "Advanced Data Science",
    card3Desc: "Deepening knowledge in statistical learning, optimization, predictive modeling, and advanced analytics.",
    card3Topics: ["Statistical Inference", "Convex Optimization", "Time Series", "Ensemble Methods"],
  },
  contact: {
    title: "Let's Build Something Intelligent Together.",
    subtitle: "I'm always interested in discussing Data Science, Artificial Intelligence, innovative projects, and professional opportunities.",
    availabilityNotice: "Available for 2027 End-of-Studies Internship (PFE) in Morocco or Internationally.",
    formName: "Full Name",
    formNamePlaceholder: "e.g. Sarah Connor",
    formEmail: "Email Address",
    formEmailPlaceholder: "e.g. sarah@example.com",
    formSubject: "Subject",
    formSubjectPlaceholder: "e.g. PFE Opportunity / AI Collaboration",
    formMessage: "Message",
    formMessagePlaceholder: "Describe your project, team, or opportunity...",
    submitBtn: "Send Message",
    submittingBtn: "Sending Message...",
    successTitle: "Message Sent Successfully!",
    successDesc: "Thank you for reaching out. I will get back to you promptly.",
    errorTitle: "Submission Incomplete",
    errorDesc: "Please verify that all required fields are filled out with a valid email.",
    directEmailLabel: "Direct Email",
    linkedinLabel: "LinkedIn Profile",
    githubLabel: "GitHub Profile",
    locationLabel: "Location",
    locationValue: "Morocco",
    statusBadge: "Active Candidate",
  },
  cvModal: {
    title: "Curriculum Vitae – Abderrahman El Harakani",
    subtitle: "Data Scientist | AI Engineer",
    previewNotice: "Official CV document is configured. You can download the current copy or review the credentials below.",
    downloadBtn: "Download PDF CV",
    closeBtn: "Close",
    replaceHint: "To update with your final PDF, simply place your file at public/Abderrahman_El_Harakani_CV.pdf.",
  },
  footer: {
    role: "Data Scientist | AI Engineer",
    description: "Transforming complex data into predictive intelligence and building robust AI systems.",
    quickLinks: "Quick Links",
    connect: "Connect",
    rights: "All rights reserved.",
    builtWith: "Designed & engineered with React, TypeScript & Tailwind CSS",
  }
};
