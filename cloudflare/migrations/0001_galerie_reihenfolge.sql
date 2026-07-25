CREATE TABLE IF NOT EXISTS galerie_reihenfolge (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  reihenfolge TEXT NOT NULL CHECK (json_valid(reihenfolge)),
  aktualisiert_am TEXT NOT NULL
);
