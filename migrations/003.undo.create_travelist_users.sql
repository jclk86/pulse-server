ALTER TABLE travelist_articles
  DROP COLUMN IF EXISTS author_id;

DROP TABLE IF EXISTS travelist_users;