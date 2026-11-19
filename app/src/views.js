// Views for Leonida Nights: the checklist and detail pane, the roadmap and
// the missable page. The roadmap is built from the official descriptions:
// story chapters and missions first, then collectibles and counts, then the
// long grinds, ending at 100 percent completion and the platinum.
import { applyFilters, isSpoiled } from './filters.js';

export const ROADMAP = [
  {
    title: 'Stage 1 — Story first, about 60 hours',
    blurb: 'Play the story straight through. Every chapter and mission trophy lands here, and so does the one missable trophy, so read its warning before you start.',
    items: [
      'Complete the opening mission Gone Fishing and Chapters 1 to 4 (Just Like Paradise, Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma).',
      'Finish the named story missions: Breakfast Run, The Cartel Heist, Child\'s Play, Headliners, VCIA Takedown and Operation Savage Glory.',
      'Finish the final mission for the gold story trophy, You Gotta Know When to Get Off.',
      'While you play, make story choices deliberately: Actions Speak Louder counts your choices and is the only missable trophy. Keep a manual save before big decisions.',
      'On the way, sample each activity type once for Master of None, and try the early easy moments: a cocktail on Ocean Beach, a frame at the Kolt & Associates bowling alley.',
    ],
  },
  {
    title: 'Stage 2 — The open world, about 80 hours',
    blurb: 'After the story, sweep Leonida in free roam. This is the collectible and activity stage.',
    items: [
      'Explore all 52 areas of Leonida for The Goodtime State, and discover 100 vehicles for Whip It Good.',
      'Meditate at all 18 spots, complete 3 collectible card sets, WAiNK It at 100 locations, buy all 8 garage properties and register 10 vehicles to the Scooter Bros app.',
      'Finish the character strands for Andy, Kenton, Billy, Randy and Tyrone, and complete 8 stranger strands for Strangers & Freaks.',
      'Work the activities: 42 Shooting Range gold medals, drone races at all 14 locations, 20 different race wins, fishing against Cal, one arcade game, and 50 challenges.',
      'Hunt the unique animal for Bret, lose a 4-star wanted level with your partner, and rob 3 shops back-to-back for Retail Therapy.',
    ],
  },
  {
    title: 'Stage 3 — The long grind, about 60 hours',
    blurb: 'The counters. Everything left is a number to reach, then the platinum.',
    items: [
      'Pull off 250 stunts, rob 5 bank vaults, rob an armored truck, rob an illegal operation for each of the 9 gangs, and take down 5 enemies in one Combat Focus.',
      'Launder $250,000 of Marked Bills through your contacts and spend $100,000 across all shops.',
      'Finish the count for Actions Speak Louder, then check the in-game completion counter: when it reads 100 percent, A Long Road pops.',
      'Vice Got a Price! — the platinum — unlocks automatically with the last trophy. About 200 hours in all.',
    ],
  },
];

const SOURCE_LINKS = {
  'Exophase — official trophy list': 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  'PSNProfiles — PSN count: 250': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 42': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 14': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 20': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 8': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 18': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 3': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 100': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 50': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 5': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 52': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 9': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 500': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: $250,000': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: $100,000': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  'PSNProfiles — PSN count: 10': 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
};

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderChecklist(list, trophies, earned, filters, spoilerOn, selectedId, onSelect, onToggle) {
  const shown = applyFilters(trophies, earned, filters);
  document.getElementById('listCount').textContent = `${shown.length} of ${trophies.length} trophies shown`;
  list.replaceChildren();
  for (const t of shown) {
    const li = el('li');
    if (earned.has(t.id)) li.classList.add('earned');
    if (t.id === selectedId) li.classList.add('selected');
    const spoiled = isSpoiled(t, earned, spoilerOn);
    if (spoiled) li.classList.add('spoiled');
    const head = el('div', 'trophy-head');
    const tick = el('input');
    tick.type = 'checkbox';
    tick.checked = earned.has(t.id);
    tick.className = 'tick';
    tick.setAttribute('aria-label', `Earned: ${t.name}`);
    tick.addEventListener('click', (event) => event.stopPropagation());
    tick.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(t.id, tick.checked);
    });
    head.append(tick);
    head.append(el('span', 'trophy-name', spoiled ? 'Hidden trophy' : t.name));
    if (t.missable) head.append(el('span', 'flag', 'Missable'));
    const grade = el('span', `grade ${t.grade}`, t.grade);
    head.append(grade);
    li.append(head);
    li.append(el('p', 'trophy-desc', spoiled ? 'Hidden until earned — turn the spoiler setting off to see it.' : t.description));
    li.addEventListener('click', () => onSelect(t.id));
    list.append(li);
  }
}

