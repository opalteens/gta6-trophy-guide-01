// Views: render the checklist rows, the guide detail pane, the roadmap and the missable page.
import { isSpoilerHidden } from './filters.js';
import { ROADMAP_STAGES, stageTrophies } from './roadmap.js';

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function renderChecklist(listEl, countEl, emptyEl, trophies, earned, spoilerOn, selectedId, onSelect, onToggle) {
  listEl.innerHTML = '';
  countEl.textContent = `Showing ${trophies.length} of 55 trophies · ${earned.size} earned`;
  emptyEl.hidden = trophies.length !== 0;
  for (const t of trophies) {
    const li = document.createElement('li');
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'trophy-row' + (earned.has(t.id) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
    row.dataset.id = String(t.id);
    row.addEventListener('click', () => onSelect(t.id));

    const check = document.createElement('span');
    check.className = 'trophy-check';
    check.textContent = earned.has(t.id) ? '✓' : '';
    check.setAttribute('role', 'button');
    check.setAttribute('aria-label', earned.has(t.id) ? `Mark ${t.name} as not earned` : `Mark ${t.name} as earned`);
    check.addEventListener('click', (event) => { event.stopPropagation(); onToggle(t.id); });
    row.appendChild(check);

    const main = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'trophy-name';
    const hidden = isSpoilerHidden(t, spoilerOn, earned);
    name.textContent = hidden ? 'Hidden story trophy' : t.name;
    if (hidden) name.classList.add('spoiler-blur');
    main.appendChild(name);
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Hidden until earned — turn the spoiler setting off to reveal it.' : t.description;
    if (hidden) desc.classList.add('spoiler-blur');
    main.appendChild(desc);
    const tags = document.createElement('span');
    tags.className = 'trophy-tags';
    const grade = document.createElement('span');
    grade.className = `tag grade-${t.grade}`;
    grade.textContent = gradeLabel(t.grade);
    tags.appendChild(grade);
    const kind = document.createElement('span');
    kind.className = 'tag';
    kind.textContent = t.kind;
    tags.appendChild(kind);
    if (t.hidden) {
      const h = document.createElement('span');
      h.className = 'tag hidden-tag';
      h.textContent = 'Hidden';
      tags.appendChild(h);
    }
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag missable';
      m.textContent = '⚠ Missable';
      tags.appendChild(m);
    }
    if (t.psnCount) {
      const c = document.createElement('span');
      c.className = 'tag';
      c.textContent = `PSN count: ${t.psnCount.toLocaleString('en-US')}`;
      tags.appendChild(c);
    }
    main.appendChild(tags);
    row.appendChild(main);

    const right = document.createElement('span');
    right.className = 'tag';
    right.textContent = earned.has(t.id) ? 'Earned' : `#${t.id}`;
    row.appendChild(right);
    li.appendChild(row);
    listEl.appendChild(li);
  }
}

export function renderDetail(pane, trophy, earned, spoilerOn) {
  pane.innerHTML = '';
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'detail-hint';
    p.textContent = 'Select a trophy to see its guide, steps and sources.';
    pane.appendChild(p);
    return;
  }
  const hidden = isSpoilerHidden(trophy, spoilerOn, earned);
  const h2 = document.createElement('h2');
  h2.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  pane.appendChild(h2);
  const official = document.createElement('p');
  official.className = 'detail-official';
  official.textContent = hidden
    ? 'Official name and description hidden until earned (spoiler-safe setting is on).'
    : `Official: “${trophy.description}” — ${gradeLabel(trophy.grade)}${trophy.hidden ? ' · Hidden on PlayStation' : ''}${trophy.missable ? ' · Missable' : ''}`;
  pane.appendChild(official);
  if (!hidden) {
    const guideTitle = document.createElement('h3');
    guideTitle.textContent = 'Guide';
    pane.appendChild(guideTitle);
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    pane.appendChild(guide);
    const stepsTitle = document.createElement('h3');
    stepsTitle.textContent = 'Steps';
    pane.appendChild(stepsTitle);
    const ol = document.createElement('ol');
    for (const step of trophy.steps || []) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    }
    pane.appendChild(ol);
  }
  const srcTitle = document.createElement('h3');
  srcTitle.textContent = 'Sources';
  pane.appendChild(srcTitle);
  const ul = document.createElement('ul');
  ul.className = 'source-list';
  for (const s of trophy.sources || []) {
    const li = document.createElement('li');
    li.textContent = s;
    ul.appendChild(li);
  }
  pane.appendChild(ul);
  const links = document.createElement('p');
  links.className = 'source-links';
  links.textContent = 'Exophase: exophase.com/game/grand-theft-auto-vi-psn/trophies/ · PSNProfiles: psnprofiles.com/trophies/43531-grand-theft-auto-vi';
  pane.appendChild(links);
}

export function renderRoadmap(container, trophies, earned) {
  container.innerHTML = '';
  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('article');
    card.className = 'stage-card';
    const h3 = document.createElement('h3');
    h3.textContent = stage.title;
    card.appendChild(h3);
    const meta = document.createElement('p');
    meta.className = 'stage-meta';
    const done = stageTrophies(trophies, stage.stage).filter((t) => earned.has(t.id)).length;
    const total = stageTrophies(trophies, stage.stage).length;
    meta.textContent = `${stage.meta} · ${done}/${total} earned in this stage`;
    card.appendChild(meta);
    const body = document.createElement('p');
    body.textContent = stage.body;
    card.appendChild(body);
    const ul = document.createElement('ul');
    for (const b of stage.bullets) {
      const li = document.createElement('li');
      li.textContent = b;
      ul.appendChild(li);
    }
    card.appendChild(ul);
    container.appendChild(card);
  }
}

export function renderMissable(container, trophies, earned) {
  container.innerHTML = '';
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) {
    const card = document.createElement('article');
    card.className = 'missable-card';
    const h3 = document.createElement('h3');
    h3.textContent = `⚠ ${t.name} — ${gradeLabel(t.grade)} · ${earned.has(t.id) ? 'Earned' : 'Not yet earned'}`;
    card.appendChild(h3);
    const official = document.createElement('p');
    official.textContent = `Official description: “${t.description}”`;
    card.appendChild(official);
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    card.appendChild(guide);
    const ol = document.createElement('ol');
    for (const step of t.steps || []) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.appendChild(li);
    }
    card.appendChild(ol);
    container.appendChild(card);
  }
}
