export const clearDocuments = (items) => {
  try {
    let arr = [];

    for (let project of items) {
      project ? arr.push({ ...project._doc }) : null;
    }

    return arr;
  } catch (error) {
    console.log(error.message);
  }
};
