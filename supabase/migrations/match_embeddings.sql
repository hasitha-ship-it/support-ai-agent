-- ============================================================
-- Migration: Add match_embeddings pgvector search function
-- Run this in your Supabase SQL Editor
-- ============================================================

-- This function performs cosine-similarity search over knowledge_embeddings
-- for a specific workspace. Used by /api/chat for RAG context injection.

CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_workspace_id uuid,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  content_chunk text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ke.content_chunk,
    1 - (ke.embedding <=> query_embedding) AS similarity
  FROM
    knowledge_embeddings ke
  WHERE
    ke.workspace_id = match_workspace_id
  ORDER BY
    ke.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
