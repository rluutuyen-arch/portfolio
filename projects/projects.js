import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector('.projects-title');
const count = projects.length;
console.log(Object.keys(title))
title.textContent = "(${count}) Projects"