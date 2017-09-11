#! /usr/bin/env nodejs
/*
 * a simple HTTP server that serve filtered data from GitHub API
 */

'use strict';

/* eslint-disable no-console */
/* eslint-disable padded-blocks */

const http = require('http');
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');

const usage = `usage: ${path.basename(process.argv[1])} port\n`;
const notFound = '<h1>404<small> Not Found</sm<ll></h1>';
const apiUrl = 'https://api.github.com/users/pujolchr/repos';

// const debug = msg => process.stderr.write(`debug: ${msg}\n`);
const stdoutput = msg => process.stdout.write(`${msg}\n`);

if (process.argv.length !== 3) {
  process.stderr.write(usage);
  process.exit(1);
}

const server = http.createServer((req, res) => {

  stdoutput('\nIncoming Connection...');
  stdoutput(`host: ${req.headers.host}`);
  stdoutput(`user-agent: ${req.headers['user-agent']}`);
  const URL = url.parse(req.url, true);
  stdoutput(`path: ${URL.pathname}`);

  if (URL.pathname !== '/api/pujolchr') {
    stdoutput('reponse: 404');
    res.writeHead(404, { 'content-type': 'text/html' });
    res.write(notFound);
    res.end();
  } else {

    const item = [];

    fetch(apiUrl) // check for error?
      .then(data => data.json())
      .then((data) => {
        data.forEach((elmt) => {

          const repo = {};
          repo.name = elmt.name;
          repo.description = elmt.description;
          repo.html_url = elmt.html_url;
          repo.url = elmt.url;
          repo.language = elmt.language;

          if (elmt.forks_count) repo.forks_count = elmt.forks_count;
          item.push(repo);
        });

        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        res.write(JSON.stringify(item));
        stdoutput('reponse: 200');
        res.end();

      });
  }
});

stdoutput(`Listening on port ${process.argv[2]}...\n`);
server.listen(process.argv[2]);
