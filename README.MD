# Sistema de Geração de Provas em PDF

## 📋 Resumo Executivo

Sistema web desenvolvido para automatizar o processo de criação, composição e geração de provas acadêmicas em formato PDF. A solução permite que professores criem bancos de questões reutilizáveis, componham provas personalizadas e gerem múltiplas versões embaralhadas com gabaritos separados, otimizando o tempo de preparação de avaliações e reduzindo riscos de cola.

**Objetivo Principal:** Transformar a criação manual de provas em um processo digital, ágil, seguro e, principalmente, econômico.

**Impacto Esperado:**
- Redução drástica no tempo de formatação de provas.
- Eliminação de erros manuais na correção e composição de gabaritos
- Facilitar reutilização de questões entre diferentes avaliações
- Mitigação de "colas" através da geração automática de versões embaralhadas (A, B, C).

---

## 🎯 O Problema: Sobrecarga Docente e Escassez de Recursos

### Contexto Atual
No cenário da educação pública, professores e gestores enfrentam um dilema diário: a necessidade de avaliar com qualidade *versus* a escassez de tempo e verba. O processo tradicional de elaboração de provas tornou-se insustentável devido a quatro fatores críticos:

### 1. Sobrecarga e Saúde do Professor (Burnout)
O tempo gasto com burocracia subtrai horas de planejamento pedagógico e descanso.
* **Tempo Desproporcional:** Professores gastam mais de 6 horas semanais apenas criando e corrigindo atividades manuais (dados TALIS/Jeduca).
* **Trabalho Braçal:** A formatação manual em editores de texto comuns (Word/Docs) é repetitiva, frustrante e consome a energia que deveria estar na sala de aula.
* **Retrabalho:** A dificuldade em reaproveitar questões antigas obriga o docente a "reinventar a roda" a cada bimestre.

### 2. Ineficiência Financeira e Material (O Diferencial de Custo)
Em escolas com orçamentos limitados, a falta de otimização na impressão gera desperdício de verba pública.
* **Layouts Não Otimizados:** Provas formatadas manualmente raramente consideram economia de tinta ou papel, gerando custos até 50% maiores do que o necessário.
* **Falta de Acessibilidade:** A ausência de padronização visual dificulta a leitura para alunos com necessidades específicas, exigindo reimpressões ou adaptações manuais demoradas.

### 3. Gestão Descentralizada e Perda de Dados
A falta de um sistema unificado gera desorganização no acervo intelectual da escola.
* **Dispersão de Conteúdo:** Questões ficam espalhadas em pen-drives, e-mails e papéis soltos, sem categorização por dificuldade ou disciplina.
* **Risco de Perda:** Sem backup centralizado, anos de trabalho de um professor podem ser perdidos por falhas em computadores pessoais.

### 4. Vulnerabilidade e Erros Manuais
O fator humano no processo repetitivo aumenta a incidência de falhas.
* **Risco de Fraude (Cola):** A dificuldade em criar múltiplas versões da mesma prova facilita o compartilhamento de respostas entre turmas.
* **Inconsistências:** Erros de gabarito e formatação desconfigurada são comuns quando o professor está sobrecarregado.

---

### 🚀 Por que o "Prova Rápida" é a Solução?
O projeto não é apenas um gerador de provas, mas uma ferramenta de **gestão de recursos e tempo**. Ao automatizar a diagramação com foco em **economia de tinta/papel** e centralizar o banco de questões, o sistema ataca a raiz do adoecimento docente e oferece viabilidade econômica para a escola pública, garantindo avaliações acessíveis, seguras e de baixo custo.

### Visão Geral
Sistema web fullstack que centraliza todo o ciclo de vida de criação de provas acadêmicas, desde a composição do banco de questões até a geração final de PDFs prontos para impressão.

### Funcionalidades Principais

#### 1. **Gestão de Banco de Questões**
- Criação de questões de múltipla escolha com alternativas
- Categorização por disciplina, dificuldade e tags
- Sistema de questões públicas (compartilháveis) e privadas
- Busca textual e filtros avançados
- Prevenção de exclusão de questões já utilizadas em provas

#### 2. **Composição de Provas**
- Interface intuitiva para seleção de questões do banco
- Adição de questões em ordem personalizada
- Prévia da prova antes da finalização
- Duplicação de provas para reutilização
- Sistema de rascunho vs. provas finalizadas

#### 3. **Geração de Versões Embaralhadas**
- Algoritmo de embaralhamento baseado em seed reproduzível
- Geração de múltiplas versões (A, B, C, etc.)
- Rastreamento de cada versão gerada
- Garantia de consistência: mesma seed = mesma ordem

#### 4. **Exportação em PDF**
- Geração de PDF da prova sem respostas marcadas
- Geração de PDF do gabarito com respostas corretas
- Suporte a múltiplas versões embaralhadas
- Formatação profissional com cabeçalho e identificação
- Quebra de página inteligente (questões não divididas)

