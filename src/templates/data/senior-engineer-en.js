export default {
  id: 'senior-engineer-en',
  name: 'Senior Software Engineer ATS',
  description: 'ATS-optimized senior resume • AI, distributed systems, high-impact delivery',
  lang: 'EN',
  tags: ['RAG', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],

  data: {
    meta: { lang: 'en' },

    header: {
      name: 'BERO',
      title: 'Senior Software Engineer',
      contact: {
        email: 'mail@bero.land',
        github: 'github.com/meunomeebero',
        linkedin: '',
        website: 'bero.land',
        location: '',
      },
    },

    show: { linkedin: false, website: true, location: false },

    sectionOrder: ['summary', 'skills', 'experience', 'education', 'languages'],

    labels: {
      summary:    'Professional Summary',
      skills:     'Technical Skills',
      experience: 'Professional Experience',
      education:  'Education',
      languages:  'Languages',
    },

    summary:
      'Full-stack Senior Software Engineer with **6+ years** building AI-powered applications, scalable distributed systems, and high-performance data pipelines. Proven expertise architecting **production RAG systems** with **vector databases (Qdrant, pgvector, Weaviate, FAISS)**, **LLM integration (GPT-4, Claude)**, document ingestion and semantic retrieval, achieving **40% conversion increase** and **60% support reduction**. Professional-level proficiency in **TypeScript + React**, **Node.js/TypeScript backend**, and **PostgreSQL**. Delivered AWS cloud infrastructure with **Docker** and **CI/CD**, architected ETL pipelines processing **10M+ records daily**, led teams of **8+ engineers**, and scaled SaaS to **$50K+ MRR**.',

    skills: [
      { category: 'AI & Data',              items: ['RAG (Retrieval-Augmented Generation)', 'Vector Databases (Qdrant, pgvector, Weaviate, FAISS)', 'LLM Integration (OpenAI GPT-4, Anthropic Claude)', 'Document Ingestion', 'Chunking', 'Embeddings', 'Semantic Search', 'Prompt Engineering'] },
      { category: 'Languages & Frameworks', items: ['TypeScript', 'JavaScript', 'Node.js (Nest.js, Express.js)', 'Go (Golang)', 'Python', 'React', 'Next.js', 'Prisma ORM', 'tRPC'] },
      { category: 'Data & Infrastructure',  items: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka', 'Apache Airflow', 'GraphQL', 'REST APIs', 'WebSockets'] },
      { category: 'Cloud & DevOps',         items: ['AWS (Lambda, ECS, S3, RDS, CloudWatch)', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD (GitHub Actions, Vercel)', 'Observability (OpenTelemetry, ELK)'] },
      { category: 'Testing & Practices',    items: ['Jest', 'Vitest', 'React Testing Library', 'TDD', 'Agile/Scrum', 'Technical Leadership', 'Microservices', 'Event-Driven Architecture'] },
    ],

    experience: [
      {
        company: 'Potato Labs', period: 'July 2025 - Present', role: 'Founder & Lead Engineer',
        bullets: [
          'Architected and deployed **production RAG system** using **Qdrant**, GPT-4 API, custom document chunking/ingestion pipeline, semantic embeddings, and retrieval optimization loops, achieving **40% conversion rate increase**, **85% answer accuracy**, and **60% reduction in support queries**.',
          'Built full-stack SaaS platform with **Go backend, Next.js 14/React/TypeScript frontend, PostgreSQL + Prisma, Redis, and tRPC**; implemented comprehensive testing with **80%+ coverage**, scaling to **500+ paying subscribers**, **6,000+ users**, and **$50K+ MRR**.',
          'Leveraged **AI-assisted development** (Claude Code, Copilot, MCP) to ship features **3x faster**; implemented **CI/CD** (GitHub Actions, Vercel), payments, and gamification that drove **75% retention**.',
        ],
      },
      {
        company: 'Cactus Data Inc.', period: 'September 2022 - August 2025', role: 'Senior Software Engineer',
        bullets: [
          'Engineered high-volume **ETL data pipeline** (**Nest.js, PostgreSQL, Kafka**) processing **10M+ records daily** with **99.9% accuracy**, enabling real-time analytics for **500+ school districts**.',
          'Architected API integrations handling millions of student and faculty records with **sub-500ms latency**, unlocking **$2M+ ARR** in enterprise segment and accelerating sales cycle by **40%**.',
          'Built **20+ production ETL workflows** (**Python, Airflow DAGs, GraphQL**), reducing ingestion time from **6 hours to 90 minutes (60% faster)** and saving **$120K annually**.',
        ],
      },
      {
        company: 'Banana Bank', period: 'June 2021 - August 2022', role: 'Tech Lead',
        bullets: [
          'Led **8+ engineers** delivering fintech MVP **2 weeks ahead of schedule**; led AWS migration (EC2, RDS, S3, Terraform) reducing deployment time by **75%** and saving **$15K/month**.',
          'Architected fault-tolerant **Golang microservice** for payment batch processing (**100K+ daily transactions**, **99.9% uptime**, sub-200ms latency, PCI-DSS compliant), handling **$10M+ monthly volume**.',
          'Built **event-driven microservices** (Express.js, Prisma, MongoDB, Kafka) for payment authorization and fraud detection, preventing **$200K+ fraud losses**.',
          'Remediated **15+ critical vulnerabilities** to achieve **SOC 2 compliance** and implemented observability (OpenTelemetry, ELK), reducing MTTR from **2h to 15min**.',
        ],
      },
      {
        company: 'Penguin Academy', period: 'August 2020 - June 2021', role: 'Software Engineer',
        bullets: [
          'Re-architected monolithic backend into **Nest.js microservices + PostgreSQL**, improving API response from **1.5s to 400ms (3x faster)** and scaling from **10K to 35K+ users**.',
          'Built **AWS serverless microservices** (Lambda, API Gateway, SQS, DynamoDB), including Stripe payment gateway processing **$500K+ monthly revenue** with **99.95% success rate**.',
          'Implemented Redis caching and query optimization, reducing DB load by **60%** and infrastructure cost by **$8K/month**.',
        ],
      },
      {
        company: 'Parrot Languages', period: 'March 2019 - August 2020', role: 'Software Engineer',
        bullets: [
          'Architected **microservices ecosystem** for AI-powered speech recognition (Node.js, TypeScript, React) serving **5,000+ students** across **50+ institutions**.',
          'Built centralized API gateway integrating speech-to-text, translation, and dictionary APIs (Express.js, TypeORM, PostgreSQL), processing **100K+ requests/month** with **99.5% uptime**.',
          'Developed speech analysis algorithm with **85% accuracy** against human evaluators, deployed as Next.js REST API handling **50K+ assessments/month**.',
        ],
      },
    ],

    education: [
      { degree: "Bachelor's Degree in Computer Science", institution: 'Random University', period: '2017 - 2021' },
    ],

    languages: [
      { language: 'English', level: 'Fluent - Professional Working Proficiency' },
      { language: 'Portuguese', level: 'Native' },
    ],
  },
}
