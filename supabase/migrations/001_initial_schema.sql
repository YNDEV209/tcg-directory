CREATE TABLE games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT
);

CREATE TABLE sets (
  id TEXT PRIMARY KEY,
  game_id TEXT REFERENCES games(id),
  name TEXT NOT NULL,
  series TEXT,
  release_date DATE,
  logo_url TEXT,
  symbol_url TEXT,
  total INTEGER
);

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  game_id TEXT REFERENCES games(id),
  set_id TEXT REFERENCES sets(id),
  name TEXT NOT NULL,
  image_small TEXT,
  image_large TEXT,
  supertype TEXT,
  subtypes TEXT[],
  types TEXT[],
  hp INTEGER,
  rarity TEXT,
  artist TEXT,
  flavor_text TEXT,
  number TEXT,
  attacks JSONB,
  abilities JSONB,
  weaknesses JSONB,
  resistances JSONB,
  retreat_cost INTEGER,
  legalities JSONB,
  prices JSONB,
  evolves_from TEXT,
  evolves_to TEXT[],
  raw_data JSONB
);

CREATE INDEX idx_cards_name ON cards USING gin(to_tsvector('english', name));
CREATE INDEX idx_cards_game ON cards(game_id);
CREATE INDEX idx_cards_set ON cards(set_id);
CREATE INDEX idx_cards_types ON cards USING gin(types);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_supertype ON cards(supertype);
CREATE INDEX idx_cards_hp ON cards(hp);

INSERT INTO games (id, name) VALUES ('pokemon', 'Pokemon TCG');
