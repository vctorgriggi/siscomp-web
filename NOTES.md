## Decisões de Componentização

### Exportações

Em nossa aplicação, adotamos uma abordagem clara para a utilização de exportações, diferenciando entre exportações nomeadas e exportações default, com base na natureza e no uso dos módulos.

**Critérios para Exportações Nomeadas:**

- **Services:** Funções e serviços auxiliares que são utilizados em múltiplos lugares da aplicação.
- **Functions:** Funções reutilizáveis que podem ser importadas conforme necessário.
- **Utilitários (Utils):** Conjuntos de funções utilitárias que oferecem funcionalidades específicas e amplamente usadas.
- **Context:** Arquivos que definem e gerenciam contextos e provedores, proporcionando um gerenciamento de estado global.
- **Outros:** Qualquer outro arquivo que contenha múltiplas exportações ou que não esteja diretamente ligado à estrutura da UI.

**Motivo:**
A utilização de exportações nomeadas nesses casos torna claro e explícito quais funções ou serviços estão sendo importados, facilitando a manutenção e a clareza do código.

**Critérios para Exportações Default:**

- **Componentes:** Elementos de UI que são utilizados como blocos de construção na interface do usuário.
- **Pages:** Páginas completas da aplicação, representando diferentes rotas e visualizações.
- **Layouts:** Estruturas que definem o layout geral das páginas ou seções da aplicação.

**Motivo:**
Exportações default são preferíveis para componentes, páginas e layouts, pois esses geralmente são utilizados como entidades únicas e específicas, simplificando a importação e promovendo uma estrutura de código mais limpa.

Essa abordagem permite uma clara separação de responsabilidades e facilita a identificação e uso correto dos diferentes tipos de módulos em nossa aplicação. É importante revisar essas práticas regularmente e ajustá-las conforme necessário para garantir a eficiência e a legibilidade do código.

### Uso de Props

Optamos por utilizar props em vez de desestruturação nos componentes, pois isso torna mais explícito que estamos utilizando algo repassado via propriedade. Essa abordagem facilita a leitura e entendimento do código, destacando claramente a origem dos dados usados nos componentes. No entanto, essa decisão pode ser revisitada e alterada no futuro se surgirem melhores argumentos ou práticas que justifiquem a mudança para desestruturação.