export function renderDetail(trophy, earned, spoilerOn, onToggle) {
  const empty = document.getElementById('detailEmpty');
  const body = document.getElementById('detailBody');
  if (!trophy) {
    empty.hidden = false;
    body.hidden = true;
    return;
  }
  empty.hidden = true;
  body.hidden = false;
  const spoiled = isSpoiled(trophy, earned, spoilerOn);
  body.classList.toggle('spoiled', spoiled);
  document.getElementById('detailName').textContent = spoiled ? 'Hidden trophy' : trophy.name;
  const grade = document.getElementById('detailGrade');
  grade.textContent = trophy.grade;
  grade.className = `grade ${trophy.grade}`;
  document.getElementById('detailKind').textContent = trophy.kind === 'story' ? 'Story' : trophy.kind === 'collectibles' ? 'Collectible' : 'Activity';
  document.getElementById('detailMissable').hidden = !trophy.missable;
  document.getElementById('detailDesc').textContent = spoiled ? 'Hidden until earned.' : trophy.description;
  document.getElementById('detailGuide').textContent = spoiled ? 'Turn the spoiler setting off, or earn this trophy, to read its guide.' : trophy.guide;
  const steps = document.getElementById('detailSteps');
  steps.replaceChildren();
  for (const s of trophy.steps) steps.append(el('li', null, spoiled ? 'Hidden until earned.' : s));
  const sources = document.getElementById('detailSources');
  sources.replaceChildren();
  for (const s of trophy.sources) {
    const li = el('li');
    const href = SOURCE_LINKS[s];
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = s;
      li.append(a);
    } else {
      li.textContent = s;
    }
    sources.append(li);
  }
  const earnedBox = document.getElementById('detailEarned');
  earnedBox.checked = earned.has(trophy.id);
  earnedBox.onchange = () => onToggle(trophy.id, earnedBox.checked);
}

export function renderRoadmap(container) {
  container.replaceChildren();
  for (const stage of ROADMAP) {
    const div = el('div', 'stage');
    div.append(el('h3', null, stage.title));
    div.append(el('p', null, stage.blurb));
    const ul = el('ul');
    for (const item of stage.items) ul.append(el('li', null, item));
    div.append(ul);
    container.append(div);
  }
}

export function renderMissable(container, trophy) {
  container.replaceChildren();
  if (!trophy) {
    container.append(el('p', null, 'No missable trophy is flagged in the list.'));
    return;
  }
  const card = el('div', 'missable-card');
  card.append(el('h3', null, `${trophy.name} — ${trophy.grade}`));
  card.append(el('p', 'detail-desc', trophy.description));
  card.append(el('p', null, trophy.guide));
  const steps = el('ol');
  for (const s of trophy.steps) steps.append(el('li', null, s));
  card.append(steps);
  card.append(el('p', 'spoiler-note', 'Sources: the official trophy list on Exophase for the name, description and grade; PSNProfiles for the PSN count of 500. The exact list of choices is not pinned down in the sources available at writing time, so this guide does not guess it.'));
  container.append(card);
}
