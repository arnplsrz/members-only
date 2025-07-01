INSERT INTO posts (user_id, title, content, timestamp)
SELECT 
  u.id,
  t.title,
  t.content,
  NOW() - (INTERVAL '1 day' * FLOOR(RANDOM() * 7))
FROM 
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 10) u,
  (VALUES
    ('Lorem Ipsum 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae justo nec urna cursus.'),
    ('Lorem Ipsum 2', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'),
    ('Lorem Ipsum 3', 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
    ('Lorem Ipsum 4', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
    ('Lorem Ipsum 5', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.'),
    ('Lorem Ipsum 6', 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et.'),
    ('Lorem Ipsum 7', 'Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada.'),
    ('Lorem Ipsum 8', 'Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.'),
    ('Lorem Ipsum 9', 'Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.'),
    ('Lorem Ipsum 10', 'Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.')
  ) AS t(title, content)
ORDER BY RANDOM()
LIMIT 10;