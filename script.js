document.addEventListener("DOMContentLoaded", () => {
  async function fetchProjects() {
    const container = document.getElementById("github-projects");
    if (!container) return;

    const username = "dybdeskarphet";

    try {
      const [reposResponse, colorsResponse] = await Promise.all([
        fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
        ),
        fetch(
          "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
        ),
      ]);

      if (!reposResponse.ok || !colorsResponse.ok)
        throw new Error("Fetch failed");

      let repos = await reposResponse.json();
      const colors = await colorsResponse.json();

      repos = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);

      container.innerHTML = "";

      repos.forEach((repo) => {
        const langColor =
          repo.language && colors[repo.language]
            ? colors[repo.language].color
            : "#888";

        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute(
          "onclick",
          `window.open('${repo.html_url}', '_blank')`,
        );

        card.innerHTML = `
          <header class="card-header">${repo.name}</header>
          <div class="card-content">
            <div class="inner">
              <p>${repo.description || "No description provided."}</p>
              <div class="card-footer-labels">
                ${
                  repo.language
                    ? `<span class="label label-border" style="color: ${langColor} !important; border-color: ${langColor} !important;">${repo.language}</span>`
                    : ""
                }
                <span class="label label-warning label-border">★ ${repo.stargazers_count}</span>
              </div>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      container.innerHTML =
        '<p class="alert alert-error">Failed to load projects.</p>';
    }
  }

  fetchProjects();
});
