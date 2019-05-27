# Ecommerce Aprendizado

Anotações do curso da Udemy `Ecommerce real time com Node.js e Adonis Framework`

Estudo realizado por [Henrique A. Serra](https://github.com/SerraZ3/) :smile: :metal:

## Pré-configurações do projeto

Crie o banco de dados da aplicação

No arquivo `.env` altere o `DB_CONNECTION` para mysql, o `DB_USER`, `DB_PASSWORD` e o `DB_DATABASE` para as configurações do seu banco de dados

Acesse o `config/database.js` e altere o segundo parametro na linha 19 para `mysql` caso esse seja o banco de dados utilizado

Instale o mysql na aplicação com o comando `npm i --save mysql`

## Instalação de ferramentas

### E-mail

Comando para instalar dependencias de e-mail na aplicação adonis

``` JavaScript
adonis install @adonisjs/mail
```

Configurações na pasta `start/app.js`

``` JavaScript
const providers = [
  '@adonisjs/mail/providers/MailProvider'
]
```

Exemplo de como usuar o e-email

``` JavaScript
const Mail = use('Mail')

await Mail.send('emails.welcome', {}, (message) => {
  message.from('foo@bar.com')
  message.to('bar@baz.com')
})
```

### Validator

Comando para instalar dependencias do validator no projeto

``` JavaScript
adonis install @adonisjs/validator
```

Configurações na pasta `start/app.js`

``` JavaScript
const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```

Exemplo de como usuar o Validator

``` JavaScript
Route
  .post('users', 'UserController.store')
  .validator('User')
```

### Websocket

O websocket permite troca de informação simultanea com o servidor através de requisições. [Mais informações aqui](https://www.devmedia.com.br/uso-de-websockets-e-html5/32267)

Comando para instalar dependencias do websocket no projeto

``` JavaScript
adonis install @adonisjs/websocket
```

Configurações na pasta `start/app.js`

``` JavaScript
const providers = [
  '@adonisjs/websocket/providers/WsProvider'
]
```

Caso os arquivos `start/socket.js` e `start/wsKernel.js` não estiverem configurados adicionar, respectivamente:

``` JavaScript
const Ws = use('Ws')

Ws.channel('chat', ({ socket }) => {
  console.log('new socket joined %s', socket.id)
})
```

``` JavaScript
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

``` JavaScript
adonis install adonis-acl
```

Configurações na pasta `start/app.js`

``` JavaScript
const providers = [
  ...
  'adonis-acl/providers/AclProvider',
  ...
]
```

``` JavaScript
const aceProviders = [
  ...
  'adonis-acl/providers/CommandsProvider',
  ...
]
```

``` JavaScript
const aliases = {
  ...
  Role: 'Adonis/Acl/Role',
  Permission: 'Adonis/Acl/Permission',
  ...
}
```

Em `app/Models/User.js` faça

``` JavaScript
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

``` JavaScript
const namedMiddleware = {
  ...
  is: 'Adonis/Acl/Is',
  can: 'Adonis/Acl/Can',
  ...
}
```

``` JavaScript
const globalMiddleware = [
  ...
  'Adonis/Acl/Init'
  ...
]
```

Após realizar as configurações, dar o seguinte comando:

``` JavaScript
adonis acl:setup
```

### Bumblebee

Auxilia no trabalho da informações da aplicação

Para instalação:

``` JavaScript
adonis install adonis-bumblebee
```

Configuração em `start/app.js`

``` JavaScript
const providers = [
  'adonis-bumblebee/providers/BumblebeeProvider'
]
```

``` JavaScript
const aceProviders = [
  'adonis-bumblebee/providers/CommandsProvider'
]
```

## Manipulação do Banco de dados

Para criar uma estrutura do banco de dados, o adonis, utiliza o comando de migration. Ele cria um arquivo com uma estrutura que facilita criar tabelas e relações entre elas no banco de dados

``` JavaScript
adonis make:migration name
```
