import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucketName = 'siakad';

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Uploads a file buffer to the Supabase storage bucket and returns its public URL.
   * @param fileBuffer The buffer of the file.
   * @param path The destination path inside the bucket (e.g. 'avatars/user-123.png').
   * @param mimeType The MIME type of the file.
   */
  async uploadFile(
    fileBuffer: Buffer,
    path: string,
    mimeType: string,
  ): Promise<string> {
    const { data, error } = await this.supabaseService.client.storage
      .from(this.bucketName)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Failed to upload file to ${path}:`, error.message);
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }

    this.logger.log(`Uploaded file successfully: ${data.path}`);
    return this.getPublicUrl(path);
  }

  /**
   * Deletes a file from the Supabase storage bucket by its path.
   * @param path The path of the file to delete (e.g. 'avatars/user-123.png').
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabaseService.client.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      this.logger.error(`Failed to delete file from ${path}:`, error.message);
      throw new InternalServerErrorException(
        `Failed to delete file: ${error.message}`,
      );
    }

    this.logger.log(`Deleted file successfully: ${path}`);
  }

  /**
   * Generates and returns the public URL for a given file path.
   * @param path The path inside the bucket.
   */
  getPublicUrl(path: string): string {
    const { data } = this.supabaseService.client.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
