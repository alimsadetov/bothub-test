  CREATE TABLE "models" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "context_length" INTEGER,
    "tokenizer" VARCHAR(255),
    "modality" VARCHAR(255)
     );