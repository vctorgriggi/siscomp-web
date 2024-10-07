## Melhorias nas Animações de Loading

### Problema

As animações de loading estão sendo controladas por variáveis de estado globais, resultando na exibição da animação em todos os itens ao invés de apenas no item específico sendo manipulado.

### Solução

1. **Refatorar Controle de Loading**:

   - Implementar estados de loading individuais para cada item onde o problema é mais perceptível.
   - Avaliar e, se necessário, aplicar estados de loading individuais em outras áreas menos perceptíveis.

## Validação de CPF e CNPJ

### Problema

A validação atual de CPF e CNPJ verifica apenas o formato e não a existência ou validade dos números, permitindo a aceitação de números inválidos.

### Solução

1. **Melhorar Validação**:

   - Implementar uma validação mais robusta que verifique tanto o formato quanto a autenticidade dos números de CPF e CNPJ.
