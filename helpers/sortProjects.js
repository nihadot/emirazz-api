export const sortProjects = (items) => {
  items.sort((a, b) => {
    if (a.priority && b.priority) {
      let priorityA = parseInt(a.priority);
      let priorityB = parseInt(b.priority);

      if (priorityA < priorityB) return -1;
      if (priorityA > priorityB) return 1;
    } else if (a.priority) {
      return -1;
    } else if (b.priority) {
      return 1;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return items
};
