// Filtering and the spoiler rule for Leonida Nights. Pure functions, so the
// checklist view stays a thin shell around them.
export function applyFilters(trophies, earned, { query, kind, grade, earnedFilter }) {
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    if (kind === 'missable') {
      if (!t.missable) return false;
    } else if (kind !== 'all' && t.kind !== kind) {
      return false;
    }
    if (grade !== 'all' && t.grade !== grade) return false;
    const has = earned.has(t.id);
    if (earnedFilter === 'earned' && !has) return false;
    if (earnedFilter === 'not' && has) return false;
    return true;
  });
}

// A trophy is spoiler-hidden only when the setting is on, the trophy is a
// story trophy, and the player has not earned it yet.
export function isSpoiled(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.id);
}
