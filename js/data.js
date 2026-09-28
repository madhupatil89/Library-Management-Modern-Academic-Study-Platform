/**
 * Library Management - Initial Curated Study & Academic Resources Database
 * Highly detailed academic catalog spanning major university faculties.
 */

const INITIAL_BOOKS = [
  {
    id: "bk-101",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    category: "Computer Science & AI",
    isbn: "978-0134610993",
    rating: 4.9,
    reviewsCount: 342,
    publishedYear: 2022,
    copiesTotal: 8,
    copiesAvailable: 5,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    summary: "The definitive global authority on AI theory, heuristic algorithms, deep neural architectures, probabilistic reasoning, and multi-agent reinforcement models.",
    tableOfContents: [
      "1. Introduction to Intelligent Agents",
      "2. Solving Problems by Searching (A*, Heuristics)",
      "3. Knowledge, Logic and First-Order Inference",
      "4. Deep Learning & Transformer Architectures",
      "5. Ethical AI, Safety, and Governance"
    ],
    sampleExcerpt: "Artificial intelligence is a vast field of inquiry concerned with building computational agents capable of acting rationally in complex, uncertain environments. Rational action entails choosing actions that maximize the expected value of an objective metric given prior knowledge and percept history.",
    isDigital: true,
    pages: 1152,
    shelfLocation: "Building B • Floor 3 • CS-A4"
  },
  {
    id: "bk-102",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Computer Science & AI",
    isbn: "978-1449373320",
    rating: 5.0,
    reviewsCount: 512,
    publishedYear: 2021,
    copiesTotal: 6,
    copiesAvailable: 2,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    summary: "An essential handbook exploring the principles, trade-offs, and architecture behind reliable, scalable, and maintainable distributed data systems.",
    tableOfContents: [
      "1. Reliability, Scalability, and Maintainability",
      "2. Data Models and Query Languages",
      "3. Storage Engines and Indexes (LSM-trees & B-trees)",
      "4. Replication, Partitioning & Transactions",
      "5. Stream Processing and Consensus Protocols"
    ],
    sampleExcerpt: "Data systems are no longer singular monolithic databases. Modern applications leverage heterogeneous combinations of key-value caches, full-text search indexes, message brokers, and analytical OLAP engines stitched together into a cohesive distributed pipeline.",
    isDigital: true,
    pages: 616,
    shelfLocation: "Building B • Floor 3 • CS-D12"
  },
  {
    id: "bk-103",
    title: "Principles of Neural Science",
    author: "Eric R. Kandel et al.",
    category: "Medical & Healthcare",
    isbn: "978-0071390118",
    rating: 4.8,
    reviewsCount: 198,
    publishedYear: 2021,
    copiesTotal: 4,
    copiesAvailable: 3,
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    summary: "Renowned medical standard dissecting molecular neurobiology, synaptic plasticity, cognitive function, and neuropathological diseases.",
    tableOfContents: [
      "1. Cellular Mechanisms of Neurons",
      "2. Synaptic Transmission & Neurotransmitters",
      "3. The Neural Basis of Cognition & Perception",
      "4. Memory Encoding, Consolidation & Recall",
      "5. Neurological Disorders & Neurogenetics"
    ],
    sampleExcerpt: "The fundamental challenge of neuroscience is to understand how the brain produces consciousness, perception, memory, and voluntary movement from the electrical and biochemical activity of billions of individual nerve cells.",
    isDigital: false,
    pages: 1760,
    shelfLocation: "Health Sciences Annex • Floor 2 • MED-N1"
  },
  {
    id: "bk-104",
    title: "Campbell Biology (12th Edition)",
    author: "Lisa A. Urry & Michael L. Cain",
    category: "Medical & Healthcare",
    isbn: "978-0135188743",
    rating: 4.9,
    reviewsCount: 420,
    publishedYear: 2020,
    copiesTotal: 10,
    copiesAvailable: 7,
    coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
    summary: "The global benchmark in biological sciences, delivering deep insights into cellular genetics, metabolic evolution, ecology, and anatomy.",
    tableOfContents: [
      "1. Chemistry of Life & Macromolecules",
      "2. Cell Structure & Membrane Dynamics",
      "3. Genetic Mechanisms & Recombinant DNA",
      "4. Plant and Animal Physiology",
      "5. Ecology, Ecosystems, and Conservation"
    ],
    sampleExcerpt: "Life is characterized by an astonishing unity at the biochemical level alongside breathtaking diversity across species. Living systems maintain internal homeostatic equilibrium through negative feedback loops and active metabolic transport.",
    isDigital: true,
    pages: 1488,
    shelfLocation: "Health Sciences Annex • Floor 1 • BIO-C08"
  },
  {
    id: "bk-105",
    title: "Introduction to Electrodynamics",
    author: "David J. Griffiths",
    category: "Engineering & Physics",
    isbn: "978-1108420419",
    rating: 4.9,
    reviewsCount: 285,
    publishedYear: 2023,
    copiesTotal: 7,
    copiesAvailable: 4,
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
    summary: "Acclaimed undergraduate and graduate text covering vector calculus, electrostatics, magnetostatics, Maxwell's equations, and electromagnetic radiation.",
    tableOfContents: [
      "1. Vector Analysis and Curvilinear Coordinates",
      "2. Electrostatics & Gauss's Law",
      "3. Special Techniques (Laplace & Separation of Variables)",
      "4. Magnetostatics, Lorentz Force & Biot-Savart Law",
      "5. Maxwell's Equations and Wave Guides"
    ],
    sampleExcerpt: "Maxwell's synthesis of electricity, magnetism, and optics stands as one of the supreme conceptual achievements in theoretical physics, showing that light itself is a propagating transverse wave of coupled electromagnetic fields.",
    isDigital: false,
    pages: 624,
    shelfLocation: "Science & Engineering Tower • Floor 4 • PHY-G02"
  },
  {
    id: "bk-106",
    title: "Linear Algebra Done Right",
    author: "Sheldon Axler",
    category: "Mathematics & Statistics",
    isbn: "978-3031410253",
    rating: 4.8,
    reviewsCount: 310,
    publishedYear: 2024,
    copiesTotal: 5,
    copiesAvailable: 3,
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    summary: "A pure and clean treatment of vector spaces, linear transformations, spectral theory, and inner product spaces without unnecessary determinants.",
    tableOfContents: [
      "1. Vector Spaces & Subspaces",
      "2. Finite-Dimensional Vector Spaces",
      "3. Linear Maps and Invertibility",
      "4. Eigenvalues, Eigenvectors & Invariant Subspaces",
      "5. Inner Product Spaces and Spectral Theorems"
    ],
    sampleExcerpt: "Linear algebra is the study of linear transformations between vector spaces. By shifting the central focus away from tedious determinant formulas and onto linear operators, mathematical beauty and intuition become crystal clear.",
    isDigital: true,
    pages: 360,
    shelfLocation: "Main Wing • Floor 2 • MATH-L04"
  },
  {
    id: "bk-107",
    title: "Economics: Principles in Action",
    author: "N. Gregory Mankiw",
    category: "Business & Economics",
    isbn: "978-0357133484",
    rating: 4.7,
    reviewsCount: 220,
    publishedYear: 2021,
    copiesTotal: 9,
    copiesAvailable: 6,
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    summary: "Clear, engaging walkthrough of microeconomic incentives, macroeconomic fiscal policy, trade balances, and monetary mechanisms shaping modern markets.",
    tableOfContents: [
      "1. Ten Core Principles of Economics",
      "2. Market Forces: Supply, Demand & Elasticity",
      "3. Consumers, Producers & Efficiency",
      "4. Macroeconomic Indicators: GDP, Inflation & Unemployment",
      "5. Monetary Policy and International Financial Markets"
    ],
    sampleExcerpt: "Economics is fundamentally the study of how society allocates its scarce resources among competing ends. Individuals face trade-offs, and the true cost of an endeavor is measured by what one foregoes to pursue it.",
    isDigital: true,
    pages: 864,
    shelfLocation: "Commerce Library • Floor 1 • ECON-M15"
  },
  {
    id: "bk-108",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Computer Science & AI",
    isbn: "978-0132350884",
    rating: 4.8,
    reviewsCount: 780,
    publishedYear: 2019,
    copiesTotal: 12,
    copiesAvailable: 4,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    summary: "The industry cornerstone on naming conventions, refactoring, unit testing patterns, code smells, and writing resilient readable programs.",
    tableOfContents: [
      "1. Meaningful Names and Function Design",
      "2. Formatting and Code Structure",
      "3. Error Handling without Clutter",
      "4. Unit Tests and Test-Driven Development (TDD)",
      "5. Refactoring Legacy Systems & Code Smells"
    ],
    sampleExcerpt: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written software.",
    isDigital: true,
    pages: 464,
    shelfLocation: "Building B • Floor 3 • CS-C09"
  },
  {
    id: "bk-109",
    title: "Structural Engineering: Theory & Analysis",
    author: "Russell C. Hibbeler",
    category: "Engineering & Physics",
    isbn: "978-0134610672",
    rating: 4.7,
    reviewsCount: 165,
    publishedYear: 2022,
    copiesTotal: 6,
    copiesAvailable: 4,
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    summary: "Comprehensive guide to static equilibrium, trusses, shear forces, deflection calculations, and dynamic loading across modern civil architecture.",
    tableOfContents: [
      "1. Types of Structures and Loads",
      "2. Analysis of Statically Determinate Trusses",
      "3. Internal Loadings in Structural Members",
      "4. Cables and Arches",
      "5. Influence Lines for Beams and Frames"
    ],
    sampleExcerpt: "A structure refers to a system of connected parts used to support a load. The structural engineer must design with safety, economic cost, durability, and serviceability as paramount design criteria.",
    isDigital: false,
    pages: 720,
    shelfLocation: "Science & Engineering Tower • Floor 2 • ENG-S18"
  },
  {
    id: "bk-110",
    title: "To Kill a Mockingbird: Critical Perspectives",
    author: "Harper Lee & Harold Bloom (Ed.)",
    category: "Literature & Humanities",
    isbn: "978-0060935467",
    rating: 4.9,
    reviewsCount: 650,
    publishedYear: 2018,
    copiesTotal: 15,
    copiesAvailable: 11,
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
    summary: "A timeless exploration of moral courage, racial inequality, judicial integrity, and human empathy in the American Deep South.",
    tableOfContents: [
      "1. Historical Context of Maycomb, Alabama",
      "2. Atticus Finch: Conscience as a Legal Duty",
      "3. The Metaphor of the Mockingbird",
      "4. The Growth of Scout and Jem",
      "5. Selected Critical Essays & Thematic Commentary"
    ],
    sampleExcerpt: "Real courage is when you know you're licked before you begin, but you begin anyway and see it through no matter what. You rarely win, but sometimes you do.",
    isDigital: true,
    pages: 336,
    shelfLocation: "Main Wing • Floor 1 • LIT-A02"
  },
  {
    id: "bk-111",
    title: "Deep Learning with Python & PyTorch",
    author: "François Chollet & Eli Stevens",
    category: "Computer Science & AI",
    isbn: "978-1617295263",
    rating: 4.9,
    reviewsCount: 380,
    publishedYear: 2023,
    copiesTotal: 8,
    copiesAvailable: 5,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    summary: "Hands-on guide to deep neural networks, computer vision convolutional pipelines, recurrent time-series models, and modern generative transformers.",
    tableOfContents: [
      "1. What is Deep Learning & Mathematical Tensors",
      "2. Neural Networks from Scratch",
      "3. Computer Vision: CNNs and Transfer Learning",
      "4. Sequence Models, Attention & Transformers",
      "5. Generative Models (VAEs & Diffusion)"
    ],
    sampleExcerpt: "Deep learning has unleashed revolutions in natural language synthesis, autonomous navigation, and protein folding. Behind every breakthrough lies the backpropagation algorithm calculating parameter gradients through automatic differentiation.",
    isDigital: true,
    pages: 504,
    shelfLocation: "Building B • Floor 3 • CS-P18"
  },
  {
    id: "bk-112",
    title: "Probability and Statistical Inference",
    author: "Robert V. Hogg & Elliot A. Tanis",
    category: "Mathematics & Statistics",
    isbn: "978-0135189399",
    rating: 4.8,
    reviewsCount: 145,
    publishedYear: 2021,
    copiesTotal: 5,
    copiesAvailable: 2,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    summary: "Solid foundational text on probability spaces, conditional distributions, maximum likelihood estimation, hypothesis testing, and Bayesian analysis.",
    tableOfContents: [
      "1. Probability Spaces and Combinatorial Methods",
      "2. Discrete and Continuous Random Variables",
      "3. Central Limit Theorem and Sampling Distributions",
      "4. Point Estimation & Confidence Intervals",
      "5. Hypothesis Testing and Nonparametric Methods"
    ],
    sampleExcerpt: "Statistical inference provides the mathematical framework for making decisions under uncertainty. Through probability models, we quantify the confidence with which assertions about reality may be drawn from limited observations.",
    isDigital: false,
    pages: 576,
    shelfLocation: "Main Wing • Floor 2 • STAT-B07"
  }
];

