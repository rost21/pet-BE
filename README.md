# Server for the to-do list app

## Prerequisities

* Node.js 8.x.x (tested with 8.9.4)

## How to run

```shell
npm i
npm run start
```

After that server will be listening on `http://localhost:4000`

## API reference

### Get all lists

```
GET /list
```

### Get the list by id

```
GET /list/:id
```

### Add the new list

```
POST /list

Header: 'Content-Type: application/json'

Body: {
  title: string,
  items: [
    {
      description: string,
      isDone: boolean
    }
  ]
}
```

### Update the list

```
PUT /list/:id

Header: 'Content-Type: application/json'

Body: {
  title: string,
  items: [
    {
      description: string,
      isDone: boolean
    }
  ]
}
```

### Delele the list

```
DELETE /list/:id
```