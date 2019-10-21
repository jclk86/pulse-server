const CategoriesService = {
  getAllCategories(db) {
    return db.from("travelist_categories").select("*");
  },
  getByName(db, name) {
    return db
      .from("travelist_categories as cat")
      .select("*")
      .where("cat.name", name)
      .first();
  }
};

module.exports = CategoriesService;
