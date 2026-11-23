// Pure weekly packet planner; generator injected for testing.
const buildPacket = (students, days, generate) => {
  if (!Array.isArray(students) || students.length === 0 ||
      !Number.isInteger(days) || days < 1 || days > 7 ||
      typeof generate !== 'function') throw Error('Invalid packet');
  const entries = [];
  for (const student of students) {
    if (!student || typeof student.name !== 'string' || !student.name.trim() ||
        !Array.isArray(student.kinds) || student.kinds.length === 0 ||
        student.kinds.some(kind => typeof kind !== 'string' || !kind.trim()))
      throw Error('Invalid student profile');
    for (let day = 1; day <= days; day++) {
      for (const kind of student.kinds) {
        const result = generate(kind, student);
        if (!result || typeof result.instructions !== 'string' ||
            !Array.isArray(result.items) || result.items.length === 0 ||
            result.items.some(item => !item || typeof item.q !== 'string' ||
              !item.q || typeof item.a !== 'string' || !item.a))
          throw Error('Invalid worksheet result');
        entries.push({student: student.name, day, kind, result});
      }
    }
  }
  return entries;
};
if (typeof module !== 'undefined') module.exports = buildPacket;
