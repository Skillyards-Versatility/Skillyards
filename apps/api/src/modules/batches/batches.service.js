import * as batchRepo from "./batches.repository.js";

export async function getBatchesList(db, courseName = null) {
  return batchRepo.getBatchesWithCount(db, courseName);
}

export async function createBatch(db, data) {
  return batchRepo.createBatchRecord(db, data);
}

export async function getBatch(db, batchId) {
  return batchRepo.getBatchById(db, batchId);
}