// Initial Study Desk Layout Configuration
const INITIAL_STUDY_DESKS = [
  { id: "A-01", zone: "Silent Pod", status: "available", features: "Dual Monitor, USB-C, Lamp" },
  { id: "A-02", zone: "Silent Pod", status: "booked", bookedBy: "Alex Chen", time: "14:00 - 16:00", features: "Dual Monitor, USB-C, Lamp" },
  { id: "A-03", zone: "Silent Pod", status: "available", features: "Ergonomic Chair, Lamp" },
  { id: "A-04", zone: "Silent Pod", status: "available", features: "Window View, Power Outlet" },
  { id: "B-01", zone: "Collaborative Desk", status: "available", features: "Whiteboard, 4 Seats, Screen" },
  { id: "B-02", zone: "Collaborative Desk", status: "booked", bookedBy: "Robotics Club", time: "15:00 - 18:00", features: "Whiteboard, 4 Seats, Screen" },
  { id: "B-03", zone: "Collaborative Desk", status: "available", features: "Power Strip, 6 Seats" },
  { id: "B-04", zone: "Collaborative Desk", status: "available", features: "Whiteboard, High-speed LAN" },
  { id: "C-01", zone: "Research Lab", status: "booked", bookedBy: "Sophia Patel", time: "10:00 - 18:00", features: "GPU Workstation, Linux Lab" },
  { id: "C-02", zone: "Research Lab", status: "available", features: "GPU Workstation, Dual 4K" },
  { id: "C-03", zone: "Research Lab", status: "available", features: "Bloomberg Terminal, Quiet" },
  { id: "C-04", zone: "Research Lab", status: "available", features: "Microfilm Scanner, Audio Station" }
];

