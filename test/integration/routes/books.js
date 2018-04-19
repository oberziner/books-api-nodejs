import jwt from 'jwt-simple';

describe('Routes Books', () => {
  const { Books } = app.datasource.models;
  const { Users } = app.datasource.models;
  const { jwtSecret } = app.config;

  const defaultBook = {
    id: 1,
    name: 'Default Book',
    description: 'Default description',
  };

  let token;

  const defaultUser = {
    id: 1,
    name: 'Jose',
    email: 'test@mail.com',
    password: '12345',
  };

  beforeEach((done) => {
    Users
      .destroy({ where: {} })
      .then(() => Users.create(defaultUser))
      .then((user) => {
        Books
          .destroy({ where: {} })
          .then(() => Books.create(defaultBook))
          .then(() => {
            token = jwt.encode({ id: user.id }, jwtSecret);
            done();
          });
      });
  });

  describe('Route GET /books', () => {
    it('should return a list of books', (done) => {
      request
        .get('/books')
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          expect(res.body[0].id).to.be.eql(defaultBook.id);
          expect(res.body[0].name).to.be.eql(defaultBook.name);
          expect(res.body[0].description).to.be.eql(defaultBook.description);

          done(err);
        });
    });
  });

  describe('Route GET /books/{id}', () => {
    it('should return a a books', (done) => {
      request
        .get('/books/1')
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          expect(res.body.id).to.be.eql(defaultBook.id);
          expect(res.body.name).to.be.eql(defaultBook.name);
          expect(res.body.description).to.be.eql(defaultBook.description);

          done(err);
        });
    });
  });

  describe('Route POST /books', () => {
    it('should create a book', (done) => {
      const newBook = {
        id: 2,
        name: 'new book',
        description: 'new description',
      };

      request
        .post('/books')
        .set('Authorization', `bearer ${token}`)
        .send(newBook)
        .end((err, res) => {
          expect(res.statusCode).to.be.eql(201);
          expect(res.body.id).to.be.eql(newBook.id);
          expect(res.body.name).to.be.eql(newBook.name);
          expect(res.body.description).to.be.eql(newBook.description);

          done(err);
        });
    });
  });

  describe('Route PUT /books/{id}', () => {
    it('should update a book', (done) => {
      const updatedBook = { id: 1, name: 'updated book' };

      request
        .put('/books/1')
        .set('Authorization', `bearer ${token}`)
        .send(updatedBook)
        .end((err, res) => {
          expect(res.body).to.be.eql([1]);

          done(err);
        });
    });
  });

  describe('Route DELETE /books/{id}', () => {
    it('should delete a book', (done) => {
      request
        .delete('/books/1')
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.eql(204);

          done(err);
        });
    });
  });
});
