# Sorriso Claro: agendamento de consulta odontológica

Site de agendamento online para uma clínica odontológica, feito só com HTML, CSS e JavaScript puro, sem frameworks nem build. O paciente escolhe o tratamento, o dia e o horário, informa seus dados e recebe um código de confirmação.

## Funcionalidades

- **Agendamento em 3 etapas:** tratamento e dentista, data e hora, dados pessoais.
- **Calendário dinâmico:** domingos, dias passados e dias sem vaga ficam desabilitados. É possível agendar até 3 meses à frente.
- **Horários em tempo real:** horários já passados no dia atual e horários ocupados não aparecem para seleção.
- **Validação do formulário:** nome e sobrenome, celular com DDD (máscara automática) e e-mail, com mensagens de erro claras.
- **Código de consulta:** gerado ao confirmar o agendamento.
- **Minhas consultas:** lista os agendamentos feitos e permite cancelar, liberando o horário.
- **Responsivo e acessível:** funciona bem no celular, tem foco visível no teclado e respeita a preferência por menos movimento.
- **Tema claro e escuro:** segue automaticamente a configuração do dispositivo.

## Estrutura do projeto

```
agendamento-odontologico/
├── html/
│   └── index.html     # estrutura da página
├── css/
│   └── style.css      # estilos, cores e tema claro/escuro
├── js/
│   └── script.js      # lógica de agendamento
└── README.md
```

## Como executar

1. Baixe ou clone o projeto, mantendo as três pastas lado a lado.
2. Abra o arquivo `html/index.html` no navegador (duplo clique).

Não é preciso instalar nada nem rodar servidor. Para testar com um servidor local, se preferir:

```bash
cd agendamento-odontologico
python3 -m http.server 8000
# acesse http://localhost:8000/html/
```

> As fontes (Bricolage Grotesque e Figtree) vêm do Google Fonts, então é necessária conexão com a internet para carregá-las. Sem internet, o site usa as fontes padrão do sistema.

## Personalização

Tudo o que muda de uma clínica para outra está no começo do `js/script.js`:

| O que alterar | Onde |
|---|---|
| Tratamentos, descrições e preços | constante `SERVICES` |
| Dentistas | constante `DENTISTS` |
| Horário de funcionamento e intervalo entre consultas | função `baseSlots()` |
| Prazo máximo de agendamento (hoje, 3 meses) | funções `renderCal()` |

As cores ficam nas variáveis CSS do início do `css/style.css` (`--brand`, `--accent`, `--bg` e outras), com valores separados para o tema escuro.

Textos como nome da clínica, endereço, telefone e CRO ficam no `html/index.html`.

## Como os dados são guardados

Os agendamentos ficam no `localStorage` do navegador, na chave `sc-appts`. Isso significa que:

- cada pessoa só enxerga os agendamentos feitos no próprio navegador;
- limpar os dados do navegador apaga os agendamentos;
- a ocupação dos horários de outros pacientes é **simulada** (função `taken()`, cerca de 30% dos horários aparecem como ocupados), apenas para demonstração.

## Limitações e próximos passos

Este projeto é um front-end de demonstração. Para uso real em uma clínica, seria necessário:

- [ ] um back-end com banco de dados para guardar os agendamentos de todos os pacientes;
- [ ] agenda real dos dentistas, no lugar da ocupação simulada;
- [ ] envio de confirmação por e-mail ou WhatsApp e lembretes automáticos;
- [ ] painel para a recepção visualizar e gerenciar as consultas;
- [ ] política de privacidade e consentimento para tratamento de dados, conforme a LGPD.

## Tecnologias

- HTML5
- CSS3 (variáveis CSS, Grid e Flexbox)
- JavaScript (ES6+), sem dependências

## Licença

Projeto de exemplo, livre para estudar, modificar e usar como base. Todos os nomes, endereços e telefones são fictícios.

## Link do site

[https://beatrizzdias.github.io/Agendamento-Odontologico/html/](https://beatrizzdias.github.io/Agendamento-Odontologico/html/)

## Autora

Feito por Beatriz Dias.
