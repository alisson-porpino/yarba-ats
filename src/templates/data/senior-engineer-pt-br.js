export default {
  id: 'senior-engineer-pt-br',
  name: 'Engenheiro de Software Sênior ATS',
  description: 'Currículo ATS em português • IA, sistemas distribuídos e impacto mensurável',
  lang: 'PT-BR',
  tags: ['RAG', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],

  data: {
    meta: { lang: 'pt_br' },

    header: {
      name: 'BERO',
      title: 'Engenheiro de Software Sênior',
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
      summary:    'Resumo Profissional',
      skills:     'Habilidades Técnicas',
      experience: 'Experiência Profissional',
      education:  'Formação Acadêmica',
      languages:  'Idiomas',
    },

    summary:
      'Engenheiro de Software Sênior full-stack com **6+ anos** construindo aplicações com IA, sistemas distribuídos escaláveis e pipelines de dados de alta performance. Forte experiência em **RAG em produção**, com **bancos vetoriais (Qdrant, pgvector, Weaviate, FAISS)**, **integração com LLMs (GPT-4, Claude)**, ingestão de documentos e recuperação semântica, gerando **+40% de conversão** e **-60% de suporte**. Domínio profissional em **TypeScript + React**, **backend Node.js/TypeScript** e **PostgreSQL**. Entregas em AWS com **Docker** e **CI/CD**, pipelines ETL com **10M+ registros/dia**, liderança de times com **8+ engenheiros** e escala de SaaS para **$50K+ MRR**.',

    skills: [
      { category: 'IA & Dados',                items: ['RAG (Retrieval-Augmented Generation)', 'Bancos Vetoriais (Qdrant, pgvector, Weaviate, FAISS)', 'Integração com LLMs (OpenAI GPT-4, Anthropic Claude)', 'Ingestão de Documentos', 'Chunking', 'Embeddings', 'Busca Semântica', 'Prompt Engineering'] },
      { category: 'Linguagens & Frameworks',   items: ['TypeScript', 'JavaScript', 'Node.js (Nest.js, Express.js)', 'Go (Golang)', 'Python', 'React', 'Next.js', 'Prisma ORM', 'tRPC'] },
      { category: 'Dados & Infraestrutura',    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka', 'Apache Airflow', 'GraphQL', 'REST APIs', 'WebSockets'] },
      { category: 'Cloud & DevOps',            items: ['AWS (Lambda, ECS, S3, RDS, CloudWatch)', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD (GitHub Actions, Vercel)', 'Observabilidade (OpenTelemetry, ELK)'] },
      { category: 'Testes & Boas Práticas',    items: ['Jest', 'Vitest', 'React Testing Library', 'TDD', 'Agile/Scrum', 'Liderança Técnica', 'Microservices', 'Arquitetura Orientada a Eventos'] },
    ],

    experience: [
      {
        company: 'Potato Labs', period: 'Jul 2025 - Presente', role: 'Fundador e Lead Engineer',
        bullets: [
          'Arquitetei e implantei **sistema RAG em produção** com **Qdrant**, API GPT-4, pipeline de ingestão e chunking de documentos, embeddings semânticos e otimização de retrieval, alcançando **+40% de conversão**, **85% de acurácia** e **-60% de tickets de suporte**.',
          'Construí plataforma SaaS full-stack com **backend Go, frontend Next.js 14/React/TypeScript, PostgreSQL + Prisma, Redis e tRPC**, com suíte de testes abrangente (**80%+ de cobertura**), escalando para **500+ assinantes pagantes**, **6.000+ usuários** e **$50K+ MRR**.',
          'Acelerei entregas com **desenvolvimento assistido por IA** (Claude Code, Copilot, MCP), reduzindo ciclo de entrega em **3x**; implementei **CI/CD** (GitHub Actions, Vercel), pagamentos e gamificação com **75% de retenção**.',
        ],
      },
      {
        company: 'Cactus Data Inc.', period: 'Set 2022 - Ago 2025', role: 'Senior Software Engineer',
        bullets: [
          'Engenhei pipeline ETL de alto volume (**Nest.js, PostgreSQL, Kafka**) processando **10M+ registros/dia** com **99,9% de acurácia**, habilitando analytics em tempo real para **500+ distritos escolares**.',
          'Arquitetei integrações de API com milhões de registros (latência **sub-500ms**), destravando **$2M+ ARR** no segmento enterprise e acelerando o ciclo comercial em **40%**.',
          'Implementei **20+ workflows ETL em produção** (**Python, Airflow DAGs, GraphQL**), reduzindo ingestão de **6h para 90min (60% mais rápido)** e gerando economia anual de **$120K**.',
        ],
      },
      {
        company: 'Banana Bank', period: 'Jun 2021 - Ago 2022', role: 'Tech Lead',
        bullets: [
          'Liderei **8+ engenheiros** e entreguei MVP fintech **2 semanas antes** do prazo; conduzi migração AWS (EC2, RDS, S3, Terraform), reduzindo deploy em **75%** e economizando **$15K/mês**.',
          'Arquitetei microserviço resiliente em **Golang** para lotes de pagamento (**100K+ transações/dia**, **99,9% uptime**, latência sub-200ms, PCI-DSS), processando **$10M+ por mês**.',
          'Implementei microserviços orientados a eventos (Express.js, Prisma, MongoDB, Kafka) para autorização e antifraude, evitando **$200K+ em perdas**.',
          'Corrigi **15+ vulnerabilidades críticas** para atingir **SOC 2** e implementei observabilidade (OpenTelemetry, ELK), reduzindo MTTR de **2h para 15min**.',
        ],
      },
      {
        company: 'Penguin Academy', period: 'Ago 2020 - Jun 2021', role: 'Software Engineer',
        bullets: [
          'Rearquitetei backend monolítico para **microserviços em Nest.js + PostgreSQL**, melhorando resposta de API de **1,5s para 400ms (3x mais rápido)** e escalando de **10K para 35K+ usuários**.',
          'Construí microserviços serverless na AWS (Lambda, API Gateway, SQS, DynamoDB), incluindo gateway Stripe com **$500K+ de receita mensal** e **99,95% de sucesso**.',
          'Implementei cache Redis e otimização de queries, reduzindo carga no banco em **60%** e custo de infraestrutura em **$8K/mês**.',
        ],
      },
      {
        company: 'Parrot Languages', period: 'Mar 2019 - Ago 2020', role: 'Software Engineer',
        bullets: [
          'Arquitetei ecossistema de microserviços para reconhecimento de fala com IA (Node.js, TypeScript, React), atendendo **5.000+ estudantes** em **50+ instituições**.',
          'Construí API gateway centralizada integrando speech-to-text, tradução e dicionários (Express.js, TypeORM, PostgreSQL), processando **100K+ requisições/mês** com **99,5% de uptime**.',
          'Desenvolvi algoritmo de análise de fala com **85% de acurácia** frente a avaliadores humanos, exposto via API REST Next.js para **50K+ avaliações/mês**.',
        ],
      },
    ],

    education: [
      { degree: 'Bacharelado em Ciência da Computação', institution: 'Random University', period: '2017 - 2021' },
    ],

    languages: [
      { language: 'Português', level: 'Nativo' },
      { language: 'Inglês', level: 'Fluente - Proficiência Profissional de Trabalho' },
    ],
  },
}
