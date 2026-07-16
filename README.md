# Patient Complaint Intelligence Pipeline

A React dashboard concept for a Patient Complaint Intelligence Pipeline that shows an 8-step workflow from initial complaint intake through AI classification, risk scoring, escalation, dashboards, policy updates, and model retraining.

## Local AI Assistant: real implementation steps

The local assistant architecture is intended to let an operator ask questions over private files without manually opening every document. In practice, use it as a retrieval-augmented workflow:

1. **Create a local workspace**
   - Pick a secured folder on the machine, for example `~/LocalAssistantVault`.
   - Add subfolders for `Documents`, `Research`, `Certificates`, `Photos`, and any other approved hard-disk archives.
   - Keep sensitive or regulated files only in approved storage locations.

2. **Ingest files into a SQLite index**
   - Scan the workspace recursively.
   - For each file, store metadata such as path, filename, file type, modified date, source category, and checksum.
   - Extract searchable text from PDFs, Word documents, spreadsheets, plain text files, and OCR-ready images where permitted.

3. **Create local search and embedding records**
   - Split extracted text into small chunks, usually 300–800 tokens each.
   - Store each chunk in SQLite with its source document metadata.
   - Generate embeddings for each chunk and store vectors locally or in a local vector extension/database.
   - Keep a standard keyword index as a fallback for exact names, certificate IDs, dates, and policy numbers.

4. **Ask a question through the assistant**
   - The user asks a natural-language question, such as: `Which accreditation certificates expire in the next 90 days?`
   - The assistant searches metadata, keyword matches, and embeddings.
   - It retrieves the most relevant chunks and sends only that selected context to the model.

5. **Generate a cited answer**
   - GPT/Codex uses the retrieved local context to draft an answer.
   - The answer should include source references such as filenames, sections, dates, or page numbers.
   - If no reliable local evidence is found, the assistant should say that instead of guessing.

6. **Review and act**
   - The operator reviews the cited source files before making decisions.
   - Approved findings can become dashboard notes, policy-cycle inputs, audit evidence, or task-queue items.
   - Any policy, clinical, legal, or compliance decision should remain human-approved.

7. **Maintain the system**
   - Re-index changed files on a schedule or via file-watch events.
   - Rebuild embeddings when documents change materially.
   - Audit access logs, failed searches, and generated answers.
   - Periodically remove stale documents and verify that permissions still match organizational policy.

## Minimal production checklist

- [ ] Secured local file vault with clear folder taxonomy.
- [ ] SQLite schema for documents, chunks, metadata, and indexing status.
- [ ] Text extraction pipeline for each approved file type.
- [ ] Embedding generation and local vector search.
- [ ] Retrieval step that limits model context to relevant local excerpts.
- [ ] Answer format with source citations and uncertainty handling.
- [ ] Human review workflow for operational, policy, or compliance actions.
- [ ] Re-indexing, access control, and audit logging.
