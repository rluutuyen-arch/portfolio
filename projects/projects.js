import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector('.projects-title');
if (title && projects) {
    title.textContent = `${projects.length} Projects`
}

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  )
  let newData = newRolledData.map(([year, count]) => {
    return {value: count, label: year};
  })
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => newArcGenerator(d));

  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();
  
  newArcs.forEach((arc, idx) => {
      newSVG
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
        .on('click', () => {
          selectedIndex = selectedIndex === idx ? -1 : idx;
          newSVG
            .selectAll('path')
            .attr('class', (_, idx) => (
              idx === selectedIndex ? 'selected' : ''
            ));
          newLegend
            .selectAll('li')
            .attr('class', (_, idx) => (
              idx === selectedIndex ? 'selected' : ''
            ));
          selectedYear = newData[selectedIndex]?.label ?? null;
          renderProjects(filter(projects), projectsContainer, 'h2');
        });
  });

  let newLegend = d3.select('.legend');
  newLegend.selectAll('li').remove();
  newData.forEach((d, idx) => {
    newLegend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) 
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); 
  });
}

function filter(projs) {
  return projs.filter((project) => {
    let matchesQuery = (Object.values(project).join('\n').toLowerCase()).includes(query.toLowerCase());
    if(selectedYear === null) {
      return matchesQuery;
    }
    let matchesYear = project.year === selectedYear;
    return matchesYear && matchesQuery;
  });
}

let selectedIndex = -1;
let query = '';
let searchInput = document.querySelector('.searchBar');
let selectedYear;

renderPieChart(projects);


searchInput.addEventListener('change', (event) => {
  query = event.target.value;
  let filtered = filter(projects);
  renderProjects(filtered, projectsContainer, 'h2')
  renderPieChart(filtered);
})


// newSVG.selectAll('path').remove();
// newArcs.forEach((arc, i) => {
//   newSVG
//     .append('path')
//     .attr('d', arc)
//     .attr('fill', colors(i))
//     .on('click', () => {
//       selectedIndex = selectedIndex === i ? -1 : i;
//       newSvg
//         .selectAll('path')
//         .attr('class', (_, idx) => (
//           idx === selectedIndex ? 'selected' : ''
//         ));
//       newLegend
//         .selectAll('li')
//         .attr('class', (_, idx) => (
//           idx === selectedIndex ? 'selected' : ''
//         ));
//     if (selectedIndex === -1) {
//       renderProjects(projects, projectsContainer, 'h2');
//     } else {
//       let selectedYear = data[selectedIndex].label;
//       let filtered = projects.filter(project => 
//         project.year === selectedYear
//       );
//       renderProjects(filtered, projectsContainer, 'h2');
//     }
//     });
// });


