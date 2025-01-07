const result = await BlogModel.updateMany(
    {}, // Match all documents
    { $set: { isDelete: false } } // Replace `newField` and `defaultValue` with your new field and value
  );
  