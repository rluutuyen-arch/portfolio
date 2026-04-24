import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector("project-title");
const count = projects.length;
title.textContent = "(${count}) Projects"