#### 5. **Sistema de Autenticação**
- Cadastro e login de professores
- Proteção de rotas com JWT
- Gerenciamento de perfil de usuário

### Como Atende ao Problema


---

## 🛠️ Processo de Desenvolvimento

### Metodologias Aplicadas

#### 1. **Design Thinking**
- **Empatia:** Entrevistas com professores para entender dores reais
- **Definição:** Mapeamento dos fluxos críticos (criar questão → compor prova → gerar PDF)
- **Ideação:** Brainstorming de features essenciais
- **Prototipação:** Desenvolvimento incremental com validação contínua

#### 2. **Desenvolvimento Ágil**
- Sprints focadas em entregas funcionais
- Priorização baseada em valor (MVP primeiro)
- Iterações rápidas com refatoração contínua

#### 3. **Arquitetura Modular**
- Separação clara de responsabilidades por domínio
- Módulos independentes e testáveis
- Facilita manutenção e escalabilidade

### Etapas de Desenvolvimento

1. **Fase 1 - Fundação (Concluída)**
   - Setup do projeto Fastify + TypeScript
   - Sistema de autenticação com JWT
   - CRUD básico de usuários

2. **Fase 2 - Core Features (Concluída)**
   - CRUD de questões e alternativas
   - CRUD de exames
   - Sistema de composição de provas
   - Lógica de embaralhamento com seed

3. **Fase 3 - Features Avançadas (Em Desenvolvimento)**
   - Sistema de geração de PDF
   - Versionamento imutável de provas
   - Listagens com paginação e filtros
   - Sistema de permissões granulares

4. **Fase 4 - Polimento (Planejada)**
   - Frontend responsivo
   - Testes automatizados
   - Documentação completa da API

---

## 🔧 Detalhes Técnicos

### Stack Tecnológica
O projeto foi desenvolvido utilizando uma arquitetura Monorepo com separação clara entre Frontend e Backend, orquestrados via Docker.

#### Backend
- **Runtime:** Node.js
- **Framework:** Fastify (alta performance, TypeScript-first)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL 15.
- **ORM/Query:** pg (driver nativo) com query builder manual para otimização.
- **Autenticação:** @fastify/jwt + bcryptjs
- **Validação:** Zod (para validação de schemas de entrada e saída).
- **Geração de PDF:** PDFKit (geração programática de documentos vetoriais leves).

#### Frontend
- **Framework:** React 19 + Vite.
- **Linguagem:** TypeScript.
- **Estilização:** Material UI (MUI) v7.
- **Estado:** React Hooks + Axios.
- **Interatividade:** @dnd-kit (para arrastar e soltar questões na organização da prova).
- **Formulários:** React Hook Form + Zod resolver.
- **Notificações:** Sonner

#### Infraestrutura & DevOps
- **Containerização:** Docker e Docker Compose.
- **Ambiente:** Configuração via variáveis de ambiente (.env).



#### Arquitetura do Sistema (Backend)
- O Backend segue os princípios de Clean Architecture e SOLID, visando desacoplamento e testabilidade.

- Controller Layer (src/http/controllers): Responsável apenas por receber a requisição HTTP, validar dados (Zod) e devolver a resposta. Não contém regras de negócio.

- Use Cases Layer (src/use-cases): Contém a lógica de negócio pura (ex: create-exam, generate-exam-pdf). É agnóstico ao framework HTTP.

- Repository Layer (src/repositories): Abstração do acesso ao banco de dados. Permite trocar o banco (ex: de Postgres para In-Memory em testes) sem afetar as regras de negócio.

- Entities/Models: Definições de tipos e interfaces do domínio.

### Estrutura de Diretórios
```
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── actions/        # Integração com API (Axios services)
│   │   ├── components/     # Componentes reutilizáveis (MUI)
│   │   ├── contexts/       # Context API (AuthContext, etc)
│   │   ├── pages/          # Páginas da aplicação (Dashboard, Exam, Question)
|   |   ├── lib/            # Axios  
│   │   └── types/          # Tipagem compartilhada no front
│   ├── Dockerfile
│   └── package.json
│
├── server/                 # Backend (Fastify)
│   ├── db/                 # Scripts SQL (Migrations/Seeds)
│   ├── src/
│   │   ├── http/
│   │   │   ├── controllers/ # Handlers de rotas (Exams, Questions, User)
│   │   │   └── middleware/  # Auth (JWT) e Permissões
│   │   ├── lib/            # Configurações (DB connection, etc)
│   │   ├── repositories/   # Implementação PostgreSQL
│   │   ├── use-cases/      # Regras de Negócio (Lógica Core)
│   │   │   ├── factories/  # Padrão Factory para instanciar Use Cases
│   │   │   └── errors/     # Erros customizados de domínio
│   │   ├── utils/          # Global Error Handler
│   │   └── app.ts          # Entry point e registro de rotas
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml      # Orquestração dos serviços
└── README.MD
```

