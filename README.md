# diagnal

To run this project you need to clone it first.
```sh
git clone https://github.com/rikan1/diagnal_metadata.git
```
Here i am using mongodb database.You can set the mongodb connection url in .env file.

 - Install node modules
 ```sh
 npm i
 ```
 - Start dev server
 ```sh
 npm run dev
 ```
 - Start production server
 ```sh
 npm run start
 ```
 - Start unit tests
 ```sh
 npm run test
 ```
 
There is an api which recieves url as body parameter and gives the metadata information.

### API Reference
#### POST /parse-url
--------------------
- body
```json
{
  "url" : "<Url>"
}
```
- response
```json
{
    "title": "<String>",
    "description": "<String>",
    "image": "<Url>",
    "keywords":[]
}
```
