# Sistema de Geração de Provas em PDF

## 📋 Resumo Executivo

Sistema web desenvolvido para automatizar o processo de criação, composição e geração de provas acadêmicas em formato PDF. A solução permite que professores criem bancos de questões reutilizáveis, componham provas personalizadas e gerem múltiplas versões embaralhadas com gabaritos separados, otimizando o tempo de preparação de avaliações e reduzindo riscos de cola.

**Objetivo Principal:** Transformar a criação manual de provas em um processo digital, ágil e seguro.

**Impacto Esperado:**
- Redução de 70% no tempo de criação de provas
- Eliminação de erros manuais na composição de gabaritos
- Facilitar reutilização de questões entre diferentes avaliações
- Aumentar a segurança acadêmica através de versões embaralhadas

---

## 🎯 Problema Identificado

### Contexto
Professores e instituições de ensino enfrentam desafios significativos no processo tradicional de criação de provas:

1. **Tempo Excessivo de Preparação**
   - Criação manual de questões consome horas de trabalho
   - Formatação de documentos é repetitiva e propensa a erros
   - Reaproveitamento de questões anteriores é difícil e desorganizado

2. **Risco de Fraude Acadêmica**
   - Provas idênticas em turmas diferentes facilitam compartilhamento de respostas
   - Falta de ferramentas para gerar versões diferentes de forma ágil

3. **Gestão Inadequada de Banco de Questões**
   - Ausência de categorização e organização de questões
   - Dificuldade em localizar questões específicas por disciplina ou dificuldade
   - Questões ficam dispersas em arquivos de diferentes formatos

4. **Erros Manuais**
   - Gabaritos com erros de correspondência
   - Formatação inconsistente entre provas
   - Perda de questões por falta de backup centralizado

### Justificativa da Solução
A digitalização e automação desse processo através de um sistema web resolve simultaneamente todos os pontos críticos identificados, permitindo que professores foquem no conteúdo pedagógico ao invés de tarefas administrativas repetitivas.

---

## 🚀 Descrição da Solução

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

#### Backend
- **Runtime:** Node.js
- **Framework:** Fastify (alta performance, TypeScript-first)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JSON Web Tokens (JWT)
- **Validação:** Zod
- **Geração de PDF:** Puppeteer / PDFKit

#### Frontend (Planejado)
- **Framework:** React / Vite
- **Estilização:** Tailwind CSS / MUI
- **Estado:** React Query
- **Formulários:** React Hook Form

### Arquitetura do Sistema
```

```

### Estrutura de Pastas
```

```

### Modelo de Dados (Simplificado)
```
```

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

## 🔗 Links Úteis

### Repositório de Código
- **GitHub:** 

### Protótipos e Design
- **Miro (Brainstorming):** 

### Documentação Adicional
- **API Docs (Swagger):** 
- **Guia de Instalação:** 
- **Changelog:** 

### Ferramentas de Gestão
- **Discord:** 

---

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

## 📄 Licença



## 👥 Contribuidores



## 📧 Contato



---

**Desenvolvido por Grupo 57**