### Modelo de Dados
O banco PostgreSQL foi estruturado com as seguintes entidades principais:

- Users: Professores/Administradores.

- Questions: Enunciado e metadados.

- Alternatives: Opções de resposta vinculadas às questões.

- Exams: O cabeçalho da prova e configurações.

- ExamQuestions: Tabela pivô que vincula questões à prova, controlando a ordem e pontuação.


### Principais Endpoints da API

#### Autenticação
```

```

#### Questões
```

```

#### Exames
```

```

### Algoritmo de Embaralhamento
```

```

**Características:**
- Determinístico: mesma seed gera sempre a mesma ordem
- Permite reproduzir versões específicas
- Baseado em algoritmo Fisher-Yates

---


### Pré-requisitos

- Docker e Docker Compose instalados

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd hackathon-prova-rapida
   ```

2. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na raiz (baseado nos exemplos das pastas client e server) ou utilize os valores padrão do `docker-compose.yml`.

3. **Suba os containers:**
   ```bash
   docker-compose up --build
   ```

4. **Acesse a aplicação:**
   - **Frontend:** http://localhost:5173
   - **Backend:** http://localhost:3000
   - **Banco de Dados:** Porta 5433 (externa)

---

## 📡 Principais Endpoints (API)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users` | Cadastro de novo professor |
| POST | `/sessions` | Autenticação (Login) |
| GET | `/questions` | Listagem de questões com filtros |
| POST | `/questions` | Criação de nova questão |
| POST | `/exams` | Criação de prova (rascunho) |
| PATCH | `/exams/:id/reorder` | Reordenação de questões (Drag & Drop) |
| GET | `/exams/:id/pdf` | Geração do PDF da prova |
| GET | `/exams/:id/answer-key` | Geração do PDF do gabarito |

---

## 📅 Processo de Desenvolvimento & Metodologia

O desenvolvimento seguiu o cronograma do Hackathon, focado na entrega de um **MVP (Minimum Viable Product)** funcional.

1. **Discovery & Design Thinking:** Entendimento da dor do usuário (professor) e definição dos requisitos de economia de papel e facilidade de uso.
2. **Modelagem:** Definição do Schema do banco de dados para suportar múltiplas versões de prova.
3. **Backend Development:** Implementação da API RESTful com TDD mental (focando nos casos de uso antes dos controladores).
4. **Frontend Integration:** Construção da interface com Material UI para agilidade no desenvolvimento.
5. **Refinamento:** Implementação da lógica de embaralhamento de questões (Shuffle) e geração de PDFs com pdfkit.

---

## 🔮 Próximos Passos (Roadmap)

- [ ] **Modo Eco:** Algoritmo para reduzir ainda mais o espaço em branco nos PDFs
- [ ] **Banco Público:** Permitir que professores compartilhem questões entre si
- [ ] **Dashboard:** Estatísticas de desempenho dos alunos baseadas nos gabaritos
- [ ] **CI/CD:** Pipeline automatizado para deploy na Vercel/Render

---

**Desenvolvido pelo Grupo 57 - FIAP Postech**

## 📚 Aprendizados e Próximos Passos

### Lições Aprendidas

#### ✅ O que funcionou bem

1. **Arquitetura Modular**
   - Separação por domínios facilitou manutenção e testes
   - Escalabilidade natural para adicionar novos módulos
   - Código mais legível e organizado

2. **TypeScript + Fastify**
   - Type safety reduziu bugs em produção
   - Performance superior comparado a Express
   - Validação automática de schemas

#### ⚠️ Desafios Enfrentados

1. **Relacionamentos Complexos**
   - Tabela pivot `exam_questions` com ordenação foi mais complexa que esperado
   - Solução: índices compostos e validações no service layer

2. **Permissões Granulares**
   - Definir quem pode editar/deletar questões públicas gerou discussões
   - Necessário revisar modelo de permissões antes de escalar

3. **Geração de PDF**

### Próximos Passos

#### Curto Prazo (1-2 semanas)
- [ ] Implementar sistema completo de geração de PDF

#### Médio Prazo (1-2 meses)
- [ ] Desenvolver frontend completo em React


#### Longo Prazo (3-6 meses)
- [ ] Dashboard com estatísticas de uso de questões


### Melhorias Técnicas Planejadas

1. **Performance**
   - Implementar cache Redis para questões públicas
   - Otimizar queries com eager loading
   - CDN para servir PDFs gerados

2. **Segurança**
   - Rate limiting mais robusto
   - Criptografia de dados sensíveis
   - Auditoria de ações críticas (logs)

3. **DevOps**
   - CI/CD com GitHub Actions
   - Docker para padronização de ambiente
   - Deploy automatizado (Vercel)

4. **Qualidade de Código**
   - Cobertura de testes >80%
   - Linting automático (ESLint + Prettier)
   - Pre-commit hooks (Husky)
   - Documentação automática com JSDoc

---

**Desenvolvido pelo Grupo 57 - FIAP Postech**