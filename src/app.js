const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID.' })
  }

  return next();
}

app.use(['/repositories/:id', '/repositories/:id/like'], validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIdx = repositories.findIndex(repository => repository.id == id);

  if (repositoryIdx < 0) {
      return response.status(400).json({ error: 'Repository not found.' })
  }

  const repository = {
      id,
      title: repositories[repositoryIdx].title,
      url: repositories[repositoryIdx].url,
      techs: repositories[repositoryIdx].techs,
      likes: repositories[repositoryIdx].likes + 1
  }

  repositories[repositoryIdx] = repository;

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIdx = repositories.findIndex(repository => repository.id == id);

  if (repositoryIdx < 0) {
      return response.status(400).json({ error: 'Repository not found.' })
  }

  const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIdx].likes
  }

  repositories[repositoryIdx] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIdx = repositories.findIndex(repository => repository.id == id);

  if (repositoryIdx < 0) {
      return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIdx, 1);

  return response.status(204).send();
});

module.exports = app;
