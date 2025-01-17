CREATE TABLE users (
   id bigserial,
   chat_id bigint PRIMARY KEY,
   name text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payme (
   id bigserial PRiMARY KEY,
   chat_id bigint,
   payment text,
   state int DEFAULT 0,
   amount int,
   create_time bigint DEFAULT 0,
   perform_time bigint DEFAULT 0,
   cancel_time bigint DEFAULT 0,
   transaction text,
   reason int,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
   id bigserial PRiMARY KEY,
   click_id text,
   amount text,
   tarif text,
   chat_id bigint,
   merchant_id text,
   error text,
   error_note text,
   status text,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);