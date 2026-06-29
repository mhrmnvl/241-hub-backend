import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from '../repositories/files.repository.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DeleteFileUseCase {
  constructor(private readonly repo: FilesRepository) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    
    // Soft delete in the database
    await this.repo.softDelete(id);

    // Clean up physical file to save space
    const filePath = path.join(process.cwd(), existing.storageKey);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete physical file: ${filePath}`, err);
      }
    }
  }
}
