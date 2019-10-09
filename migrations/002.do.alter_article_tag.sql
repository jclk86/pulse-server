CREATE TYPE article_tag AS ENUM (
  'News',
  'Interview',
  'Guide',
  'Diary',
  'Random',
  'Advice'
);

ALTER TABLE travelist_articles
  ADD COLUMN
    article_tag TEXT;
    
    -- was style article_tag