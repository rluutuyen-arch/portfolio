console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classlist.add("current")
let pages = [
    {url: '', title: 'Home'}, 
    {url: 'projects/', title: 'Projects'}, 
    {url: 'contact/', title: 'Contact'}, 
    {url: 'https://github.com/rluutuyen-arch/', title: 'Github'}, 
    {url: 'resume.html', title: 'Resume'}
]

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1") 
    ? "/" 
    : "/portfolio/";

let nav = document.createElement('nav');
document.body.prepend(nav);

for(let p of pages) {
    let url = p.url;
    let title = p.title
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    a.classList.toggle('current', a.host === location.host && a.pathname === location.pathname,)
    if (a.host !== location.host) {
        a.target = "_blank";
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class ="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    `
)

let select = document.querySelector("select");
function setColorScheme(value){
    document.documentElement.style.setProperty("color-scheme", value);
    select.value = value;
    localStorage.colorScheme = value;
}

select.addEventListener("input", (event) => {setColorScheme(event.target.value);});
if("colorScheme" in localStorage){
    setColorScheme(localStorage.colorScheme);
}

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
    return [];
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
        console.error('Invalid container element');
        return;
    } 
    if (!projects || projects.length === 0) {
        containerElement.innerHTML = '<p>No projects available.</p>';
        return;
    }
    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadings.includes(headingLevel)) {
        console.warn(`Invalid heading level: ${headingLevel}. Defaulting to h2.`);
        headingLevel = 'h2';
    }
    containerElement.innerHTML = '';

    projects.forEach(project => { 
        const article = document.createElement('article');
        console.log(project.image)
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;
        
        containerElement.appendChild(article);
    });

}

export async function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`)
}