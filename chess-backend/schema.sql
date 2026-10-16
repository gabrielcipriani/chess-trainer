CREATE TABLE repertoires (
  id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('white', 'black'))
);

CREATE TABLE nodes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  repertoire_id INTEGER NOT NULL REFERENCES repertoires(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES nodes(id) ON DELETE CASCADE,
  move TEXT,
  UNIQUE (parent_id, move)
);

CREATE INDEX nodes_repertoire_id_idx ON nodes(repertoire_id);