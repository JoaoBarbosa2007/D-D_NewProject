# Sistema de múltiplas fichas e campanhas

## Fichas
As fichas agora são armazenadas em `localStorage` no array `dndCharacters`.
Cada ficha possui:
- `id`
- `data`
- `image`
- `createdAt`
- `updatedAt`

A ficha aberta é identificada por `dndActiveCharacterId`.

O sistema também migra automaticamente a estrutura antiga:
- `dndCharacter`
- `dndCharacterImage`

## Campanhas
As campanhas continuam sendo armazenadas em `dndCampaigns`, permitindo várias campanhas simultaneamente.
A campanha ativa usa `dndActiveCampaignId`.

## Fluxo
- **Criar personagem**: abre uma ficha nova sem sobrescrever uma ficha existente.
- **Abrir ficha**: grava o ID da ficha e abre a ficha correspondente.
- **Salvar ficha**: cria uma nova ficha se não houver uma ativa; caso exista, atualiza somente a ficha ativa.
- **Excluir ficha**: remove apenas a ficha selecionada.
- **Criar campanha**: adiciona uma nova campanha ao array, sem apagar as anteriores.
