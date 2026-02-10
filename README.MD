# 🎓 Prova Rápida - Sistema de Geração de Provas Acadêmicas

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Desenvolvido pelo Grupo 57 - Hackathon 5FSDT FIAP**

[Demo](#) • [Documentação](https://drive.google.com/drive/folders/1vtrf_ip0gVXS4uIbYb8i71brQ3b3XJjV) • [Miro Board](https://miro.com/app/board/uXjVGEPRZvk=/)

</div>

---

## 📋 Resumo Executivo

O **Prova Rápida** é um sistema web fullstack para automatizar a criação, composição e geração de provas acadêmicas em PDF. A solução permite que professores:

✅ Criem e gerenciem um banco de questões reutilizáveis  
✅ Montem provas personalizadas com interface drag-and-drop  
✅ Gerem múltiplas versões embaralhadas com gabaritos separados  
✅ Exportem PDFs com **diferentes modos de economia** para reduzir custos

**Objetivo Principal:** Transformar a criação manual de provas em um processo digital, ágil, seguro e econômico.

### 🎯 Impacto Esperado

- ⚡ Redução drástica do tempo gasto com formatação de provas
- ✨ Eliminação de erros manuais em gabaritos
- 🔄 Reutilização facilitada de questões entre avaliações
- 🔒 Redução de "colas" com versões A, B, C geradas automaticamente
- 💰 **Diminuição de custos com impressão (papel e tinta)**

---

## 🔍 Problema Identificado

No contexto da **educação pública**, professores enfrentam limitações de tempo, recursos financeiros e infraestrutura, tornando o processo tradicional de criação de provas **ineficiente e desgastante**.

### Principais Dores Mapeadas

#### 1️⃣ Sobrecarga de Trabalho Docente
- Grande quantidade de tempo gasto com formatação manual
- Retrabalho frequente para recriar ou adaptar questões antigas
- Menos tempo disponível para planejamento pedagógico

#### 2️⃣ Ineficiência Financeira
- Provas formatadas manualmente **não são otimizadas** para economia de papel e tinta
- Aumento desnecessário dos custos de impressão
- Falta de padronização para acessibilidade, gerando retrabalho e reimpressões

#### 3️⃣ Gestão Descentralizada de Conteúdo
- Questões espalhadas em arquivos locais, e-mails e dispositivos externos
- Falta de organização e categorização do material
- Alto risco de perda de dados por falhas em computadores pessoais

#### 4️⃣ Vulnerabilidade a Erros e Falhas Humanas
- Erros de gabarito e formatação são comuns em processos manuais
- Dificuldade de gerar múltiplas versões da mesma prova
- Maior risco de cola entre alunos

---

## 💡 Solução

O Prova Rápida é uma plataforma web que centraliza todo o ciclo de vida de criação de provas, desde o cadastro das questões até a geração final dos PDFs para impressão.

### Funcionalidades Principais

#### 📚 Gestão de Banco de Questões
- Cadastro de questões de múltipla escolha com alternativas
- Categorização por disciplina e dificuldade
- Sistema de questões públicas e privadas
- Busca e filtros avançados

#### ✏️ Composição de Provas
- Seleção de questões diretamente do banco
- **Interface drag-and-drop** para organização personalizada
- Visualização prévia da prova antes da finalização
- Duplicação de provas para reaproveitamento
- Separação entre rascunhos e provas finalizadas

#### 🔀 Geração de Versões Embaralhadas
- Algoritmo determinístico baseado em **seed reproduzível**
- Geração de múltiplas versões (A, B, C, etc.)
- Garantia de consistência: mesma seed gera a mesma ordem
- Rastreamento das versões geradas

#### 📄 Exportação em PDF

Geração profissional de PDFs com:
- Prova sem respostas marcadas
- Gabarito com respostas corretas
- Formatação com cabeçalho e identificação
- Quebra de página inteligente (sem dividir questões)

### 🌟 Modos de Exportação (Diferencial Competitivo)

O sistema oferece **4 modos de otimização** para atender diferentes necessidades:

#### 📖 Modo de Acessibilidade
Focado em alunos com baixa visão ou dificuldade de leitura.
- Fontes maiores (16px ou mais)
- Maior espaçamento entre linhas
- Prioriza **legibilidade** acima de economia

#### 📃 Modo Economia de Papel
Otimiza o layout para reduzir o número de páginas impressas.
- Diminui margens e tamanho de fonte
- Organiza alternativas em colunas
- Mantém legibilidade enquanto reduz espaço

#### 🖨️ Modo Economia de Tinta
Focado em reduzir o consumo de toner/tinta na impressão.
- Remove negritos desnecessários
- Substitui cores por tons de cinza
- Deixa o PDF mais barato de imprimir

#### 💰 Modo Economia Máxima
Combina economia de papel + economia de tinta no mesmo layout.
- Modo mais agressivo de otimização
- Menos páginas + menos uso de tinta
- **Pensado especialmente para escolas com poucos recursos**

---

## 🛠️ Stack Tecnológica

### Backend
- **Runtime:** Node.js
- **Framework:** Fastify (alta performance, TypeScript-first)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL 15
- **Autenticação:** @fastify/jwt + bcryptjs
- **Validação:** Zod
- **Geração de PDF:** PDFKit

### Frontend
- **Framework:** React 19 + Vite
- **Linguagem:** TypeScript
- **UI Library:** Material UI (MUI) v7
- **Gerenciamento de Estado:** React Hooks + Axios
- **Drag and Drop:** @dnd-kit
- **Formulários:** React Hook Form + Zod
- **Notificações:** Sonner

### Infraestrutura
- **Containerização:** Docker + Docker Compose
- **Arquitetura:** Monorepo com frontend e backend separados

---

## 🏗️ Arquitetura do Sistema

O backend segue os princípios de **Clean Architecture** e **SOLID**, garantindo:
```
┌─────────────────────────────────────────┐
│         Controller Layer                │  ← HTTP Handlers (Fastify)
│  (Validação Zod + Response Formatting)  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Use Cases Layer                │  ← Lógica de Negócio
│   (create-exam, generate-pdf, etc)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Repository Layer                 │  ← Abstração de Dados
│     (PostgreSQL Repositories)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Database                      │  ← PostgreSQL
│    (Users, Questions, Exams, etc)       │
└─────────────────────────────────────────┘
```

**Benefícios:**
- ✅ Maior desacoplamento e testabilidade
- ✅ Facilidade de manutenção
- ✅ Escalabilidade natural

---

## 📁 Estrutura de Diretórios
```
hackathon-prova-rapida/
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── actions/            # Integração com API (Axios)
│   │   ├── components/         # Componentes reutilizáveis (MUI)
│   │   ├── contexts/           # Context API (AuthContext)
│   │   ├── pages/              # Páginas (Dashboard, Exam, Question)
│   │   ├── lib/                # Axios config
│   │   └── types/              # Tipagem TypeScript
│   └── Dockerfile
│
├── server/                      # Backend (Fastify)
│   ├── db/                     # Scripts SQL (Migrations/Seeds)
│   ├── src/
│   │   ├── http/
│   │   │   ├── controllers/    # Handlers de rotas
│   │   │   └── middleware/     # Auth (JWT) e Permissões
│   │   ├── lib/                # Configurações (DB, etc)
│   │   ├── repositories/       # PostgreSQL Repositories
│   │   ├── use-cases/          # Regras de Negócio
│   │   │   ├── factories/      # Factory Pattern
│   │   │   └── errors/         # Erros de Domínio
│   │   ├── utils/              # Global Error Handler
│   │   └── app.ts              # Entry Point
│   └── Dockerfile
│
├── docker-compose.yml           # Orquestração
└── README.md
```

---

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados

### Passo a Passo

1. **Clone o repositório:**
```bash
   git clone https://github.com/ViniciusFaria-png/hackathon-prova-rapida
   cd hackathon-prova-rapida
```

2. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na raiz ou utilize os valores padrão do `docker-compose.yml`.

3. **Suba os containers:**
```bash
   docker-compose up --build
```

4. **Acesse a aplicação:**
   - **Frontend:** http://localhost:5173
   - **Backend:** http://localhost:3000
   - **Banco de Dados:** Porta 5433 (externa)

---

## 📡 Principais Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users` | Cadastro de novo professor |
| POST | `/sessions` | Login (retorna JWT) |

### Questões
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/questions` | Listagem com filtros (disciplina, dificuldade) |
| POST | `/questions` | Criação de nova questão |
| PUT | `/questions/:id` | Atualização de questão |
| DELETE | `/questions/:id` | Exclusão (se não usada em provas) |

### Exames
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/exams` | Criação de prova (rascunho) |
| PATCH | `/exams/:id/reorder` | Reordenação drag-and-drop |
| GET | `/exams/:id/pdf` | **Geração do PDF da prova** |
| GET | `/exams/:id/answer-key` | **Geração do PDF do gabarito** |

---

## 🎨 Processo de Desenvolvimento

O desenvolvimento seguiu metodologias ágeis e princípios de **Design Thinking**:

### Design Thinking
1. **Empatia:** Conversas com professores para entender dores reais
2. **Definição:** Mapeamento dos fluxos críticos
3. **Ideação:** Brainstorming e priorização de features
4. **Prototipação:** Desenvolvimento incremental com validações

### Desenvolvimento Ágil
- Organização em sprints
- Foco em entregas funcionais (MVP primeiro)
- Refatoração contínua para qualidade

### Fases do Projeto
- ✅ **Fase 1 – Fundação:** Setup, autenticação, CRUD de usuários
- ✅ **Fase 2 – Core Features:** CRUD de questões/provas, embaralhamento
- ✅ **Fase 3 – Features Avançadas:** Geração de PDF, versionamento
- ✅ **Fase 4 – Polimento:** Frontend responsivo, UI/UX, documentação

---

## 📚 Aprendizados e Próximos Passos

### ✅ Lições Aprendidas

#### O que funcionou bem
- **Arquitetura Modular:** Separação por domínios facilitou manutenção
- **TypeScript + Fastify:** Type safety reduziu bugs, performance superior
- **Clean Architecture:** Facilidade para testes e evolução do código

#### ⚠️ Desafios Enfrentados
- Modelagem de relacionamentos complexos no banco de dados
- Implementação da geração de PDFs com diferentes modos de economia
- Algoritmo de embaralhamento determinístico (Fisher-Yates com seed)

### 🔮 Próximos Passos

#### Curto Prazo
- [ ] Adicionar questões dissertativas e atividades
- [ ] Mais modos de acessibilidade para necessidades especiais

#### Médio Prazo
- [ ] **Correção via Mobile com Visão Computacional**
  - Professor fotografa cartão-resposta (com QRCode)
  - Sistema identifica marcações e corrige automaticamente
- [ ] Modos de economia personalizados pelo professor

#### Longo Prazo
- [ ] **Assistente de IA para elaboração de provas**
  - LLM para sugerir variações de questões
  - Gerar alternativas plausíveis e distratores
  - Analisar a prova e sugerir melhorias

---

## 🔗 Links Úteis

- 📦 **Repositório:** [GitHub](https://github.com/ViniciusFaria-png/hackathon-prova-rapida)
- 🎨 **Miro Board:** [Planejamento e Wireframes](https://miro.com/app/board/uXjVGEPRZvk=/)
- 📂 **Google Drive:** [Documentação Completa](https://drive.google.com/drive/folders/1vtrf_ip0gVXS4uIbYb8i71brQ3b3XJjV)

---

## 👥 Equipe - Grupo 57

- **Alessandra Guedes**
- **Ana Carolina**
- **Vitor Freire**
- **Vinícius Faria**

---

<div align="center">

**Hackathon 5FSDT - FIAP Postech**

Feito com ❤️ para melhorar a educação pública

</div>
