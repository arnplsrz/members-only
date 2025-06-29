-- Insert 10 random posts with random user_id from users table
INSERT INTO posts (user_id, title, content)
SELECT 
  u.id,
  t.title,
  t.content
FROM 
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 10) u,
  (VALUES
    ('A Day in the Park', 'Enjoyed a sunny afternoon at the park with friends and family. Great weather and lots of fun!'),
    ('Learning SQL', 'Started learning SQL today. It is both challenging and rewarding!'),
    ('Coffee Break', 'Had the best cup of coffee this morning. Feeling energized for the day ahead!'),
    ('Book Recommendation', 'Just finished reading an amazing book. Highly recommend it to everyone!'),
    ('Workout Complete', 'Completed my workout session. Feeling strong and accomplished!'),
    ('Movie Night', 'Watched a great movie last night. The plot twist was unexpected!'),
    ('Cooking Adventure', 'Tried a new recipe today. It turned out delicious!'),
    ('Tech News', 'Excited about the latest tech updates announced this week.'),
    ('Weekend Plans', 'Looking forward to a relaxing weekend with family.'),
    ('Motivation', 'Stay positive and keep moving forward!')
  ) AS t(title, content)
ORDER BY RANDOM()
LIMIT 10;