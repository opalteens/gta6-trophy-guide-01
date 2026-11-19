// Roadmap data: three stages built from the official descriptions, about 200 hours total.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Story first (about 60 hours)',
    meta: '18 trophies · Chapters 1–4, mission trophies, partner feats',
    body: 'Play the story in order, Chapters 1 to 4, and take every mission trophy as it comes: Gone Fishing, the four chapter trophies, Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory, and the final mission gold. Do the partner feats while your partner is beside you (Hot Together, Retail Therapy) and the open-world moments the story walks you past (Ocean Beach cocktail, the VCIA departure, Combat Focus).',
    bullets: [
      'Keep a manual save before every major story decision — Actions Speak Louder is the one missable trophy.',
      'Finish the story before grinding: counts and collectibles stay available afterwards.',
      'Gold here: You Gotta Know When to Get Off (final mission).',
    ],
  },
  {
    stage: 2,
    title: 'Stage 2 — Leonida open world (about 80 hours)',
    meta: '31 trophies · Strangers, collectibles, activities, robberies',
    body: 'After the story, work the map region by region: the five named stranger strands (Andy, Kenton, Billy, Randy, Tyrone) plus three more for Strangers & Freaks; meditation spots, card sets, WAiNK locations, vehicles and map areas; races, drone races, fishing against Cal, the shooting range, bowling, and the robbery set (jewelry store unseen, 5 bank vaults, armored truck, one illegal operation per gang).',
    bullets: [
      'Hardest silver here: The Shootist — gold in all 42 Shooting Range challenges.',
      'Longest grinds here: 100 WAiNK locations and 100 vehicles discovered.',
      'Sneakthief and Retail Therapy reward patience over speed — plan, then strike.',
    ],
  },
  {
    stage: 3,
    title: 'Stage 3 — Grinds and 100% (about 60 hours)',
    meta: '6 trophies · 100% completion, money, challenges, platinum',
    body: 'Close out the long tails: 250 stunts, 50 challenges, $250,000 laundered in Marked Bills, $100,000 spent across shops, every garage property, and 100% completion for A Long Road. When the tracker reads 54 of 55, the platinum — Vice Got a Price! — unlocks with the last trophy.',
    bullets: [
      'Launder Marked Bills through contacts as you earn them; do not hoard them.',
      'Spend late, when money is plentiful, to finish Treat Yo Self in one big purchase.',
      'Gold here: A Long Road (100% completion). Then the platinum pops.',
    ],
  },
];

export function stageTrophies(trophies, stage) {
  return trophies.filter((t) => t.stage === stage);
}
