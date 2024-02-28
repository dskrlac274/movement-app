CREATE TABLE IF NOT EXISTS user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    photo VARCHAR(64),
    is_active INTEGER DEFAULT 1,
    blocked_until DATETIME,
    ratings_average REAL DEFAULT 0,
    ratings_quantity INTEGER DEFAULT 0,
    email VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS task_difficulty(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS task_status(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS task(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status_id INTEGER NOT NULL,
    difficulty_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    name VARCHAR(128) NOT NULL,
    reward VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    group_size INTEGER NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_activity INTEGER DEFAULT 1,
    FOREIGN KEY(status_id) REFERENCES task_status(id),
    FOREIGN KEY (difficulty_id) REFERENCES task_difficulty(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS task_user(
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    rating INTEGER DEFAULT NULL,
    valid_until DATETIME DEFAULT NULL,
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (task_id) REFERENCES task(id)
);

INSERT OR IGNORE INTO task_status (name) VALUES
    ('pending'),
    ('full'),
    ('missed'),
    ('completed');

INSERT OR IGNORE INTO task_difficulty (name) VALUES
    ('easy'),
    ('medium'),
    ('hard');

SELECT * FROM task_difficulty;