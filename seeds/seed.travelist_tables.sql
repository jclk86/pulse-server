BEGIN;

TRUNCATE 
  travelist_comments,
  travelist_articles,
  travelist_users
  RESTART IDENTITY CASCADE;

INSERT INTO travelist_users (fullname, username, password, email)
  VALUES
    ('Chuck Norris', 'CNorris', '$2a$12$bvk/RMGag/GcKw2Nu4xHreJtxHwBVjUDXVV/adljdAoriwRUADu8G', 'CNorris@gmail.com'),
    ('Matt Damon', 'Damonite', '$2a$12$g.BlEbps0qlA2MtnXxLaDu8hCLJJqsGXouJpI4xbAakyoKzXIgUZS', 'Damonite@gmail.com'),
    ('Lucy Liu', 'LucyL', '$2a$12$HJWGdn6.qcuC/w0/xZfrPeJzGwf3TJEh7brxJ9Ej3y9yWOjtPEgvy', 'LucyL@gmail.com'),
    ('Sarah Jones', 'SJones23', '$2a$12$ECUJfdfKvwfUo49JdLcHgu7dPeLB3TGqJTxNRwTloYrEqFAoaWXie', 'SJones23@gmail.com'),
    ('Ben Askren', 'BAskren', '$2a$12$n0OOCm52j/KEwZ4cKd7oducp6Z8G4TvK3sYD98irOOLueDIYFCpg2', 'BAskren@gmail.com');    

INSERT INTO travelist_articles (title, style, author_id, content )
  VALUES 
    ('Point of No Return', 'Diary', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero nunc consequat interdum varius sit. Amet mauris commodo quis imperdiet massa.'),
    ('Free Soloing for the First Time', 'Advice', 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero nunc consequat interdum varius sit. Amet mauris commodo quis imperdiet massa.'),
    ('The Time Bear Grylls Saved My Life', 'Random', 3, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At varius vel pharetra vel turpis nunc eget lorem dolor. At ultrices mi tempus imperdiet nulla malesuada.'),
    ('Heat Wave', 'News', 4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus est pellentesque elit ullamcorper. At tellus at urna condimentum mattis pellentesque id nibh.'),
    ('Travel Forever on this Budget', 'Guide', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Sit amet consectetur adipiscing elit ut aliquam purus sit.');

INSERT INTO travelist_comments (content, article_id, user_id)
  VALUES
    ('You are my hero!', 1, 5),
    ('This is the craziest thing ever! So dangerous!', 2, 3),
    ('Yo! We should meet up sometime!', 3, 4),
    ('Cool story!', 1, 3),
    ('Wish you the best of luck!', 4, 1);

COMMIT;