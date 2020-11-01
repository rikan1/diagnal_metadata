const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

// const apiUrl = 'http://localhost:3000/parse-url';

describe("Test for parseurl api", () => {  

    it("With no url", done => {
        chai
          .request(app)
          .post("/parse-url")
          .send({ url:''})
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
        });
    });
    
    it("With invalid url", done => {
        chai
          .request(app)
          .post("/parse-url")
          .send({ url:'test'})
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
        });
    }); 

    it("With valid url", done => {
        chai
          .request(app)
          .post("/parse-url")
          .send({ url:'http://diagnal.com'})
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    }); 


  });