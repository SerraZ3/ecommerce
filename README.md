# Ecommerce Aprendizado

Anotações do curso da Udemy `Ecommerce real time com Node.js e Adonis Framework`

Estudo realizado por [Henrique A. Serra](https://github.com/SerraZ3/) :smile: :metal:

## Pré-configurações do projeto

Crie o banco de dados da aplicação

No arquivo `.env` altere o `DB_CONNECTION` para mysql, o `DB_USER`, `DB_PASSWORD` e o `DB_DATABASE` para as configurações do seu banco de dados

Acesse o `config/database.js` e altere o segundo parametro na linha 19 para `mysql` caso esse seja o banco de dados utilizado

Instale o mysql na aplicação com o comando `npm i --save mysql`

---

A pasta `app` serve para ter toda a lógica da aplicação

## Instalação de ferramentas

### E-mail

Comando para instalar dependencias de e-mail na aplicação adonis

```JavaScript
adonis install @adonisjs/mail
```

Configurações na pasta `start/app.js`

```JavaScript
const providers = [
  ...
  '@adonisjs/mail/providers/MailProvider'
]
```

Exemplo de como usuar o e-email

```JavaScript
const Mail = use('Mail')

await Mail.send('emails.welcome', {}, (message) => {
  message.from('foo@bar.com')
  message.to('bar@baz.com')
})
```

### Validator

Comando para instalar dependencias do validator no projeto

```JavaScript
adonis install @adonisjs/validator
```

Configurações na pasta `start/app.js`

```JavaScript
const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```

Exemplo de como usuar o Validator

```JavaScript
Route
  .post('users', 'UserController.store')
  .validator('User')
```

### Websocket

O websocket permite troca de informação simultanea com o servidor através de requisições. [Mais informações aqui](https://www.devmedia.com.br/uso-de-websockets-e-html5/32267)

Comando para instalar dependencias do websocket no projeto

```JavaScript
adonis install @adonisjs/websocket
```

Configurações na pasta `start/app.js`

```JavaScript
const providers = [
  '@adonisjs/websocket/providers/WsProvider'
]
```

Caso os arquivos `start/socket.js` e `start/wsKernel.js` não estiverem configurados adicionar, respectivamente:

```JavaScript
const Ws = use('Ws')

Ws.channel('chat', ({ socket }) => {
  console.log('new socket joined %s', socket.id)
})
```

```JavaScript
const Ws = use('Ws')

const globalMiddleware = []
const namedMiddleware = {}

Ws
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
```

### Adonis acl

Seria o nivel de acesso de cada usuário para a api

Para duvidas na instalação [clique aqui](https://www.npmjs.com/package/adonis-acl)

Comando para instalar dependencias do websocket no projeto

```JavaScript
adonis install adonis-acl
```

Configurações na pasta `start/app.js`

```JavaScript
const providers = [
  ...
  'adonis-acl/providers/AclProvider',
  ...
]
```

```JavaScript
const aceProviders = [
  ...
  'adonis-acl/providers/CommandsProvider',
  ...
]
```

```JavaScript
const aliases = {
  ...
  Role: 'Adonis/Acl/Role',
  Permission: 'Adonis/Acl/Permission',
  ...
}
```

Em `app/Models/User.js` faça

```JavaScript
class User extends Model {
  ...
  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }
  ...
}
```

Em `start/kernel.js` faça

```JavaScript
const namedMiddleware = {
  ...
  is: 'Adonis/Acl/Is',
  can: 'Adonis/Acl/Can',
  ...
}
```

```JavaScript
const globalMiddleware = [
  ...
  'Adonis/Acl/Init'
  ...
]
```

Após realizar as configurações, dar o seguinte comando:

```JavaScript
adonis acl:setup
```

### Bumblebee

Auxilia no trabalho da informações da aplicação

Para instalação:

```JavaScript
adonis install adonis-bumblebee
```

Configuração em `start/app.js`

```JavaScript
const providers = [
  'adonis-bumblebee/providers/BumblebeeProvider'
]
```

```JavaScript
const aceProviders = [
  'adonis-bumblebee/providers/CommandsProvider'
]
```

## Manipulação do Banco de dados

### Migrations

Para criar uma estrutura do banco de dados, o adonis, utiliza o comando de migration. Ele cria um arquivo com uma estrutura que facilita criar tabelas e relações entre elas no banco de dados

O comando tem a seguinte estrutura:

```JavaScript
adonis make:migration name
```

Onde se é criado o arquivo onde estará a estrutura da tabela que você nomeou

Mais informações sobre o [migration aqui](https://adonisjs.com/docs/4.1/migrations). Nesse link conterá a comandos de relação e criação de tabelas

O migration é divido em `up()` e `down()`. O `up()` é usada para criação ou alteração de uma tabela, enquanto o `down()` seria para reverter as alterações do `up()`.

Exemplo de como eles são utilizado:

```JavaScript
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    // Quando o up é chamado ele cria uma tabela com essas características
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
    // Pode-se haver mais de uma criação ou relação
  }

  down () {
    // Quando o down é chamado ele desfaz a tabela users
    this.drop('users')
    // Outros comandos também podem ser atribuidos nesse caso
  }
}

module.exports = UsersSchema
```

Para rodar todos os `up()` deve-se dar o comando `adonis migration:run`. Ele irá pegar todos os migrations e dar um `up()`.

Para ver o status das migrations deve-se dar o comando `adonis migration:status`. Com ele você poderá ver se a migration já foi realizada ou não.

Além disso é possivel ver o "lote", onde irá mostrar qual foi a versão que o migration foi realizado. Pode-se também retornar para um lote anterior com o comando `adonis migration:rollback`, ou retornar para o lote 0 com `adonis migration:reset`, além de poder retornar para o lote 0 e reniciá-las com adonis `migration:refresh`