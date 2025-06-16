## Encurtador de URL

[![codecov](https://codecov.io/github/gabrielpb88/shorterner-url/branch/develop/graph/badge.svg?token=0PVMTD35VS)](https://codecov.io/github/gabrielpb88/shorterner-url)

Este repositório contém a implementação de um desafio técnico conforme descrição do [README.](https://github.com/gabrielpb88/shorterner-url/blob/main/requirements/README.md)

### Branching Strategy

O projeto segue o Git Flow com as seguintes branches:

- `main`: Produção
- `release`: Staging/QA
- `develop`: Integração de features durante o sprint
- `feature/*`: Branches de features

#### Fluxo de Desenvolvimento

1. **Desenvolvimento de Features**:
   - Criar branch `feature/*` a partir de `develop`
   - Desenvolver a feature
   - Criar PR para `develop`

2. **Staging**:
   - Ao final do sprint, quando `develop` estiver estável, criar PR para `release`
   - Testes em ambiente de staging
   - Se necessário, fazer correções em `develop` e atualizar `release`

3. **Produção**:
   - Quando `release` estiver aprovado, criar PR para `main`
   - Após merge, a versão é automaticamente deployada em produção

#### Versionamento

- `npm run version:patch`: Para correções de bugs (1.0.0 → 1.0.1)
- `npm run version:minor`: Para novas features (1.0.0 → 1.1.0)
- `npm run version:major`: Para breaking changes (1.0.0 → 2.0.0)

### Variáveis de Ambiente

As únicas variáveis de ambiente estão configuradas no docker-compose.yml e descritas abaixo:

```
MONGO_URL = url de conexão com o mongo
PORT = porta em que a aplicação estará rodando
MONGO_DB_NAME = nome do banco
EXPIRATION_TIME= numero de dias que a url será valida
```

### Executando pelo Docker

```shell
docker compose up -d --build
```

### Rotas:

```
POST http://localhost:3000/
{
    "url": "https://www.jusfy.com.br"
}

GET http://localhost:3000/some_token
```
