document.addEventListener("DOMContentLoaded", () => {
  async function fetchProjects() {
    const container = document.getElementById("github-projects");
    if (!container) return;

    const username = "dybdeskarphet";

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      );

      if (!response.ok) throw new Error("Fetch failed");

      let repos = await response.json();

      repos = repos
        .filter((repo) => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);

      container.innerHTML = "";

      repos.forEach((repo) => {
        const media = document.createElement("div");
        media.className = "media";
        media.setAttribute(
          "onclick",
          `window.open('${repo.html_url}', '_blank')`,
        );
        media.style.cursor = "pointer";

        media.innerHTML = `
          <div class="media-body">
            <div class="media-heading">${repo.name}</div>
            <div class="media-content">
              <p>${repo.description || "No description provided."}</p>
              <div>
                ${repo.language ? `<span class="label label-info">${repo.language}</span>` : ""}
                <span class="label label-success">★ ${repo.stargazers_count}</span>
              </div>
            </div>
          </div>
        `;
        container.appendChild(media);
      });
    } catch (error) {
      container.innerHTML =
        '<p class="alert alert-error">Failed to load projects.</p>';
    }
  }

  fetchProjects();
});
