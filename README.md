# HelpTec — Sistema de Chamados Fatec

Aplicação React, TypeScript, Vite, Tailwind CSS e Redux Toolkit.

## Site publicado

https://helptech-fatec.vercel.app

O build estático atual está publicado na Vercel, no projeto `helptec` da equipe
`helptec`. Somente o HTML, JavaScript, CSS e os dois logos usados pela aplicação
foram enviados. O vínculo e o artefato locais ficam em `.vercel/`, ignorado pelo Git.

As contas continuam sendo de demonstração e os dados ficam no navegador de cada
visitante, sem sincronização entre dispositivos. Alterações locais exigem uma
nova implantação; a publicação automática pela integração com o GitHub não está configurada.

## Executar localmente

Com Node.js e pnpm disponíveis no terminal, dentro desta pasta:

```powershell
pnpm install --node-linker=hoisted
pnpm dev --host 127.0.0.1
```

Abra http://127.0.0.1:3000. O terminal informa outra porta se 3000 estiver ocupada.

- Administrador: `admin` / `admin`.
- Usuário padrão: `usuario` / `usuario`.
- `pnpm lint`: verificação de tipos.
- `pnpm build`: compilação para `dist/`.
- `pnpm test`: regras de navegação por perfil, migração e persistência de chamados.

As contas de acesso são de demonstração. Os chamados cadastrados e as preferências
ficam apenas no navegador. A aplicação atual não precisa de backend, arquivo
`.env.local` ou chave de API para funcionar.
O arquivo `pnpm-workspace.yaml` desabilita scripts de instalação de dependências;
o desenvolvimento e a compilação foram verificados assim no Windows.

## Refinamento visual

O design original foi preservado: sidebar, composição, textos, fontes, paleta,
mascote e logos. A referência dos controles é o par Enviar chamado / Cancelar.
No início, as molduras dos ícones e os fundos coloridos dos cards foram removidos,
mantendo suas dimensões e posições. As ações secundárias usam superfície neutra;
as principais mantêm o vermelho institucional e Finalizar mantém o verde semântico.
Os demais ajustes abrangem contraste, hover, pressionamento, desabilitação,
foco por teclado e preferência de movimento reduzido.
A autenticação permanece a do projeto original. O usuário padrão abre e edita
seus chamados; o administrador atende e gerencia a fila, sem acesso à abertura.
Estados antigos de criação ou de Meus Chamados com sessão administrativa são
encaminhados para Todos os Chamados, inclusive após recarregar a página.

O sistema começa sem chamados de exemplo. A migração limpa as amostras conhecidas
de `helptec_tickets_v3` e `helptec_tickets_v2`, comparando código e data de criação,
e preserva chamados cadastrados, autenticação e preferências. Uma lista vazia
continua vazia ao recarregar. Os gráficos refletem apenas os dados cadastrados;
o recurso de restaurar exemplos foi removido.

## Graphify local

Os resultados estão em `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`
e `graphify-out/graph.html`. Abra o HTML no navegador para explorar o grafo.
Para reconstruir com o Graphify instalado:

```powershell
$env:GRAPHIFY_BACKEND = 'none'
graphify extract . --code-only --out . --max-workers 2
graphify cluster-only . --no-label
graphify export html
```

A extração usa somente o código local, sem chamadas a provedores de IA.
O extrator não indexa CSS; os ajustes de estilo estão documentados neste README.
Os resultados do Graphify são versionados; seus caches e arquivos locais de controle
ficam fora do Git.
