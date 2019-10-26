BEGIN;

TRUNCATE
  travelist_votes,
  travelist_comments,
  travelist_articles,
  travelist_categories,
  travelist_users
  RESTART IDENTITY CASCADE;

INSERT INTO travelist_users (fullname, username, password, email, "profile", image_url)
  VALUES
    ('Chuck Norris', 'CNorris', '$2a$12$bvk/RMGag/GcKw2Nu4xHreJtxHwBVjUDXVV/adljdAoriwRUADu8G', 'CNorris@gmail.com', 'About me!', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'),
    ('Matt Damon', 'Damonite', '$2a$12$g.BlEbps0qlA2MtnXxLaDu8hCLJJqsGXouJpI4xbAakyoKzXIgUZS', 'Damonite@gmail.com', 'About me!', 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'),
    ('Lucy Liu', 'LucyL', '$2a$12$HJWGdn6.qcuC/w0/xZfrPeJzGwf3TJEh7brxJ9Ej3y9yWOjtPEgvy', 'LucyL@gmail.com', 'About me!', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'),
    ('Sarah Jones', 'SJones23', '$2a$12$ECUJfdfKvwfUo49JdLcHgu7dPeLB3TGqJTxNRwTloYrEqFAoaWXie', 'SJones23@gmail.com', 'About me!', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'),
    ('Ben Askren', 'BAskren', '$2a$12$n0OOCm52j/KEwZ4cKd7oducp6Z8G4TvK3sYD98irOOLueDIYFCpg2', 'BAskren@gmail.com', 'About me!', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');    

INSERT INTO travelist_categories ("name")
  VALUES  
    ('Diary'),
    ('Advice'),
    ('Guide'),
    ('Random'),
    ('News'),
    ('Interview');

INSERT INTO travelist_articles (title, article_category, author_id, image_url, content)
  VALUES 
    ('Point of No Return', 'Diary', 1, 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero nunc consequat interdum varius sit. Amet mauris commodo quis imperdiet massa.'),
    ('Free Soloing for the First Time', 'Advice', 2, 'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Libero nunc consequat interdum varius sit. Amet mauris commodo quis imperdiet massa.'),
    ('The Time Bear Grylls Saved My Life', 'Random', 3, 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At varius vel pharetra vel turpis nunc eget lorem dolor. At ultrices mi tempus imperdiet nulla malesuada.'),
    ('Heat Wave', 'News', 4, 'https://images.pexels.com/photos/1123972/pexels-photo-1123972.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus est pellentesque elit ullamcorper. At tellus at urna condimentum mattis pellentesque id nibh.'),
    ('Travel Forever on this Budget', 'Guide', 5, 'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Sit amet consectetur adipiscing elit ut aliquam purus sit.');

INSERT INTO travelist_comments (content, article_id, user_id)
  VALUES
    ('You are my hero!', 1, 5),
    ('This is the craziest thing ever! So dangerous!', 2, 3),
    ('Yo! We should meet up sometime!', 3, 4),
    ('Cool story!', 1, 3),
    ('Wish you the best of luck!', 4, 1);

INSERT INTO travelist_votes (article_id, user_id, voted)
  VALUES
    (2, 1, true),
    (2, 2, true),
    (3, 2, true),
    (3, 1, true);

COMMIT;

