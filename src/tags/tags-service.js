const TagsService = {
  getAllTags(db) {
    return db.from("travelist_tags").select("*");
  },
  getByName(db, name) {
    return db
      .from("travelist_tags as tags")
      .select("*")
      .where("tags.name", name)
      .first();
  }
};

module.exports = TagsService;
