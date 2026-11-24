# Legacy · International Solutions

Proposta de layout (pitch) da Concept Agência para a Legacy: soluções internacionais de proteção patrimonial, saúde global e investimentos, para clientes de alto patrimônio.

Site estático: HTML/CSS/JS + GSAP, ScrollTrigger e Lenis via CDN; globo 3D com `cobe` (módulo ESM do jsDelivr, com globo pontilhado em CSS se a biblioteca não carregar).

Rodar local: `npx http-server legacy -p 5193 -c-1` (entrada "legacy" no `.claude/launch.json`). Depois de editar CSS/JS, subir o `?v=N` no `index.html`.

## Referência

Vídeo de um site corporativo de investimentos (UzOman): painéis claros, azul-marinho profundo, fonte Manrope, fotos de arranha-céus vistos de baixo, mosaico de portfólio com texto no hover, linha do tempo com número gigante, números, equipe com card de qualificações, notícias, contato com foto + formulário, rodapé com barra azul.

## Estrutura

Intro com logo · hero · faixa de praças · Sobre · O que nos move (linhas animadas) · 3 pilares em cards empilhados · mosaico de soluções com parallax · Jornada (01–05) · Números + globo · Equipe · citação "Legado" · Insights · FAQ · Contato · rodapé · botão flutuante de WhatsApp + popup qualificador.

## Popup qualificador → WhatsApp

5 etapas: solução → patrimônio (ou "para quem é a cobertura", se escolher Saúde global) → momento → forma de atendimento → nome, WhatsApp (aceita +DDI) e cidade/país. Abre o WhatsApp com o resumo pronto. Os botões das seções e do contato já pré-selecionam a solução.

## Antes de publicar para o cliente

- `assets/js/main.js` (topo): `LEGACY_WHATSAPP` está como `5561000000000` (trocar pelo número real); `LEGACY_LEAD_ENDPOINT` vazio = só registra no console.
- `[e-mail de contato]` em `index.html` (Contato e rodapé) e `privacidade.html`.
- Logo provisório (anéis + "Legacy International Solutions") desenhado em SVG: trocar pelo oficial (`#i-logo` no fim do `index.html`, favicon e intro).
- Links do LinkedIn/Instagram no rodapé estão com `#`.
- Equipe: nomes "Nome Sobrenome", cargos e formações são marcadores; fotos são de banco de imagens.
- **Textos e números inferidos, a confirmar:** +15 anos, +20 instituições, 8 jurisdições, +190 países, 24/7; lista de praças (Miami, Nova York, Lisboa, Londres, Zurique, Luxemburgo, Dubai, Singapura); serviços do mosaico; etapas da jornada; respostas do FAQ (inclusive "não somos banco/gestora"); faixas de patrimônio do formulário; artigos de Insights (títulos e datas fictícios).
- O seletor PT | EN é só visual.

## Fotos

Unsplash (licença livre), baixadas em WebP para `assets/img/`. IDs: hero 1623101275026-9eb1e7b4d5df · sobre 1627327053419-fe894c4650ed · contato 1617761141732-d481912af1a9 · proteção 1633022326182-1b36700bc49a · saúde 1706799191377-96a80beaee24 · investimentos 1738737271801-d404a575d870 · sucessão 1514028921197-fd1102ac1548 · vida 1523820843652-f6b30d535239 · educação 1627556704302-624286467c65 · mobilidade 1770334618960-d246fc142297 · custódia 1603693350453-0fcd5bf675f1 · previdência 1571296206289-c6b4ce6b0266 · legado 1534768654272-e97681c3a2c7 · insights 1618044733300-9472054094ee, 1758519288905-38b7b00c1023, 1454496406107-dc34337da8d6 · popup 1474302770737-173ee21bab63 · equipe 1633366147060-ce9e1a9fd39c, 1585240975858-7264fd020798, 1782069327099-a8d206190b18, 1581065178047-8ee15951ede6.
