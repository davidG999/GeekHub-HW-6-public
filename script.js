const reposList = document.querySelector('.repos__list')

const options = {
  headers: new Headers({
    /* Uncomment next line and use your token. If no token is provided, the rate limit allows for up to 60 requests per hour.
      Details: https://docs.github.com/en/rest/overview/resources-in-the-rest-api#requests-from-personal-accounts */

    // "Authorization": `Bearer ${token}`
  }),
}

reposList.addEventListener('click', e => {
  const trg = e.target
  const parent = trg.closest('.repo')

  if (trg.matches('.show-commit-btn')) {
    parent.querySelector('.loader').style.display = 'block'

    getLastCommitInfo(
      trg,
      parent.querySelector('.repo__title').getAttribute('data-repo-name')
    )

    trg.style.display = 'none'
  }
})

function createRepo(title, url) {
  return `
    <div class="repos__repo repo">
      <h3 data-repo-name="${title}" class="repo__title">
        <a href="${url}" target="_blank">${title}</a>
      </h3>
      <button class="show-commit-btn">Show last commit info</button>

      <div class="loader"></div>
    </div>
  `
}

function showLastCommitInfo(url, branchName, date, time) {
  return `
    <div class="repo__info">
      <span>
        <a href="${url}" target="_blank"><b>Last commit</b></a> from <i>${branchName}</i> branch
      </span>
      <span><b>Date</b>: ${date}</span>
      <span><b>Time</b>: ${time}</span>
    </div>
  `
}

async function getMyRepos() {
  const repos =
    await fetch("https://api.github.com/users/davidG999/repos", options)
      .then(response => response.json())
      .then(json => json.slice(0, 5));

  repos.forEach(e => reposList.insertAdjacentHTML('beforeend', createRepo(e.name, e.html_url)))
}

async function getLastCommitInfo(target, repoName) {
  const parent = target.closest('.repo')
  let url = null,
    branchName = null,
    fullDate = null

  await fetch(`https://api.github.com/repos/davidG999/${repoName}/branches/master`, options)
    .then(response => response.json())
    .then(json => {
      url = json.commit.html_url
      branchName = json.name
      fullDate = json.commit.commit.committer.date
    });

  const [date, time] = fullDate.slice(0, -1).split('T')

  parent.querySelector('.loader').style.display = 'none'
  parent.insertAdjacentHTML('beforeend', showLastCommitInfo(url, branchName, date, time))
}

getMyRepos()