// Digital Study Materials / Downloadable Guides
const STUDY_RESOURCES = [
  {
    id: "res-01",
    title: "Data Structures & Algorithms Cheat Sheet 2026",
    format: "PDF Guide",
    size: "4.2 MB",
    pages: 18,
    category: "Computer Science",
    downloads: 1240,
    icon: "fa-code"
  },
  {
    id: "res-02",
    title: "Calculus & Differential Equations Formula Bible",
    format: "PDF Guide",
    size: "2.8 MB",
    pages: 12,
    category: "Mathematics",
    downloads: 980,
    icon: "fa-square-root-variable"
  },
  {
    id: "res-03",
    title: "Biochemistry & Cellular Metabolism Pathways Chart",
    format: "High-Res Poster",
    size: "8.5 MB",
    pages: 4,
    category: "Medical",
    downloads: 730,
    icon: "fa-dna"
  },
  {
    id: "res-04",
    title: "Research Paper Citation Guide (IEEE, APA, Harvard)",
    format: "Handbook",
    size: "1.9 MB",
    pages: 24,
    category: "Academic Skills",
    downloads: 1540,
    icon: "fa-graduation-cap"
  }
];

// Initial FAQ
const LIBRARY_FAQS = [
  {
    question: "What is the borrowing limit for undergraduate and graduate students?",
    answer: "Undergraduates can borrow up to 5 physical books for a period of 14 days. Graduate students and research fellows are permitted up to 10 books for 30 days. Digital resources (e-books) have unlimited instantaneous 7-day checkout."
  },
  {
    question: "Can I renew books online without visiting the counter?",
    answer: "Yes! Using our 'My Dashboard' section on this Library Management portal, you can renew any borrowed title for an additional 7 days with a single click, provided no other student has placed a hold on it."
  },
  {
    question: "How do silent study pods and collaborative room bookings work?",
    answer: "Study spaces can be reserved up to 48 hours in advance via our interactive 'Study Space' seat reservation system. Reservations are confirmed instantaneously and linked to your digital Library Management Pass."
  },
  {
    question: "Are digital previews and notes accessible off-campus?",
    answer: "All digital reading previews, chapter excerpts, and study notes in the Library Management system are accessible 24/7 from any device with full bookmarking support."
  }
];
